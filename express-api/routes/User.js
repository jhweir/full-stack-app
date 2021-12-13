require("dotenv").config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const authenticateToken = require('../middleware/authenticateToken')
const { postAttributes } = require('../GlobalConstants')
const { Holon, User, Post, Reaction, Link, GlassBeadGame, GlassBead } = require('../models')

// GET
router.get('/all-users', (req, res) => {
    const { accountId, timeRange, userType, sortBy, sortOrder, searchQuery, limit, offset } = req.query

    console.log('req.query: ', req.query)

    function findStartDate() {
        let offset = undefined
        if (timeRange === 'Last Year') { offset = (24*60*60*1000) * 365 }
        if (timeRange === 'Last Month') { offset = (24*60*60*1000) * 30 }
        if (timeRange === 'Last Week') { offset = (24*60*60*1000) * 7 }
        if (timeRange === 'Last 24 Hours') { offset = 24*60*60*1000 }
        if (timeRange === 'Last Hour') { offset = 60*60*1000 }
        let startDate = new Date()
        startDate.setTime(startDate.getTime() - offset)
        return startDate
    }

    function findOrder() {
        let direction, order
        if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
        if (sortBy === 'Date') { order = [['createdAt', direction]] }
        else { order = [[sequelize.literal(`total${sortBy}`), direction]] }
        return order
    }

    function findFirstAttributes() {
        let firstAttributes = ['id']
        if (sortBy === 'Posts') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Posts
                WHERE Posts.state = 'visible'
                AND Posts.creatorId = User.id
            )`), 'totalPosts'
        ])}
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Comments
                WHERE Comments.creatorId = User.id
            )`), 'totalComments'
        ])}
        return firstAttributes
    }

    let startDate = findStartDate()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()

    User.findAll({
        where: {
            emailVerified: true,
            createdAt: { [Op.between]: [startDate, Date.now()] },
            [Op.or]: [
                { handle: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { bio: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
            ]
        },
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: firstAttributes,
        subQuery: false
    })
    .then(users => {
        console.log('users: ', users)
        User.findAll({ 
            where: { id: users.map(user => user.id) },
            attributes: [
                'id', 'handle', 'name', 'bio', 'flagImagePath', 'coverImagePath', 'createdAt',
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Posts
                        WHERE Posts.state = 'visible'
                        AND Posts.creatorId = User.id
                    )`), 'totalPosts'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Comments
                        WHERE Comments.creatorId = User.id
                    )`), 'totalComments'
                ],
            ],
            order,
            // include: []
        }).then(data => { res.json(data) })
    })
    .catch(err => console.log(err))
})

router.get('/user-data', (req, res) => {
    const { userHandle } = req.query
    User.findOne({ 
        where: { handle: userHandle },
        attributes: ['id', 'handle', 'name', 'bio', 'flagImagePath', 'coverImagePath', 'createdAt'],
        include: [
            { 
                model: Holon,
                as: 'FollowedHolons',
                attributes: ['handle', 'name', 'flagImagePath'],
                through: { where: { relationship: 'follower', state: 'active' }, attributes: [] }
            },
            { 
                model: Holon,
                as: 'ModeratedHolons',
                attributes: ['handle', 'name', 'flagImagePath'],
                through: { where: { relationship: 'moderator', state: 'active' }, attributes: [] }
            }
            // { 
            //     model: Comment,
            //     //attributes: ['creator', 'text', 'createdAt']
            // }
        ]
    })
    .then(user => { res.json(user) })
    .catch(err => console.log(err))
})

router.get('/user-posts', (req, res) => {
    const { accountId, userId, timeRange, postType, sortBy, sortOrder, searchQuery, limit, offset } = req.query

    function findStartDate() {
        const hour = 60*60*1000
        const day = hour * 24
        let offset = undefined
        if (timeRange === 'Last Year') { offset = day * 365 }
        if (timeRange === 'Last Month') { offset = day * 30 }
        if (timeRange === 'Last Week') { offset = day * 7 }
        if (timeRange === 'Last 24 Hours') { offset = day }
        if (timeRange === 'Last Hour') { offset = hour }
        var startDate = new Date()
        startDate.setTime(startDate.getTime() - offset)
        return startDate
    }

    function findType() {
        let type
        if (postType === 'All Types') { type = ['text', 'url', 'glass-bead-game', 'prism'] } //'poll','decision-tree',  'prism', 'plot-graph']
        if (postType !== 'All Types') { type = postType.replace(/\s+/g, '-').toLowerCase() }
        return type
    }

    function findOrder() {
        let direction, order
        if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
        if (sortBy === 'Date') { order = [['createdAt', direction]] }
        if (sortBy === 'Reactions') { order = [[sequelize.literal(`totalReactions`), direction]] }
        if (sortBy !== 'Reactions' && sortBy !== 'Date') { order = [[sequelize.literal(`total${sortBy}`), direction]] }
        return order
    }

    function findFirstAttributes() {
        let firstAttributes = ['id']
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
            ),'totalComments'
        ])}
        if (sortBy === 'Reactions') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type != 'vote' AND Reaction.state = 'active')`
            ),'totalReactions'
        ])}
        if (sortBy === 'Likes') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'like' AND Reaction.state = 'active')`
            ),'totalLikes'
        ])}
        if (sortBy === 'Ratings') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
            ),'totalRatings'
        ])}
        if (sortBy === 'Reposts') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'repost' AND Reaction.state = 'active')`
            ),'totalReposts'
        ])}
        return firstAttributes
    }

    let startDate = findStartDate()
    let type = findType()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()

    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts with calculated stats and pagination applied.
    // Second query used to return related models.
    // Final function used to replace PostHolons object with a simpler array.
    Post.findAll({
        subQuery: false,
        where: { 
            creatorId: userId,
            state: 'visible',
            createdAt: { [Op.between]: [startDate, Date.now()] },
            type,
            [Op.or]: [
                { text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { text: null }
            ]
        },
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: firstAttributes
    })
    .then(posts => {
        // Add account reaction data to post attributes
        let mainAttributes = [
            ...postAttributes,
            [sequelize.literal(`(
                SELECT COUNT(*) > 0
                FROM Reactions
                AS Reaction
                WHERE Reaction.postId = Post.id
                AND Reaction.userId = ${accountId}
                AND Reaction.type = 'like'
                AND Reaction.state = 'active'
                )`),'accountLike'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*) > 0
                FROM Reactions
                AS Reaction
                WHERE Reaction.postId = Post.id
                AND Reaction.userId = ${accountId}
                AND Reaction.type = 'rating'
                AND Reaction.state = 'active'
                )`),'accountRating'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*) > 0
                FROM Reactions
                AS Reaction
                WHERE Reaction.postId = Post.id
                AND Reaction.userId = ${accountId}
                AND Reaction.type = 'repost'
                AND Reaction.state = 'active'
                )`),'accountRepost'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*) > 0
                FROM Links
                AS Link
                WHERE Link.state = 'visible'
                AND Link.creatorId = ${accountId}
                AND (Link.itemAId = Post.id OR Link.itemBId = Post.id)
                )`),'accountLink'
            ]
        ]
        return Post.findAll({ 
            where: { id: posts.map(post => post.id) },
            attributes: mainAttributes,
            order,
            include: [
                {
                    model: User,
                    as: 'Creator',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                {
                    model: Holon,
                    as: 'DirectSpaces',
                    attributes: ['id', 'handle', 'state', 'flagImagePath'],
                    through: { where: { relationship: 'direct' }, attributes: ['type'] },
                },
                {
                    model: Holon,
                    as: 'IndirectSpaces',
                    attributes: ['id', 'handle', 'state'],
                    through: { where: { relationship: 'indirect' }, attributes: ['type'] },
                },
                { 
                    model: Reaction,
                    where: { state: 'active' },
                    required: false,
                    attributes: ['id', 'type', 'value'],
                    include: [
                        {
                            model: User,
                            as: 'Creator',
                            attributes: ['id', 'handle', 'name', 'flagImagePath']
                        },
                        {
                            model: Holon,
                            as: 'Space',
                            attributes: ['id', 'handle', 'name', 'flagImagePath']
                        },
                    ]
                },
                {
                    model: Link,
                    as: 'OutgoingLinks',
                    where: { state: 'visible' },
                    required: false,
                    attributes: ['id'],
                    include: [
                        { 
                            model: User,
                            as: 'Creator',
                            attributes: ['id', 'handle', 'name', 'flagImagePath'],
                        },
                        { 
                            model: Post,
                            as: 'PostB',
                            attributes: ['id'],
                            include: [
                                { 
                                    model: User,
                                    as: 'Creator',
                                    attributes: ['handle', 'name', 'flagImagePath'],
                                }
                            ]
                        },
                    ]
                },
                {
                    model: Link,
                    as: 'IncomingLinks',
                    where: { state: 'visible' },
                    required: false,
                    attributes: ['id'],
                    include: [
                        { 
                            model: User,
                            as: 'Creator',
                            attributes: ['id', 'handle', 'name', 'flagImagePath'],
                        },
                        { 
                            model: Post,
                            as: 'PostA',
                            attributes: ['id'],
                            include: [
                                { 
                                    model: User,
                                    as: 'Creator',
                                    attributes: ['handle', 'name', 'flagImagePath'],
                                }
                            ]
                        },
                    ]
                },
                {
                    model: GlassBeadGame,
                    attributes: ['topic'],
                    include: [{ 
                        model: GlassBead,
                        order: [['index', 'ASC']],
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['handle', 'name', 'flagImagePath']
                            }
                        ]
                    }]
                }
            ]
        })
        .then(posts => {
            posts.forEach(post => {
                post.DirectSpaces.forEach(space => {
                    space.setDataValue('type', space.dataValues.PostHolon.type)
                    delete space.dataValues.PostHolon
                })
                post.IndirectSpaces.forEach(space => {
                    space.setDataValue('type', space.dataValues.PostHolon.type)
                    delete space.dataValues.PostHolon
                })
                // convert SQL numeric booleans to JS booleans
                post.setDataValue('accountLike', !!post.dataValues.accountLike)
                post.setDataValue('accountRating', !!post.dataValues.accountRating)
                post.setDataValue('accountRepost', !!post.dataValues.accountRepost)
                post.setDataValue('accountLink', !!post.dataValues.accountLink)
            })
            return posts
        })
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

// POST
router.post('/find-user', (req, res) => {
    const { query, blacklist } = req.body
    User.findAll({
        where: {
            [Op.or]: [
                { handle: { [Op.like]: `%${query}%` } },
                { name: { [Op.like]: `%${query}%` } },
            ],
            [Op.not]: [
                { handle: blacklist.map(user => user.handle) },
            ]
        }
    }).then(users => res.send(users))
})

module.exports = router