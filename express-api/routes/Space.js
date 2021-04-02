require("dotenv").config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const { v4: uuidv4 } = require('uuid')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const authenticateToken = require('../middleware/authenticateToken')
const { postAttributes } = require('../GlobalConstants')
const {
    Holon,
    VerticalHolonRelationship,
    HolonHandle,
    HolonUser,
    User,
    Post,
    Link,
    Notification,
    SpaceNotification,
} = require('../models')

// GET
router.get('/holon-data', (req, res) => {
    const { handle } = req.query
    let totalUsersQuery
    if (handle === 'all') {
        totalUsersQuery = [sequelize.literal(`(SELECT COUNT(*) FROM Users WHERE Users.emailVerified = true)`), 'total_users']
    } else {
        totalUsersQuery = [sequelize.literal(`(
            SELECT COUNT(*)
                FROM Users
                WHERE Users.emailVerified = true
                AND Users.id IN (
                    SELECT HolonUsers.userId
                    FROM HolonUsers
                    RIGHT JOIN Users
                    ON HolonUsers.userId = Users.id
                    WHERE HolonUsers.holonId = Holon.id
                    AND HolonUsers.state = 'active'
                    AND HolonUsers.relationship = 'follower'
                )
            )`), 'total_users'
        ]
    }
    Holon.findOne({ 
        where: { handle: handle },
        attributes: [
            'id', 'handle', 'name', 'description', 'flagImagePath', 'coverImagePath', 'createdAt',
            [sequelize.literal(`(
                SELECT COUNT(*)
                    FROM Holons
                    WHERE Holons.handle != Holon.handle
                    AND Holons.id IN (
                        SELECT HolonHandles.holonAId
                        FROM HolonHandles
                        RIGHT JOIN Holons
                        ON HolonHandles.holonAId = Holons.id
                        WHERE HolonHandles.holonBId = Holon.id
                    )
                )`), 'total_spaces'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                    FROM Posts
                    WHERE Posts.state = 'visible'
                    AND Posts.id IN (
                        SELECT PostHolons.postId
                        FROM PostHolons
                        RIGHT JOIN Posts
                        ON PostHolons.postId = Posts.id
                        WHERE PostHolons.HolonId = Holon.id
                    )
                )`), 'total_posts'
            ],
            totalUsersQuery
        ],
        include: [
            { 
                model: Holon,
                as: 'DirectChildHolons',
                attributes: ['handle', 'name', 'description', 'flagImagePath'],
                through: { attributes: [], where: { state: 'open' } },
            },
            {
                model: Holon,
                as: 'DirectParentHolons',
                attributes: ['handle', 'name', 'description', 'flagImagePath'],
                through: { attributes: [], where: { state: 'open' } },
            },
            {
                model: Holon,
                as: 'HolonHandles',
                attributes: ['handle', 'name'],
                through: { attributes: [] }
            },
            {
                model: User,
                as: 'Creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath']
            }
        ]
    })
    .then(holon => res.send(holon))
    .catch(err => console.log(err))
})

router.get('/holon-highlights', async (req, res) => {
    const { id } = req.query

    const TopPosts = Post.findAll({
        subQuery: false,
        where: { 
            '$DirectSpaces.id$': id,
            state: 'visible',
            urlImage: { [Op.ne]: null }
        },
        order: [['createdAt', 'DESC']],
        limit: 3,
        attributes: ['id', 'urlImage'],
        include: [{ 
            model: Holon,
            as: 'DirectSpaces',
            attributes: []
        }]
    })

    const TopSpaces = Holon.findAll({
        subQuery: false,
        where: {
            '$HolonHandles.id$': id,
            id: { [Op.ne]: [id] }
        },
        limit: 3,
        attributes: ['handle', 'flagImagePath'],
        include: [{ 
            model: Holon,
            as: 'HolonHandles',
            attributes: [],
            through: { attributes: [] }
        }]
    })

    const TopUsers = User.findAll({
        where: {
            emailVerified: true,
            flagImagePath: { [Op.ne]: null }
        },
        limit: 3,
        order: [['createdAt', 'DESC']],
        attributes: ['handle', 'flagImagePath']
    })

    Promise
        .all([TopPosts, TopSpaces, TopUsers])
        .then(data => {
            res.send({ TopPosts: data[0], TopSpaces: data[1], TopUsers: data[2]})
        })
})

router.get('/holon-posts', (req, res) => {
    const { accountId, handle, timeRange, postType, sortBy, sortOrder, depth, searchQuery, limit, offset } = req.query

    console.log('req.query: ', req.query)

    function findStartDate() {
        let offset = undefined
        if (timeRange === 'Last Year') { offset = (24*60*60*1000) * 365 }
        if (timeRange === 'Last Month') { offset = (24*60*60*1000) * 30 }
        if (timeRange === 'Last Week') { offset = (24*60*60*1000) * 7 }
        if (timeRange === 'Last 24 Hours') { offset = 24*60*60*1000 }
        if (timeRange === 'Last Hour') { offset = 60*60*1000 }
        var startDate = new Date()
        startDate.setTime(startDate.getTime() - offset)
        return startDate
    }

    function findType() {
        let type
        if (postType === 'All Types') {
            type = ['text', 'poll', 'url', 'glass-bead', 'prism', 'plot-graph']
        } else { 
            type = postType.replace(/\s+/g, '-').toLowerCase()
        }
        return type
    }

    function findOrder() {
        let direction, order
        if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
        if (sortBy === 'Date') { order = [['createdAt', direction]] }
        if (sortBy === 'Reactions') { order = [[sequelize.literal(`total_reactions`), direction]] }
        if (sortBy !== 'Reactions' && sortBy !== 'Date') { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction]] }
        return order
    }

    function findFirstAttributes() {
        let firstAttributes = ['id']
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
            ),'total_comments'
        ])}
        if (sortBy === 'Reactions') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type != 'vote' AND Reaction.state = 'active')`
            ),'total_reactions'
        ])}
        if (sortBy === 'Likes') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'like' AND Reaction.state = 'active')`
            ),'total_likes'
        ])}
        if (sortBy === 'Ratings') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
            ),'total_ratings'
        ])}
        if (sortBy === 'Reposts') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'repost' AND Reaction.state = 'active')`
            ),'total_reposts'
        ])}
        return firstAttributes
    }

    function findThrough() {
        let through
        if (depth === 'All Contained Posts') {
            through = {
                where: {
                    [Op.or]: [
                        { relationship: 'direct' },
                        { relationship: 'indirect' },
                    ]
                },
                attributes: []
            }
        }
        if (depth === 'Only Direct Posts') {
            through = {
                where: { relationship: 'direct' },
                attributes: []
            }
        }
        return through
    }

    let startDate = findStartDate()
    let type = findType()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()
    let through = findThrough()

    // Find totalMatchingPosts
    let totalMatchingPosts
    Post.findAll({
        subQuery: false,
        where: { 
            '$DirectSpaces.handle$': handle,
            state: 'visible',
            createdAt: { [Op.between]: [startDate, Date.now()] },
            type,
            [Op.or]: [
                { text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { text: null }
            ]
        },
        order,
        attributes: firstAttributes,
        include: [{ 
            model: Holon,
            as: 'DirectSpaces',
            attributes: [],
            through,
        }]
    })
    .then(posts => {
        totalMatchingPosts = posts.length
        console.log('total matching posts: ', totalMatchingPosts)
        // console.log('Number(limit): ', Number(limit))
        // console.log('Number(offset): ', Number(offset))
    })

    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts with calculated stats and pagination applied.
    // Second query used to return related models.
    // Final function used to replace PostHolons object with a simpler array.
    Post.findAll({
        subQuery: false,
        where: { 
            '$DirectSpaces.handle$': handle,
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
        attributes: firstAttributes,
        include: [{ 
            model: Holon,
            as: 'DirectSpaces',
            attributes: [],
            through,
        }]
    })
    .then(posts => {
        // console.log('posts.length: ', posts.length)
        // console.log('Number(limit): ', Number(limit))
        // console.log('Number(offset): ', Number(offset))
        // Add account reaction data to post attributes
        let mainAttributes = [
            ...postAttributes,
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Reactions
                AS Reaction
                WHERE Reaction.postId = Post.id
                AND Reaction.userId = ${accountId}
                AND Reaction.type = 'like'
                AND Reaction.state = 'active'
                )`),'account_like'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Reactions
                AS Reaction
                WHERE Reaction.postId = Post.id
                AND Reaction.userId = ${accountId}
                AND Reaction.type = 'rating'
                AND Reaction.state = 'active'
                )`),'account_rating'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Reactions
                AS Reaction
                WHERE Reaction.postId = Post.id
                AND Reaction.userId = ${accountId}
                AND Reaction.type = 'repost'
                AND Reaction.state = 'active'
                )`),'account_repost'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Links
                AS Link
                WHERE Link.state = 'visible'
                AND Link.creatorId = ${accountId}
                AND (Link.itemAId = Post.id OR Link.itemBId = Post.id)
                )`),'account_link'
            ]
        ]
        return Post.findAll({ 
            where: { id: posts.map(post => post.id) },
            attributes: mainAttributes,
            order,
            include: [
                {
                    model: Holon,
                    as: 'DirectSpaces',
                    attributes: ['handle'],
                    through: { where: { relationship: 'direct' }, attributes: ['type'] },
                },
                {
                    model: Holon,
                    as: 'IndirectSpaces',
                    attributes: ['handle'],
                    through: { where: { relationship: 'indirect' }, attributes: ['type'] },
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                {
                    model: Link,
                    as: 'OutgoingLinks',
                    //where: { state: 'visible' }
                    //attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                {
                    model: Link,
                    as: 'IncomingLinks',
                    //where: { state: 'visible' }
                    //attributes: ['id', 'handle', 'name', 'flagImagePath'],
                }
            ]
        })
        .then(posts => {
            posts.forEach(post => {
                // save type and remove redundant PostHolon objects
                post.DirectSpaces.forEach(space => {
                    space.setDataValue('type', space.dataValues.PostHolon.type)
                    delete space.dataValues.PostHolon
                })
                post.IndirectSpaces.forEach(space => {
                    space.setDataValue('type', space.dataValues.PostHolon.type)
                    delete space.dataValues.PostHolon
                })
            })
            let holonPosts = {
                totalMatchingPosts,
                posts
            }
            return holonPosts
        })
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/holon-spaces', (req, res) => {
    const { accountId, handle, timeRange, spaceType, sortBy, sortOrder, depth, searchQuery, limit, offset } = req.query

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
        else { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction]] }
        return order
    }

    function findFirstAttributes() {
        let firstAttributes = ['id']
        if (sortBy === 'Followers') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Users
                WHERE Users.id IN (
                    SELECT HolonUsers.userId
                    FROM HolonUsers
                    RIGHT JOIN Users
                    ON HolonUsers.userId = Users.id
                    WHERE HolonUsers.HolonId = Holon.id
                    AND HolonUsers.relationship = 'follower'
                    AND HolonUsers.state = 'active'
                )
            )`), 'total_followers'
        ])}
        if (sortBy === 'Posts') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Posts
                WHERE Posts.state = 'visible'
                AND Posts.id IN (
                    SELECT PostHolons.postId
                    FROM PostHolons
                    RIGHT JOIN Posts
                    ON PostHolons.postId = Posts.id
                    WHERE PostHolons.HolonId = Holon.id
                )
            )`), 'total_posts'
        ])}
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Comments
                WHERE Comments.state = 'visible'
                AND Comments.postId IN (
                    SELECT PostHolons.postId
                    FROM PostHolons
                    RIGHT JOIN Posts
                    ON PostHolons.postId = Posts.id
                    WHERE PostHolons.HolonId = Holon.id
                )
            )`), 'total_comments'
        ])}
        if (sortBy === 'Reactions') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Reactions
                WHERE Reactions.state = 'active'
                AND Reactions.type != 'vote'
                AND Reactions.postId IN (
                    SELECT PostHolons.postId
                    FROM PostHolons
                    RIGHT JOIN Posts
                    ON PostHolons.postId = Posts.id
                    WHERE PostHolons.HolonId = Holon.id
                )
            )`), 'total_reactions'
        ])}
        if (sortBy === 'Likes') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Reactions
                WHERE Reactions.state = 'active'
                AND Reactions.type = 'like'
                AND Reactions.postId IN (
                    SELECT PostHolons.postId
                    FROM PostHolons
                    RIGHT JOIN Posts
                    ON PostHolons.postId = Posts.id
                    WHERE PostHolons.HolonId = Holon.id
                )
            )`), 'total_likes'
        ])}
        if (sortBy === 'Hearts') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Reactions
                WHERE Reactions.state = 'active'
                AND Reactions.type = 'heart'
                AND Reactions.postId IN (
                    SELECT PostHolons.postId
                    FROM PostHolons
                    RIGHT JOIN Posts
                    ON PostHolons.postId = Posts.id
                    WHERE PostHolons.HolonId = Holon.id
                )
            )`), 'total_hearts'
        ])}
        if (sortBy === 'Ratings') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Reactions
                WHERE Reactions.state = 'active'
                AND Reactions.type = 'rating'
                AND Reactions.postId IN (
                    SELECT PostHolons.postId
                    FROM PostHolons
                    RIGHT JOIN Posts
                    ON PostHolons.postId = Posts.id
                    WHERE PostHolons.HolonId = Holon.id
                )
            )`), 'total_ratings'
        ])}
        return firstAttributes
    }

    function findWhere() {
        let where
        if (depth === 'All Contained Spaces') { 
            where =
            { 
                '$HolonHandles.handle$': handle,
                handle: { [Op.ne]: [handle] },
                createdAt: { [Op.between]: [startDate, Date.now()] },
                [Op.or]: [
                    { handle: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                    { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                    { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
                ]
            } 
        }
        if (depth === 'Only Direct Descendants') {
            where =
            { 
                '$DirectParentHolons.handle$': handle,
                createdAt: { [Op.between]: [startDate, Date.now()] },
                [Op.or]: [
                    { handle: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                    { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                    { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
                ]
            }
        }
        return where
    }

    function findInclude() {
        let include
        if (depth === 'All Contained Spaces') { 
            include = [{ 
                model: Holon,
                as: 'HolonHandles',
                attributes: [],
                through: { attributes: [] }
            }]
        }
        if (depth === 'Only Direct Descendants') { 
            include = [{ 
                model: Holon,
                as: 'DirectParentHolons',
                attributes: [],
                through: { attributes: [], where: { state: 'open' } },
            }]
        }
        return include
    }

    let startDate = findStartDate()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()
    let where = findWhere()
    let include = findInclude()

    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts with calculated stats and pagination applied.
    // Second query used to return related models.
    Holon.findAll({
        where,
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: firstAttributes,
        subQuery: false,
        include
    })
    .then(holons => {
        Holon.findAll({ 
            where: { id: holons.map(holon => holon.id) },
            attributes: [
                'id', 'handle', 'name', 'description', 'flagImagePath', 'coverImagePath', 'createdAt',
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Users
                        WHERE Users.id IN (
                            SELECT HolonUsers.userId
                            FROM HolonUsers
                            RIGHT JOIN Users
                            ON HolonUsers.userId = Users.id
                            WHERE HolonUsers.HolonId = Holon.id
                            AND HolonUsers.relationship = 'follower'
                            AND HolonUsers.state = 'active'
                        )
                    )`), 'total_followers'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Comments
                        WHERE Comments.state = 'visible'
                        AND Comments.postId IN (
                            SELECT PostHolons.postId
                            FROM PostHolons
                            RIGHT JOIN Posts
                            ON PostHolons.postId = Posts.id
                            WHERE PostHolons.HolonId = Holon.id
                        )
                    )`), 'total_comments'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Reactions
                        WHERE Reactions.state = 'active'
                        AND Reactions.type != 'vote'
                        AND Reactions.postId IN (
                            SELECT PostHolons.postId
                            FROM PostHolons
                            RIGHT JOIN Posts
                            ON PostHolons.postId = Posts.id
                            WHERE PostHolons.HolonId = Holon.id
                        )
                    )`), 'total_reactions'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Reactions
                        WHERE Reactions.state = 'active'
                        AND Reactions.type = 'like'
                        AND Reactions.postId IN (
                            SELECT PostHolons.postId
                            FROM PostHolons
                            RIGHT JOIN Posts
                            ON PostHolons.postId = Posts.id
                            WHERE PostHolons.HolonId = Holon.id
                        )
                    )`), 'total_likes'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Reactions
                        WHERE Reactions.state = 'active'
                        AND Reactions.type = 'rating'
                        AND Reactions.postId IN (
                            SELECT PostHolons.postId
                            FROM PostHolons
                            RIGHT JOIN Posts
                            ON PostHolons.postId = Posts.id
                            WHERE PostHolons.HolonId = Holon.id
                        )
                    )`), 'total_ratings'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Posts
                        WHERE Posts.state = 'visible'
                        AND Posts.id IN (
                            SELECT PostHolons.postId
                            FROM PostHolons
                            RIGHT JOIN Posts
                            ON PostHolons.postId = Posts.id
                            WHERE PostHolons.HolonId = Holon.id
                        )
                    )`), 'total_posts'
                ]
            ],
            order,
            // include: []
        }).then(data => { res.json(data) })
    })
    .catch(err => console.log(err))
})

router.get('/holon-users', (req, res) => {
    const { accountId, holonId, timeRange, userType, sortBy, sortOrder, searchQuery, limit, offset } = req.query

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
        else { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction]] }
        return order
    }

    function findFirstAttributes() {
        let firstAttributes = ['id']
        if (sortBy === 'Posts') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Posts
                WHERE Posts.state = 'visible'
                AND Posts.creatorId = User.id
            )`), 'total_posts'
        ])}
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(`(
            SELECT COUNT(*)
                FROM Comments
                WHERE Comments.creatorId = User.id
            )`), 'total_comments'
        ])}
        return firstAttributes
    }

    let startDate = findStartDate()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()

    User.findAll({
        where: { 
            '$FollowedHolons.id$': holonId,
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
        subQuery: false,
        include: [{ 
            model: Holon,
            as: 'FollowedHolons',
            attributes: [],
            through: { where: { relationship: 'follower', state: 'active' }, attributes: [] }
        }],
    })
    .then(users => {
        User.findAll({ 
            where: { id: users.map(user => user.id) },
            attributes: [
                'id', 'handle', 'name', 'bio', 'flagImagePath', 'coverImagePath', 'createdAt',
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Posts
                        WHERE Posts.state = 'visible'
                        AND Posts.creatorId = User.id
                    )`), 'total_posts'
                ],
                [sequelize.literal(`(
                    SELECT COUNT(*)
                        FROM Comments
                        WHERE Comments.creatorId = User.id
                    )`), 'total_comments'
                ],
            ],
            order,
            // include: []
        }).then(data => { res.json(data) })
    })
    .catch(err => console.log(err))
})

router.get('/holon-requests', (req, res) => {
    const { holonId } = req.query
    SpaceNotification
        .findAll({
            where: { type: 'parent-space-request', ownerId: holonId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'triggerUser',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                {
                    model: Holon,
                    as: 'triggerSpace',
                    attributes: ['id', 'handle', 'name', 'flagImagePath'],
                },
                // {
                //     model: Holon,
                //     as: 'secondarySpace',
                //     attributes: ['id', 'handle', 'name', 'flagImagePath'],
                // }
            ]
        })
        .then(notifications => {
            res.send(notifications)
        })
})

router.get('/space-map-data', async (req, res) => {
    const { spaceId, sortBy, sortOrder, timeRange } = req.query

    const firstGenLimit = 7
    const secondGenLimit = 3
    const thirdGenLimit = 3
    const fourthGenLimit = 3

    function findOrder() {
        let direction, order
        if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
        if (sortBy === 'Date') { order = [['createdAt', direction]] }
        else { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction]] }
        return order
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    async function findNextGeneration(parent, limit) {
        if (!parent.isExpander && parent.total_children > 0) {
            const nextGeneration = await Holon.findAll({
                where: { '$DirectParentHolons.id$': parent.id },
                attributes: [
                    'id', 'handle', 'name', 'description', 'flagImagePath', 'coverImagePath', 'createdAt',
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM VerticalHolonRelationships
                            AS VHR
                            WHERE VHR.holonAId = Holon.id
                            AND VHR.state = 'open'
                        )`), 'total_children'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Users
                            WHERE Users.id IN (
                                SELECT HolonUsers.userId
                                FROM HolonUsers
                                RIGHT JOIN Users
                                ON HolonUsers.userId = Users.id
                                WHERE HolonUsers.HolonId = Holon.id
                                AND HolonUsers.relationship = 'follower'
                                AND HolonUsers.state = 'active'
                            )
                        )`), 'total_followers'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Comments
                            WHERE Comments.state = 'visible'
                            AND Comments.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_comments'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Reactions
                            WHERE Reactions.state = 'active'
                            AND Reactions.type != 'vote'
                            AND Reactions.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_reactions'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Reactions
                            WHERE Reactions.state = 'active'
                            AND Reactions.type = 'like'
                            AND Reactions.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_likes'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Reactions
                            WHERE Reactions.state = 'active'
                            AND Reactions.type = 'rating'
                            AND Reactions.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_ratings'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Posts
                            WHERE Posts.state = 'visible'
                            AND Posts.id IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_posts'
                    ]
                ],
                limit,
                order: findOrder(),
                subQuery: false,
                include: [{ 
                    model: Holon,
                    as: 'DirectParentHolons',
                    attributes: [],
                    through: { attributes: [], where: { state: 'open' } },
                }]
            })
            parent.children = []
            nextGeneration.forEach(child => {
                parent.children.push(child.toJSON())
            })
        } else {
            parent.children = []
        }
        // if hidden spaces, add expander
        if (parent.children.length && parent.total_children > limit) {
            parent.children.splice(-1, 1)
            parent.children.push({ isExpander: true, id: uuidv4(), name: `${parent.total_children - limit + 1} more spaces` })
        }
    }

    const findRoot = await Holon.findOne({ 
        where: { id: spaceId },
        attributes: [
            'id', 'handle', 'name', 'flagImagePath',
            [sequelize.literal(`(
                SELECT COUNT(*)
                    FROM VerticalHolonRelationships
                    AS VHR
                    WHERE VHR.holonAId = Holon.id
                    AND VHR.state = 'open'
                )`), 'total_children'
            ]
        ]
    })
    const root = findRoot.toJSON()
    const findFirstGeneration = await findNextGeneration(root, firstGenLimit)
    const findSecondGeneration = await asyncForEach(root.children, async(child) => {
        await findNextGeneration(child, secondGenLimit)
    })
    const findThirdGeneration = await asyncForEach(root.children, async(child) => {
        await asyncForEach(child.children, async(child2) => {
            await findNextGeneration(child2, thirdGenLimit)
        })
    })
    // const findFourthGeneration = await asyncForEach(root.children, async(child) => {
    //     await asyncForEach(child.children, async(child2) => {
    //         await asyncForEach(child2.children, async(child3) => {
    //             await findNextGeneration(child3, fourthGenLimit)
    //         })
    //     })
    // })

    Promise
        .all([findFirstGeneration, findSecondGeneration, findThirdGeneration])
        .then(res.send(root))
})

router.get('/space-map-next-children', async (req, res) => {
    const { spaceId, offset, sortBy, sortOrder, timeRange } = req.query

    const firstGenLimit = 7
    const secondGenLimit = 3
    const thirdGenLimit = 3
    const fourthGenLimit = 3

    function findOrder() {
        let direction, order
        if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
        if (sortBy === 'Date') { order = [['createdAt', direction]] }
        else { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction]] }
        return order
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    async function findNextGeneration(generation, parent, limit, offset) {
        parent.children = []
        if (!parent.isExpander && parent.total_children > 0) {
            const nextGeneration = await Holon.findAll({
                where: { '$DirectParentHolons.id$': parent.id },
                attributes: [
                    'id', 'handle', 'name', 'description', 'flagImagePath', 'coverImagePath', 'createdAt',
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM VerticalHolonRelationships
                            AS VHR
                            WHERE VHR.holonAId = Holon.id
                            AND VHR.state = 'open'
                        )`), 'total_children'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Users
                            WHERE Users.id IN (
                                SELECT HolonUsers.userId
                                FROM HolonUsers
                                RIGHT JOIN Users
                                ON HolonUsers.userId = Users.id
                                WHERE HolonUsers.HolonId = Holon.id
                                AND HolonUsers.relationship = 'follower'
                                AND HolonUsers.state = 'active'
                            )
                        )`), 'total_followers'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Comments
                            WHERE Comments.state = 'visible'
                            AND Comments.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_comments'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Reactions
                            WHERE Reactions.state = 'active'
                            AND Reactions.type != 'vote'
                            AND Reactions.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_reactions'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Reactions
                            WHERE Reactions.state = 'active'
                            AND Reactions.type = 'like'
                            AND Reactions.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_likes'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Reactions
                            WHERE Reactions.state = 'active'
                            AND Reactions.type = 'rating'
                            AND Reactions.postId IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_ratings'
                    ],
                    [sequelize.literal(`(
                        SELECT COUNT(*)
                            FROM Posts
                            WHERE Posts.state = 'visible'
                            AND Posts.id IN (
                                SELECT PostHolons.postId
                                FROM PostHolons
                                RIGHT JOIN Posts
                                ON PostHolons.postId = Posts.id
                                WHERE PostHolons.HolonId = Holon.id
                            )
                        )`), 'total_posts'
                    ]
                ],
                limit,
                offset: Number(offset),
                order: findOrder(),
                subQuery: false,
                include: [{ 
                    model: Holon,
                    as: 'DirectParentHolons',
                    attributes: [],
                    through: { attributes: [], where: { state: 'open' } },
                }]
            })
            nextGeneration.forEach(child => {
                parent.children.push(child.toJSON())
            })
        }

        // if hidden spaces, replace last space with expander
        if (parent.children.length) {
            if (
                generation === 1 &&
                parent.total_children > Number(offset) + parent.children.length
            ) {
                parent.children.splice(-1, 1)
                const remainingChildren = parent.total_children - parent.children.length - Number(offset)
                parent.children.push({ isExpander: true, id: uuidv4(), name: `${remainingChildren} more spaces` })
            }
            if (
                generation > 1 &&
                parent.total_children > limit
            ) {
                parent.children.splice(-1, 1)
                const remainingChildren = parent.total_children - parent.children.length
                parent.children.push({ isExpander: true, id: uuidv4(), name: `${remainingChildren} more spaces` })
            }
        }
    }

    const findRoot = await Holon.findOne({ 
        where: { id: spaceId },
        attributes: [
            'id', 'handle', 'name', 'flagImagePath',
            [sequelize.literal(`(
                SELECT COUNT(*)
                    FROM VerticalHolonRelationships
                    AS VHR
                    WHERE VHR.holonAId = Holon.id
                    AND VHR.state = 'open'
                )`), 'total_children'
            ]
        ]
    })
    const root = findRoot.toJSON()
    const findFirstGeneration = await findNextGeneration(1, root, firstGenLimit, offset)
    const findSecondGeneration = await asyncForEach(root.children, async(child) => {
        await findNextGeneration(2, child, secondGenLimit, 0)
    })
    const findThirdGeneration = await asyncForEach(root.children, async(child) => {
        await asyncForEach(child.children, async(child2) => {
            await findNextGeneration(3, child2, thirdGenLimit, 0)
        })
    })
    // const findFourthGeneration = await asyncForEach(root.children, async(child) => {
    //     await asyncForEach(child.children, async(child2) => {
    //         await asyncForEach(child2.children, async(child3) => {
    //             await findNextGeneration(child3, fourthGenLimit)
    //         })
    //     })
    // })

    Promise
        .all([findFirstGeneration, findSecondGeneration, findThirdGeneration])
        .then(res.send(root.children))
})

router.get('/suggested-space-handles', (req, res) => {
    const { searchQuery } = req.query
    Holon.findAll({
        where: { handle: { [Op.like]: `%${searchQuery}%` } },
        attributes: ['handle']
    })
    .then(handles => { res.json(handles) })
    .catch(err => console.log(err))
})

router.get('/validate-space-handle', (req, res) => {
    const { searchQuery } = req.query
    Holon.findAll({
        where: { handle: searchQuery },
        attributes: ['handle']
    })
    .then(holons => {
        if (holons.length > 0) { res.send('success') }
        else { res.send('fail') }
    })
    .catch(err => console.log(err))
})

// POST
// todo: add authenticateToken to all endpoints below
router.post('/create-holon', (req, res) => {
    const { creatorId, handle, name, description, parentHolonId } = req.body

    Holon.findOne({ where: { handle: handle }})
        .then(holon => {
            if (holon) { res.send('holon-handle-taken') }
            else { createHolon() }
        })

    function createHolon() { 
        Holon
            .create({ creatorId, name, handle, description })
            .then(async newHolon => {
                // set up moderator relationship between creator and holon
                let creatModRelationship = await HolonUser.create({
                    relationship: 'moderator',
                    state: 'active',
                    holonId: newHolon.id,
                    userId: creatorId
                })
                // create unique handle
                let createUniqueHandle = await HolonHandle.create({
                    state: 'open',
                    holonAId: newHolon.id,
                    holonBId: newHolon.id,
                })
                Promise
                    .all([creatModRelationship, createUniqueHandle])
                    .then(async () => {
                        if (parentHolonId === 1) {
                            // attach new holon to 'all'
                            let createVericalRelationship = await VerticalHolonRelationship.create({
                                state: 'open',
                                holonAId: 1,
                                holonBId: newHolon.id,
                            })
                            // inherit the tag for 'all'
                            let inherhitHandle = await HolonHandle.create({
                                state: 'open',
                                holonAId: newHolon.id,
                                holonBId: 1,
                            })
                            Promise
                                .all([createVericalRelationship, inherhitHandle])
                                .then(res.send('attached-to-all'))
                        } else {
                            Holon
                                .findOne({
                                    where: { id: parentHolonId },
                                    include: [
                                        { model: User, as: 'HolonModerators' },
                                        { model: Holon, as: 'HolonHandles' }
                                    ]
                                })
                                .then(async holon => {
                                    // if user is moderator of parent space, attach space
                                    if (holon.HolonModerators.some(mod => mod.id === creatorId)) {
                                        // find all spaces below child space (effected spaces)
                                        // include each spaces holon handles (second query used to avoid where clause issues)
                                        // for each effected space: loop through parent spaces handles,
                                        // check each against the effected spaces handles,
                                        // if no match: add the handle, otherwise skip
                                        let effectedSpaces = await Holon.findAll({
                                            where: { '$HolonHandles.id$': newHolon.id },
                                            include: [{ model: Holon, as: 'HolonHandles' }]
                                        })
                                        let effectedSpacesWithHolonHandles = await Holon.findAll({
                                            where: { id: effectedSpaces.map(s => s.id) },
                                            include: [{
                                                model: Holon,
                                                as: 'HolonHandles',
                                                attributes: ['handle', 'id'],
                                                through: { attributes: [] }
                                            }]
                                        })
                                        let inheritHandles = await effectedSpacesWithHolonHandles.forEach(space => {
                                            holon.HolonHandles.forEach(ph => {
                                                let match = space.HolonHandles.some(sh => sh.handle === ph.handle)
                                                if (!match) {
                                                    // posts to A appear within B
                                                    HolonHandle.create({
                                                        state: 'open',
                                                        holonAId: space.id,
                                                        holonBId: ph.id,
                                                    })
                                                }
                                            })
                                        })
                                        // create vertical relationship
                                        let createVericalRelationship = await VerticalHolonRelationship.create({
                                            state: 'open',
                                            holonAId: parentHolonId,
                                            holonBId: newHolon.id,
                                        })
                                        Promise
                                            .all([inheritHandles, createVericalRelationship])
                                            .then(res.send('attached-by-mod'))
                                    } else {
                                        // if user not moderator of parent space, attach to 'all' and send resquest to moderators
                                        // attach new holon to 'all'
                                        let createVerticalRelationship = await VerticalHolonRelationship.create({
                                            state: 'open',
                                            holonAId: 1,
                                            holonBId: newHolon.id,
                                        })
                                        // inherit the tag for 'all'
                                        let inherhitHandle = await HolonHandle.create({
                                            state: 'open',
                                            holonAId: newHolon.id,
                                            holonBId: 1,
                                        })
                                        // create space notification
                                        let createSpaceNotification = await SpaceNotification.create({
                                            ownerId: parentHolonId,
                                            seen: false,
                                            type: 'parent-space-request',
                                            state: 'pending',
                                            holonAId: newHolon.id,
                                            userId: creatorId
                                        })
                                        // create account notifications for each of the mods
                                        let createAccountNotifications = await holon.HolonModerators.forEach(moderator => {
                                            Notification.create({
                                                ownerId: moderator.id,
                                                seen: false,
                                                type: 'parent-space-request',
                                                holonAId: newHolon.id,
                                                holonBId: parentHolonId,
                                                userId: creatorId
                                            })
                                        })
                                        // todo: send email to each of the mods?
                                        Promise
                                            .all([createVerticalRelationship, inherhitHandle, createSpaceNotification, createAccountNotifications])
                                            .then(res.send('pending-acceptance'))
                                    }
                                })
                        }
                    })
            })
            //.then(res.send('success'))
            .catch(err => console.log(err))
    }
})

router.post('/update-holon-setting', async (req, res) => {
    let { accountId, holonId, setting, newValue } = req.body
    console.log('req.body: ', req.body)

    if (setting === 'change-holon-handle') {
        Holon.update({ handle: newValue }, { where : { id: holonId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
    if (setting === 'change-holon-name') {
        Holon.update({ name: newValue }, { where : { id: holonId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
    if (setting === 'change-holon-description') {
        Holon.update({ description: newValue }, { where : { id: holonId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
    if (setting === 'add-new-holon-moderator') {
        User.findOne({ where: { handle: newValue } })
            .then(user => {
                if (user) {
                    HolonUser.create({
                        relationship: 'moderator',
                        state: 'active',
                        holonId,
                        userId: user.id
                    })
                    .then(res.send('success'))
                }
                else { res.send('No user with that handle') }
            })
    }
    if (setting === 'add-parent-holon') {
        // work out if user is moderator of parent space. If so: connect automatically, otherwise send request to parent space moderators
        Holon
            .findOne({
                where: { handle: newValue },
                include: [
                    { model: User, as: 'HolonModerators' },
                    { model: Holon, as: 'HolonHandles' }
                ]
            })
            .then(async holon => {
                // if user is moderator of parent space, attach space
                if (holon.HolonModerators.some(mod => mod.id === accountId)) {
                    console.log('user is mod')
                    // find all spaces below child space (effected spaces)
                    // include each spaces holon handles (second query used to avoid where clause issues)
                    // for each effected space: loop through parent spaces handles,
                    // check each against the effected spaces handles,
                    // if no match: add the handle, otherwise skip
                    let effectedSpaces = await Holon.findAll({
                        where: { '$HolonHandles.id$': holonId },
                        include: [{ model: Holon, as: 'HolonHandles' }]
                    })
                    let effectedSpacesWithHolonHandles = await Holon.findAll({
                        where: { id: effectedSpaces.map(s => s.id) },
                        include: [{
                            model: Holon,
                            as: 'HolonHandles',
                            attributes: ['handle', 'id'],
                            through: { attributes: [] }
                        }]
                    })
                    let inheritHandles = await effectedSpacesWithHolonHandles.forEach(space => {
                        holon.HolonHandles.forEach(ph => {
                            let match = space.HolonHandles.some(sh => sh.handle === ph.handle)
                            if (!match) {
                                // posts to A appear within B
                                HolonHandle.create({
                                    state: 'open',
                                    holonAId: space.id,
                                    holonBId: ph.id,
                                })
                            }
                        })
                    })
                    // if only current parent space is 'all', remove vertical relationshsip
                    let removeVerticalRelationshipIfRequired = await VerticalHolonRelationship
                        .findAll({
                            where: { holonBId: holonId },
                            attributes: ['holonAId']
                        })
                        .then(async holons => {
                            // if child space was only connected to 'all', remove old connection
                            let holonIds = holons.map(h => h.holonAId)
                            console.log('holonIds: ', holonIds)
                            if (holonIds.length === 1 && holonIds[0] === 1) {
                                VerticalHolonRelationship.update({ state: 'closed' }, { where: { holonAId: 1, holonBId: holonId }})
                            }
                        })
                    // create vertical relationship
                    let createVericalRelationship = await VerticalHolonRelationship.create({
                        state: 'open',
                        holonAId: holon.id,
                        holonBId: holonId,
                    })
                    Promise
                        .all([inheritHandles, removeVerticalRelationshipIfRequired, createVericalRelationship])
                        .then(res.send('attached-by-mod'))
                } else {
                    console.log('user is not mod')
                    // if user not moderator of parent space
                    // create space notification
                    let createSpaceNotification = await SpaceNotification.create({
                        ownerId: holon.id,
                        seen: false,
                        type: 'parent-space-request',
                        state: 'pending',
                        holonAId: holonId,
                        userId: accountId
                    })
                    // create account notifications for each of the mods
                    let createAccountNotifications = await holon.HolonModerators.forEach(moderator => {
                        Notification.create({
                            ownerId: moderator.id,
                            seen: false,
                            type: 'parent-space-request',
                            holonAId: holonId,
                            holonBId: holon.id,
                            userId: accountId
                        })
                    })
                    Promise
                        .all([createSpaceNotification, createAccountNotifications])
                        .then(res.send('pending-acceptance'))
                }
            })




        // find handles of parent space
        // find all spaces containing child spaces handles (effectedSpaces)
        // compare handles of parent space against handles of each spaces containing child spaces handles
        // add handles that don't match

        // let parent = await Holon.findOne({
        //     where: { handle: newValue },
        //     include: [{
        //         model: Holon,
        //         as: 'HolonHandles',
        //         attributes: ['handle', 'id'],
        //         through: { attributes: [] }
        //     }]
        // })

        // let child = await Holon.findOne({
        //     where: { id: holonId }
        // })

        // let effectedSpaces = await Holon.findAll({
        //     where: { '$HolonHandles.handle$': child.dataValues.handle },
        //     include: [{ model: Holon, as: 'HolonHandles' }]
        // })

        // let effectedSpacesWithHolonHandles = await Holon.findAll({
        //     where: { id: effectedSpaces.map(s => s.id) },
        //     include: [{
        //         model: Holon,
        //         as: 'HolonHandles',
        //         attributes: ['handle', 'id'],
        //         through: { attributes: [] }
        //     }]
        // })

        // // A is a direct parent of B
        // VerticalHolonRelationship.create({
        //     state: 'open',
        //     holonAId: parent.id,
        //     holonBId: child.id,
        // })

        // effectedSpacesWithHolonHandles.forEach(space => {
        //     parent.HolonHandles.forEach(ph => {
        //         let match = space.HolonHandles.some(sh => sh.handle === ph.handle)
        //         if (!match) {
        //             // posts to A appear within B
        //             HolonHandle.create({
        //                 state: 'open',
        //                 holonAId: space.id,
        //                 holonBId: ph.id,
        //             })
        //         }
        //     })
        // })
    }
    if (setting === 'remove-parent-holon') {
        // check parent space exists
        Holon.findOne({
            where: { handle: newValue },
            include: [{ model: Holon, as: 'HolonHandles' }]
        })
        .then(holon => {
            if (holon) {
                // if it exists, find all its own parent spaces
                VerticalHolonRelationship.findAll({
                    where: { holonBId: holon.id }
                })
                .then(holons => {
                    // TODO: ...
                    console.log('holons: ', holons)
                })
            }
            else { res.send('No space with that handle') }
        })
    }

})

router.post('/toggle-space-notification-seen', (req, res) => {
    let { notificationId, seen } = req.body
    SpaceNotification
        .update({ seen }, { where: { id: notificationId } })
        .then(res.send('success'))
})

router.post('/mark-all-space-notifications-seen', (req, res) => {
    let { holonId } = req.body
    SpaceNotification
        .update({ seen: true }, { where: { ownerId: holonId } })
        .then(res.send('success'))
})

router.post('/accept-parent-space-request', (req, res) => {
    let { notificationId } = req.body

    SpaceNotification
        .findOne({
            where: { id: notificationId },
            include: [
                {
                    model: User,
                    as: 'triggerUser',
                    attributes: ['id'],
                },
                {
                    model: Holon,
                    as: 'triggerSpace',
                    attributes: ['id'],
                },
                {
                    model: Holon,
                    as: 'owner',
                    attributes: ['id'],
                    include: [{ model: Holon, as: 'HolonHandles' }]
                }
            ]
        })
        .then(notification => {
            VerticalHolonRelationship
                .findAll({
                    where: { holonBId: notification.triggerSpace.id },
                    attributes: ['holonAId']
                })
                .then(async holons => {
                    // if parent space includes child spaces tag, reject connection and return message saying it would create a loop
                    
                    // if child space was only connected to 'all', remove old connection
                    let holonIds = holons.map(h => h.holonAId)
                    if (holonIds.length === 1 && holonIds[0] === 1) {
                        VerticalHolonRelationship.update({ state: 'closed' }, { where: { holonAId: 1, holonBId: notification.triggerSpace.id }})
                    }
                    // attach child space to parent space
                    VerticalHolonRelationship.create({
                        state: 'open',
                        holonAId: notification.owner.id,
                        holonBId: notification.triggerSpace.id,
                    })
                    // find all spaces below child space (effected spaces)
                    // include each spaces holon handles (second query used to avoid where clause issues)
                    // for each effected space: loop through parent spaces handles,
                    // check each against the effected spaces handles,
                    // if no match: add the handle, otherwise skip
                    let effectedSpaces = await Holon.findAll({
                        where: { '$HolonHandles.id$': notification.triggerSpace.id },
                        include: [{ model: Holon, as: 'HolonHandles' }]
                    })
                    let effectedSpacesWithHolonHandles = await Holon.findAll({
                        where: { id: effectedSpaces.map(s => s.id) },
                        include: [{
                            model: Holon,
                            as: 'HolonHandles',
                            attributes: ['handle', 'id'],
                            through: { attributes: [] }
                        }]
                    })
                    effectedSpacesWithHolonHandles.forEach(space => {
                        notification.owner.HolonHandles.forEach(ph => {
                            let match = space.HolonHandles.some(sh => sh.handle === ph.handle)
                            if (!match) {
                                // posts to A appear within B
                                HolonHandle.create({
                                    state: 'open',
                                    holonAId: space.id,
                                    holonBId: ph.id,
                                })
                            }
                        })
                    })
                    // mark space notification as accepted
                    notification.update({ state: 'accepted', seen: true })
                    // notify request creator
                    Notification.create({
                        ownerId: notification.triggerUser.id,
                        seen: false,
                        type: 'parent-space-request-accepted',
                        holonAId: notification.triggerSpace.id,
                        holonBId: notification.owner.id
                    })
                })
                .then(res.send('success'))
                .catch(error => console.log(error))
        })
})

router.post('/reject-parent-space-request', async (req, res) => {
    let { notificationId } = req.body
    SpaceNotification
        .findOne({
            where: { id: notificationId },
            include: [
                {
                    model: User,
                    as: 'triggerUser',
                    attributes: ['id'],
                },
                {
                    model: Holon,
                    as: 'triggerSpace',
                    attributes: ['id'],
                },
                {
                    model: Holon,
                    as: 'owner',
                    attributes: ['id'],
                }
            ]
        })
        .then(notification => {
            SpaceNotification.update({ state: 'rejected', seen: true }, { where: { id: notificationId } })
            Notification.create({
                ownerId: notification.triggerUser.id,
                seen: false,
                type: 'parent-space-request-rejected',
                holonAId: notification.triggerSpace.id,
                holonBId: notification.owner.id
            })
        })
        .then(res.send('success'))
    // let updateSpaceNotification = await SpaceNotification.update({ state: 'rejected', seen: true }, { where: { id: notificationId } })
    // let notifyRequestCreator = await Notification.create({
    //     ownerId: notification.triggerUser.id,
    //     seen: false,
    //     type: 'parent-space-request-accepted',
    //     holonAId: notification.triggerSpace.id,
    //     holonBId: notification.owner.id
    // })

    // Promise
    //     .all([updateSpaceNotification, notifyRequestCreator])
    //     .then(res.send('success'))
})

router.post('/follow-space', (req, res) => {
    // needs auth token
    const { holonId, userId } = req.body
    HolonUser
        .create({ relationship: 'follower', state: 'active', holonId, userId })
        .then(res.send('success'))
        .catch(err => console.log(err))
})

router.post('/unfollow-space', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser
        .update({ state: 'removed' }, { where: { relationship: 'follower', holonId, userId }})
        .then(res.send('success'))
        .catch(err => console.log(err))
})

module.exports = router