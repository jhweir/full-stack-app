require("dotenv").config()
const express = require('express')
const router = express.Router()
var sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const Op = sequelize.Op
const db = require('../models/index')
const linkPreviewGenerator = require("link-preview-generator")
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const Holon = require('../models').Holon
const VerticalHolonRelationship = require('../models').VerticalHolonRelationship
const HolonHandle = require('../models').HolonHandle
const HolonUser = require('../models').HolonUser
const PostHolon = require('../models').PostHolon
const User = require('../models').User
const Post = require('../models').Post
const Comment = require('../models').Comment
const Reaction = require('../models').Reaction
const PollAnswer = require('../models').PollAnswer
const Prism = require('../models').Prism
const PrismUser = require('../models').PrismUser
const PlotGraph = require('../models').PlotGraph
const Link = require('../models').Link
const Notification = require('../models').Notification

const postAttributes = [
    'id', 'type', 'subType', 'state', 'text', 'url', 'urlImage', 'urlDomain', 'urlTitle', 'urlDescription', 'createdAt',
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
        ),'total_comments'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type != 'vote' AND Reaction.state = 'active')
        + (SELECT COUNT(*) FROM Links AS Link WHERE Link.state = 'visible' AND (Link.itemAId = Post.id OR Link.itemBId = Post.id) AND Link.type = 'post-post')`
        ),'total_reactions'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'like' AND Reaction.state = 'active')`
        ),'total_likes'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'repost' AND Reaction.state = 'active')`
        ),'total_reposts'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
        ),'total_ratings'
    ],
    [sequelize.literal(
        `(SELECT SUM(value) FROM Reactions AS Reaction WHERE Reaction.postId = Post.id AND Reaction.type = 'rating' AND Reaction.state = 'active')`
        ),'total_rating_points'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Links AS Link WHERE Link.state = 'visible' AND (Link.itemAId = Post.id OR Link.itemBId = Post.id) AND Link.type = 'post-post')` //AND Link.state = 'active'
        ),'total_links'
    ],
]

router.get('/holon-data', (req, res) => {
    Holon.findOne({ 
        where: { handle: req.query.handle },
        attributes: ['id', 'handle', 'name', 'description', 'flagImagePath', 'coverImagePath', 'createdAt'],
        include: [
            { 
                model: Holon,
                as: 'DirectChildHolons',
                attributes: ['handle', 'name', 'description', 'flagImagePath'],
                through: { attributes: [] }
            },
            {
                model: Holon,
                as: 'DirectParentHolons',
                attributes: ['handle', 'name', 'description', 'flagImagePath'],
                through: { attributes: [] }
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
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
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
        console.log('posts.length: ', posts.length)
        console.log('Number(limit): ', Number(limit))
        console.log('Number(offset): ', Number(offset))
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
                AND Link.itemAId = Post.id
                AND Link.creatorId = ${accountId}
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
                through: { attributes: [] }
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
                        AND Reactions.type = 'heart'
                        AND Reactions.postId IN (
                            SELECT PostHolons.postId
                            FROM PostHolons
                            RIGHT JOIN Posts
                            ON PostHolons.postId = Posts.id
                            WHERE PostHolons.HolonId = Holon.id
                        )
                    )`), 'total_hearts'
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

router.get('/all-users', (req, res) => {
    const { accountId, timeRange, userType, sortBy, sortOrder, searchQuery, limit, offset } = req.query

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

router.get('/user-data', (req, res) => {
    //console.log('req.query', req.query)
    User.findOne({ 
        where: { handle: req.query.userHandle },
        attributes: ['id', 'handle', 'name', 'bio', 'flagImagePath', 'coverImagePath', 'createdAt'],
        include: [
            { 
                model: Post,
                //as: 'createdPosts',
                //attributes: postAttributes //['id']
            },
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
    .then(user => {
        // replace PostHolons array of objects with simpler Post_Holons array of strings
        // const spaces = post.PostHolons.map(ph => ph.handle)
        // post.setDataValue("spaces", spaces)
        // delete post.dataValues.PostHolons
        // replace raw createdAt dates in PollAnswer.Reactions with parsed number strings
        // post.PollAnswers.forEach(answer => answer.Votes.forEach(label => {
        //     label.setDataValue("parsedCreatedAt", Date.parse(label.createdAt))
        //     delete label.dataValues.createdAt
        // }))
        return user
    })
    .then(user => { res.json(user) })
    .catch(err => console.log(err))
})

router.get('/user-posts', (req, res) => {
    const { accountId, userId, timeRange, postType, sortBy, sortOrder, searchQuery, limit, offset } = req.query

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
        if (postType === 'All Types') { type = ['text', 'poll', 'url', 'glass-bead', 'prism', 'plot-graph'] }
        if (postType !== 'All Types') { type = postType.toLowerCase() }
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
                    through: { where: {  relationship: 'direct' }, attributes: ['type'] },
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
                // // replace PostHolons object with simpler array
                // const newPostHolons = post.PostHolons.map(ph => ph.handle)
                // post.setDataValue("spaces", newPostHolons)
                // delete post.dataValues.PostHolons
            })
            return posts
        })
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/account-notifications', (req, res) => {
    //TODO: add authenticateToken middleware to protect endpoint
    const { accountId } = req.query
    Notification
        .findAll({
            where: { ownerId: accountId },
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
                }
            ]
        })
        .then(notifications => res.send(notifications))
})

router.get('/post-data', (req, res) => {
    const { accountId, postId } = req.query
    let attributes = [
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
            FROM PostHolons
            AS PostHolon
            WHERE  PostHolon.postId = Post.id
            AND PostHolon.creatorId = ${accountId}
            AND PostHolon.type = 'repost'
            AND PostHolon.relationship = 'direct'
            )`),'account_repost'
        ],
        [sequelize.literal(`(
            SELECT COUNT(*)
            FROM Links
            AS Link
            WHERE Link.itemAId = Post.id
            AND Link.state = 'visible'
            AND Link.creatorId = ${accountId}
            )`),'account_link'
        ]
    ]
    Post.findOne({ 
        where: { id: postId },
        attributes: attributes,
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['handle', 'name', 'flagImagePath']
            },
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
                model: PollAnswer,
                attributes: [
                    'id', 'text',
                    [sequelize.literal(
                        `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.pollAnswerId = PollAnswers.id )`
                        ),'total_votes'
                    ],
                    [sequelize.literal(
                        `(SELECT ROUND(SUM(value), 2) FROM Reactions AS Reaction WHERE Reaction.pollAnswerId = PollAnswers.id)`
                        ),'total_score'
                    ],
                ]
            }
        ]
    })
    .then(post => {
        post.DirectSpaces.forEach(space => {
            space.setDataValue('type', space.dataValues.PostHolon.type)
            delete space.dataValues.PostHolon
        })
        post.IndirectSpaces.forEach(space => {
            space.setDataValue('type', space.dataValues.PostHolon.type)
            delete space.dataValues.PostHolon
        })
        //return post
        res.json(post)
    })
    //.then(post => { res.json(post) })
    .catch(err => console.log(err))
})

router.get('/post-reaction-data', (req, res) => {
    const { postId } = req.query
    Post.findOne({ 
        where: { id: postId },
        attributes: [],
        include: [
            { 
                model: Reaction,
                where: { state: 'active' },
                attributes: ['type', 'value'],
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['handle', 'name', 'flagImagePath']
                    },
                    // TODO: potentially change Reaction includes based on reaction type to reduce unused data
                    // (most wouldn't need holon data)
                    {
                        model: Holon,
                        as: 'space',
                        attributes: ['handle', 'name', 'flagImagePath']
                    }
                ]
            },
            // {
            //     model: Holon,
            //     as: 'Reposts',
            //     attributes: ['handle'],
            //     through: { where: { type: 'repost', relationship: 'direct' }, attributes: ['creatorId'] },
            // },
        ]
    })
    .then(post => { res.json(post) })
    .catch(err => console.log(err))
})

router.get('/post-comments', (req, res) => {
    const { accountId, postId, timeRange, postType, sortBy, sortOrder, searchQuery, limit, offset } = req.query
    // console.log('req.query: ', req.query)

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

    function findOrder() {
        let direction, order
        if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
        if (sortBy === 'Date') { order = [['createdAt', direction]] }
        //else { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction]] }
        return order
    }

    let startDate = findStartDate()
    let order = findOrder()

    Comment.findAll({ 
        where: {
            postId,
            state: 'visible',
            text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` },
            createdAt: { [Op.between]: [startDate, Date.now()] },
            // [Op.or]: [
            //     { text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
            //     { commentCreator: { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } } }
            // ]
        },
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: ['id', 'creatorId', 'text', 'createdAt'],
        include: [
            {
                model: User,
                as: 'commentCreator',
                attributes: ['id', 'handle', 'name', 'flagImagePath']
            }
        ]
    })
    .then(comments => { res.json(comments) })
    .catch(err => console.log(err))
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

router.get('/poll-votes', (req, res) => {
    Reaction.findAll({ 
        where: { type: 'vote', postId: req.query.postId },
        attributes: ['pollAnswerId', 'value', 'createdAt']
    })
    .then(labels => {
        labels.forEach(label => {
            label.setDataValue("parsedCreatedAt", Date.parse(label.createdAt))
            delete label.dataValues.createdAt
        })
        return labels
    })
    .then(labels => { res.json(labels) })
})

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
            .then(newHolon => {
                // Set up moderator relationship between creator and holon
                HolonUser.create({
                    relationship: 'moderator',
                    state: 'active',
                    holonId: newHolon.id,
                    userId: creatorId
                })
                // Attach new holon to parent holon(s)
                VerticalHolonRelationship.create({
                    state: 'open',
                    holonAId: parentHolonId,
                    holonBId: newHolon.id,
                })
                // Create a unique tag for the holon
                HolonHandle.create({
                    state: 'open',
                    holonAId: newHolon.id,
                    holonBId: newHolon.id,
                })
                // Copy the parent holons tags to the new holon
                //// 1. Work out parent holons tags
                Holon
                    .findOne({
                        where: { id: parentHolonId },
                        include: [{ model: Holon, as: 'HolonHandles' }]
                    })
                    .then(data => {
                        //// 2. Add them to the new holon
                        data.HolonHandles.forEach((tag) => {
                            HolonHandle.create({
                                state: 'open',
                                holonAId: newHolon.id,
                                holonBId: tag.id,
                            })
                        })
                    })
                    .catch(err => console.log(err))
            })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
})

router.post('/create-post', (req, res) => {
    const {
        type,
        subType,
        state,
        creatorId,
        text,
        url,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription,
        holonHandles,
        pollAnswers,
        numberOfPrismPlayers,
        prismDuration,
        prismPrivacy,
        numberOfPlotGraphAxes,
        axis1Left,
        axis1Right,
        axis2Top,
        axis2Bottom,
        createPostFromTurnData
    } = req.body.post

    //console.log('createPostFromTurnData: ', createPostFromTurnData)

    let directHandleIds = []
    let indirectHandleIds = []

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    function findDirectHandleIds() {
        Holon.findAll({
            where: { handle: holonHandles },
            attributes: ['id']
        })
        .then(holons => {
            directHandleIds.push(...holons.map(holon => holon.id))
        })
    }

    async function findIndirectHandleIds(handle) {
        await Holon.findOne({
            where: { handle: handle },
            include: [{ model: Holon, as: 'HolonHandles', attributes: ['id'], through: { attributes: [] } }]
        })
        .then(holon => {
            indirectHandleIds.push(...holon.HolonHandles.map(holon => holon.id))
        })
    }

    async function findHandleIds() {
        findDirectHandleIds()
        await asyncForEach(holonHandles, async(handle) => {
            await findIndirectHandleIds(handle)
        })
        // remove duplicates from indirect handle ids
        indirectHandleIds = [...new Set(indirectHandleIds)]
        // remove ids already included in direct handle ids from indirect handle ids
        indirectHandleIds = indirectHandleIds.filter(id => !directHandleIds.includes(id))
    }

    function createNewPostHolons(post) {
        directHandleIds.forEach(id => {
            PostHolon.create({
                type: 'post',
                relationship: 'direct',
                creatorId,
                postId: post.id,
                holonId: id
            })
        })
        indirectHandleIds.forEach(id => {
            PostHolon.create({
                type: 'post',
                relationship: 'indirect',
                creatorId,
                postId: post.id,
                holonId: id
            })
        })
    }

    function createNewPollAnswers(post) {
        pollAnswers.forEach(answer => PollAnswer.create({ text: answer, postId: post.id }))
    }

    function createPrism(post) {
        Prism.create({
            postId: post.id,
            numberOfPlayers: numberOfPrismPlayers,
            duration: prismDuration,
            privacy: prismPrivacy
        })
        .then(prism => {
            PrismUser.create({
                prismId: prism.id,
                userId: creatorId
            })
        })
    }

    function createPlotGraph(post) {
        PlotGraph.create({
            postId: post.id,
            numberOfPlotGraphAxes,
            axis1Left,
            axis1Right,
            axis2Top,
            axis2Bottom
        })
    }

    function createTurnLink(post) {
        Link.create({
            state: 'visible',
            creatorId: creatorId,
            type: 'post-post',
            relationship: 'turn',
            itemAId: createPostFromTurnData.postId,
            itemBId: post.id
        })
    }

    let renamedSubType
    if (subType === 'Single Choice') { renamedSubType = 'single-choice' }
    if (subType === 'Multiple Choice') { renamedSubType = 'multiple-choice' }
    if (subType === 'Weighted Choice') { renamedSubType = 'weighted-choice' }

    function createPost() {
        Promise.all([findHandleIds()]).then(() => {
            Post.create({
                type,
                subType: renamedSubType,
                state,
                creatorId,
                text,
                url,
                urlImage,
                urlDomain,
                urlTitle,
                urlDescription,
                state: 'visible'
            })
            .then(post => {
                createNewPostHolons(post)
                if (type === 'poll') createNewPollAnswers(post)
                if (type === 'prism') createPrism(post)
                if (type === 'plot-graph') createPlotGraph(post)
                if (type === 'glass-bead' && createPostFromTurnData.postId) createTurnLink(post)
            })
            .then(res.send('success'))
        })
    }

    createPost()
})

router.delete('/delete-post', (req, res) => {
    // TODO: endpoints like this are currently unsafe/open to anyone. include authenticate middleware.
    const { postId } = req.body
    Post.update({ state: 'hidden' }, { where: { id: postId } })
    // Post.destroy({ where: { id: req.body.id }})
})

router.post('/repost-post', (req, res) => {
    const { accountId, accountHandle, accountName, postId, holonId, spaces } = req.body

    // find post creator from postId
    const notifyPostCreator = Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
            },
        ]
    })
    .then(post => {
        // create notificaton for post creator
        Notification.create({
            ownerId: post.creator.id,
            type: 'post-repost',
            seen: false,
            holonId,
            userId: accountId,
            postId,
            commentId: null
        })
        // send email to post creator
        let message = {
            to: post.creator.email,
            from: 'admin@weco.io',
            subject: 'Weco - notification',
            text: `
                Hi ${post.creator.name}, ${accountName} just reposted your post on weco:
                http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${postId}
            `,
            html: `
                <p>
                    Hi ${post.creator.name},
                    <br/>
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/u/${accountHandle}'>${accountName}</a>
                    just reposted your
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${postId}'>post</a>
                    on weco
                </p>
            `,
        }
        sgMail.send(message)
            .then(() => {
                console.log('Email sent')
                //res.send('success')
            })
            .catch((error) => {
                console.error(error)
            })
    })

    const createPostHolons = spaces.forEach(space => {
        Holon.findOne({
            where: { handle: space },
            attributes: ['id'],
            include: [{
                model: Holon,
                as: 'HolonHandles',
                attributes: ['id'],
                through: { attributes: [] }
            }]
        })
        .then(holon => {
            PostHolon.create({
                type: 'repost',
                relationship: 'direct',
                creatorId: accountId,
                postId: postId,
                holonId: holon.id
            })
            Reaction.create({
                type: 'repost',
                state: 'active',
                holonId: holon.id,
                userId: accountId,
                postId: postId
            })
            holon.HolonHandles
                .filter(handle => handle.id != holon.id)
                .forEach(handle => {
                    PostHolon
                        .findOne({ where: { postId: postId, holonId: handle.id } })
                        .then(postHolon => {
                            if (!postHolon) {
                                PostHolon.create({
                                    type: 'repost',
                                    relationship: 'indirect',
                                    creatorId: accountId,
                                    postId: postId,
                                    holonId: handle.id
                                })
                            }
                        })
                })
        })
    })

    Promise
        .all([createPostHolons, notifyPostCreator])
        .then(res.send('success'))
        .catch(err => { res.send(err) })
})

router.post('/add-like', (req, res) => {
    const { accountId, accountHandle, accountName, postId, holonId } = req.body

    // find post owner from postId
    Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
            },
        ]
    })
    .then(post => {
        // create reaction
        Reaction.create({ 
            type: 'like',
            value: null,
            state: 'active',
            holonId,
            userId: accountId,
            postId,
            commentId: null,
        })
        // create notificaton for post owner
        Notification.create({
            ownerId: post.creator.id,
            type: 'post-like',
            seen: false,
            holonId,
            userId: accountId,
            postId,
            commentId: null
        })
        // send email to post owner
        let message = {
            to: post.creator.email,
            from: 'admin@weco.io',
            subject: 'Weco - notification',
            text: `
                Hi ${post.creator.name}, ${accountName} just liked your post on weco:
                http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${postId}
            `,
            html: `
                <p>
                    Hi ${post.creator.name},
                    <br/>
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/u/${accountHandle}'>${accountName}</a>
                    just liked your
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${postId}'>post</a>
                    on weco
                </p>
            `,
        }
        sgMail.send(message)
            .then(() => {
                console.log('Email sent')
                res.send('success')
            })
            .catch((error) => {
                console.error(error)
            })
    })
})

router.post('/remove-like', (req, res) => {
    const { accountId, postId } = req.body
    Reaction
        .update({ state: 'removed' }, {
            where: { type: 'like', state: 'active', postId, userId: accountId }
        })
        .then(res.send('success'))
})

router.post('/add-rating', (req, res) => {
    const { accountId, accountHandle, accountName, postId, holonId, newRating } = req.body

    // find post owner from postId
    Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
            },
        ]
    })
    .then(post => {
        // create reaction
        Reaction.create({ 
            type: 'rating',
            value: newRating,
            state: 'active',
            holonId,
            userId: accountId,
            postId,
            commentId: null,
        })
        // create notificaton for post owner
        Notification.create({
            ownerId: post.creator.id,
            type: 'post-rating',
            seen: false,
            holonId,
            userId: accountId,
            postId,
            commentId: null
        })
        // send email to post owner
        let message = {
            to: post.creator.email,
            from: 'admin@weco.io',
            subject: 'Weco - notification',
            text: `
                Hi ${post.creator.name}, ${accountName} just rated your post on weco:
                http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${postId}
            `,
            html: `
                <p>
                    Hi ${post.creator.name},
                    <br/>
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/u/${accountHandle}'>${accountName}</a>
                    just rated your
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${postId}'>post</a>
                    on weco
                </p>
            `,
        }
        sgMail.send(message)
            .then(() => {
                console.log('Email sent')
                res.send('success')
            })
            .catch((error) => {
                console.error(error)
            })
    })
})

router.post('/remove-rating', (req, res) => {
    const { accountId, postId, holonId } = req.body
    Reaction.update({ state: 'removed' }, { where: { 
        type: 'rating', state: 'active', postId, userId: accountId 
    } })
    .then(res.send('success'))
})

router.post('/add-comment', (req, res) => {
    let { accountId, accountHandle, accountName, postId, holonId, text } = req.body

    // find post owner from postId
    Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
            },
        ]
    })
    .then(post => {
        // create comment
        Comment.create({
            state: 'visible',
            creatorId: accountId,
            postId,
            text
        })
        .then(comment => {
            // create notificaton for post owner
            Notification.create({
                ownerId: post.creator.id,
                type: 'post-comment',
                seen: false,
                holonId,
                userId: accountId,
                postId,
                commentId: comment.id
            })

            // send email to post owner
            let url = process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL
            let message = {
                to: post.creator.email,
                from: 'admin@weco.io',
                subject: 'Weco - notification',
                text: `
                    Hi ${post.creator.name}, ${accountName} just liked your post on weco:
                    http://${url}/p/${postId}
                `,
                html: `
                    <p>
                        Hi ${post.creator.name},
                        <br/>
                        <a href='${url}/u/${accountHandle}'>${accountName}</a>
                        just commented on your
                        <a href='${url}/p/${postId}'>post</a>
                        on weco
                    </p>
                `,
            }
            sgMail.send(message)
            .then(() => {
                console.log('Email sent')
                res.send('success')
            })
            .catch((error) => {
                console.error(error)
            })
        })
    })
})

router.delete('/delete-comment', (req, res) => {
    // TODO: endpoints like this are currently unsafe/open to anyone. include authenticate middleware.
    const { commentId } = req.body
    Comment.update({ state: 'hidden' }, { where: { id: commentId } })
    // Post.destroy({ where: { id: req.body.id }})
})

router.post('/cast-vote', (req, res) => {
    const { selectedPollAnswers, postId, pollType } = req.body.voteData
    selectedPollAnswers.forEach((answer) => {
        let value = 1
        if (pollType === 'weighted-choice') { value = answer.value / 100}
        Reaction.create({ 
            type: 'vote',
            value: value,
            postId: postId,
            pollAnswerId: answer.id
        })
    })
})

router.post('/register', async (req, res) => {
    const { newHandle, newName, newEmail, newPassword } = req.body
    let token = crypto.randomBytes(64).toString('hex')

    // Check username and email is available then create user (TODO: use [op.Or] to save double call)
    User.findOne({ where: { handle: newHandle } })
        .then(user => {
            if (user) { res.send('handle-taken') }
            else {
                User.findOne({ where: { email: newEmail } })
                    .then(async user => {
                        if (user) { res.send('email-taken') }
                        else {
                            let hashedPassword = await bcrypt.hash(newPassword, 10)
                            User.create({
                                handle: newHandle,
                                name: newName,
                                email: newEmail,
                                password: hashedPassword,
                                emailVerified: false,
                                emailToken: token
                            })
                            let message = {
                                to: newEmail,
                                from: 'admin@weco.io',
                                subject: 'Weco - verify your email',
                                text: `
                                    Hi, thanks for creating an account on weco.
                                    Please copy and paste the address below to verify your email address:
                                    http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_API_URL : process.env.PROD_API_URL}/api/verify-email?token=${token}
                                `,
                                html: `
                                    <h1>Hi</h1>
                                    <p>Thanks for creating an account on weco.</p>
                                    <p>Please click the link below to verify your account:</p>
                                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_API_URL : process.env.PROD_API_URL}/api/verify-email?token=${token}'>Verfiy your account</a>
                                `,
                            }
                            sgMail.send(message)
                                .then(() => {
                                    console.log('Email sent')
                                })
                                .catch((error) => {
                                    console.error(error)
                                })
                            res.send('account-registered')
                        }
                    })
            }
        })
})

router.get('/verify-email', async (req, res) => {
    const { token } = req.query
    User.findOne({ where: { emailToken: token } })
        .then(user => {
            if (user) {
                user.update({ emailVerified: true, emailToken: null })
                // log user in...
                res.redirect(`${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=email-verified`)
            }
            else res.send(`Sorry, we couldn't find a user with that email token.`)
        })
})

router.post('/reset-password-request', async (req, res) => {
    const { email } = req.body
    let token = crypto.randomBytes(64).toString('hex')

    User.findOne({ where: { email } })
        .then(user => {
            if (user) {
                user.update({ passwordResetToken: token })
                let message = {
                    to: email,
                    from: 'admin@weco.io',
                    subject: 'Weco - reset your password',
                    text: `
                        Hi, we recieved a request to reset your password.
                        If that's correct, copy and paste the address below to set a new password:
                        http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=reset-password&token=${token}
                    `,
                    html: `
                        <p>Hi, we recieved a request to reset your password on weco.</p>
                        <p>If that's correct click the link below to set a new password:</p>
                        <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}?alert=reset-password&token=${token}'>Set new password</a>
                    `,
                }
                sgMail.send(message)
                    .then(() => {
                        console.log('Email sent')
                        res.send('email-sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
            else { res.send('user-not-found') }
        })
})

router.post('/reset-password', async (req, res) => {
    const { password, token } = req.body

    User.findOne({ where: { passwordResetToken: token } })
        .then(async user => {
            if (user) {
                let hashedPassword = await bcrypt.hash(password, 10)
                user.update({ password: hashedPassword, passwordResetToken: null })
                res.send('success')
            } else {
                res.send('invalid-token')
            }
        })
})

router.post('/resend-verification-email', async (req, res) => {
    const { userId } = req.body
    let token = crypto.randomBytes(64).toString('hex')

    User.findOne({ where: { id: userId } })
        .then(user => {
            if (user) {
                user.update({ emailToken: token })
                let message = {
                    to: user.email,
                    from: 'admin@weco.io',
                    subject: 'Weco - verify your email',
                    text: `
                        Hi, thanks for creating an account on weco.
                        Please copy and paste the address below to verify your email address:
                        http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_API_URL : process.env.PROD_API_URL}/api/verify-email?token=${token}
                    `,
                    html: `
                        <h1>Hi</h1>
                        <p>Thanks for creating an account on weco.</p>
                        <p>Please click the link below to verify your account:</p>
                        <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_API_URL : process.env.PROD_API_URL}/api/verify-email?token=${token}'>Verfiy your account</a>
                    `,
                }
                sgMail.send(message)
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                res.send('success')
            }
            else {
                res.send('user-not-found')
            }
        })
})

// TODO: remove camel casing
router.post('/followHolon', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser.create({ relationship: 'follower', state: 'active', holonId, userId })
})

router.put('/unfollowHolon', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser.update({ state: 'removed' }, { where: { relationship: 'follower', holonId, userId }})
})

router.post('/scrape-url', async (req, res) => {
    const { url } = req.body
    // https://andrejgajdos.com/how-to-create-a-link-preview/
    try {
        const previewData = await linkPreviewGenerator(url)
        res.send(previewData)
    } catch(err) {
        res.send(err.toString())
    }
})

router.post('/update-holon-setting', async (req, res) => {
    let { holonId, setting, newValue } = req.body
    console.log('req.body', req.body)
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
    if (setting === 'add-new-moderator') {
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
    if (setting === 'add-parent-space') {
        // find handles of parent space
        // find all spaces containing child spaces handles (effectedSpaces)
        // compare handles of parent space against handles of each spaces containing child spaces handles
        // add handles that don't match

        let parent = await Holon.findOne({
            where: { handle: newValue },
            include: [{
                model: Holon,
                as: 'HolonHandles',
                attributes: ['handle', 'id'],
                through: { attributes: [] }
            }]
        })

        let child = await Holon.findOne({
            where: { id: holonId }
        })

        let effectedSpaces = await Holon.findAll({
            where: { '$HolonHandles.handle$': child.dataValues.handle },
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

        // A is a direct parent of B
        VerticalHolonRelationship.create({
            state: 'open',
            holonAId: parent.id,
            holonBId: child.id,
        })

        effectedSpacesWithHolonHandles.forEach(space => {
            parent.HolonHandles.forEach(ph => {
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


        // check parent space exists and grab its holonHandles
        // Holon.findOne({
        //     where: { handle: newValue },
        //     include: [{ model: Holon, as: 'HolonHandles' }]
        // })
        // .then(holon => {
        //     if (holon) {
                // if the parent space exists, create new VHR between the moderated space and the new parent space (A is a direct parent of B)
                // VerticalHolonRelationship.create({
                //     state: 'open',
                //     holonAId: holon.id,
                //     holonBId: holonId,
                // })
                // .then(() => {
                    // TODO: need to add handles to all effected child spaces (all child-spaces of moderated space)

                    // find handles of parent space
                    // find all spaces containing child spaces handles
                    // compare handles of parent space against handles of each spaces containing child spaces handles
                    // add handles that don't match

                    // Holon.findAll({
                    //     where: { '$HolonHandles.handle$': handle },
                    //     include: [{ model: Holon, as: 'HolonHandles' }]
                    // }).then(holons => {
                    //     console.log('holons: ', holons)
                    // })

                    // add all of the parent spaces handles to the child space (post to A appear within B)
                //     holon.HolonHandles.forEach((handle) => {
                //         HolonHandle.create({
                //             state: 'open',
                //             holonAId: holonId,
                //             holonBId: handle.id,
                //         })
                //     })
                // })
                // .then(res.send('success'))
        //     }
        //     else { res.send('No space with that handle') }
        // })
    }
    if (setting === 'remove-parent-space') {
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
                    console.log('holons: ', holons)
                })
            }
            else { res.send('No space with that handle') }
        })
    }

})

router.post('/update-user-setting', async (req, res) => {
    let { accountId, setting, newValue } = req.body

    if (setting === 'change-user-name') {
        User.update({ name: newValue }, { where : { id: accountId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
    if (setting === 'change-user-bio') {
        User.update({ bio: newValue }, { where : { id: accountId } })
            .then(res.send('success'))
            .catch(err => console.log(err))
    }
})

router.get('/prism-data', (req, res) => {
    const { postId } = req.query
    Prism.findOne({ 
        where: { postId: postId },
        include: [
            { 
                model: User,
                attributes: ['handle', 'name', 'flagImagePath'],
                through: { attributes: [] }
            }
        ]
    })
    .then(prism => { res.json(prism) })
    .catch(err => console.log(err))
})

router.get('/space-map-data', (req, res) => {
    const { spaceId } = req.query

    // TODO: make recursive: if space has child spaces, fetch those too and check the next level down, repeat until no child spaces
    Holon.findOne({ 
        where: { id: spaceId },
        attributes: ['id', 'handle', 'name', 'flagImagePath'],
        include: [
            { 
                model: Holon,
                as: 'DirectChildHolons',
                attributes: ['id', 'handle', 'name', 'flagImagePath'],
                through: { attributes: [] },
                include: [
                    { 
                        model: Holon,
                        as: 'DirectChildHolons',
                        attributes: ['id', 'handle', 'name', 'flagImagePath'],
                        through: { attributes: [] },
                        include: [
                            { 
                                model: Holon,
                                as: 'DirectChildHolons',
                                attributes: ['id', 'handle', 'name', 'flagImagePath'],
                                through: { attributes: [] },
                                include: [
                                    { 
                                        model: Holon,
                                        as: 'DirectChildHolons',
                                        attributes: ['id', 'handle', 'name', 'flagImagePath'],
                                        through: { attributes: [] }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    })
    .then(holons => { res.json(holons) })
    .catch(err => console.log(err))
})

router.get('/plot-graph-data', (req, res) => {
    const { postId } = req.query
    PlotGraph.findOne({ 
        where: { postId: postId },
        // include: [
        //     { 
        //         model: User,
        //         attributes: ['handle', 'name', 'flagImagePath'],
        //         through: { attributes: [] }
        //     }
        // ]
    })
    .then(plotGraph => { res.json(plotGraph) })
    .catch(err => console.log(err))
})

router.post('/add-link', (req, res) => {
    let { accountId, accountHandle, accountName, holonId, type, relationship, description, itemAId, itemBId } = req.body

    // find post owner from postId
    Post.findOne({
        where: { id: itemAId },
        attributes: [],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
            },
        ]
    })
    .then(post => {
        const createLink = Link.create({
            state: 'visible',
            creatorId: accountId,
            type,
            relationship,
            description,
            itemAId,
            itemBId
        })
        const createNotification = Notification.create({
            ownerId: post.creator.id,
            type: 'post-link',
            seen: false,
            holonId,
            userId: accountId,
            postId: itemAId,
            commentId: null
        })
        const message = {
            to: post.creator.email,
            from: 'admin@weco.io',
            subject: 'Weco - notification',
            text: `
                Hi ${post.creator.name}, ${accountName} just linked your post to another post on weco:
                http://${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${itemAId}
            `,
            html: `
                <p>
                    Hi ${post.creator.name},
                    <br/>
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/u/${accountHandle}'>${accountName}</a>
                    just linked your
                    <a href='${process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL}/p/${itemAId}'>post</a>
                    to another post on weco
                </p>
            `,
        }
        const sendEmail = sgMail.send(message).then(() => console.log('Email sent'))
        
        Promise
            .all([createLink, createNotification, sendEmail])
            .then(res.send('success'))
            .catch(err => { res.send(err) })
    })
})

router.post('/remove-link', (req, res) => {
    let { linkId } = req.body
    Link.update({ state: 'hidden' }, { where: { id: linkId } })
        .then(res.send('success'))
        .catch(err => console.log(err))
})

router.get('/post-link-data', async (req, res) => {
    const { postId } = req.query
    let outgoingLinks = await Link.findAll({
        where: { state: 'visible', itemAId: postId },
        attributes: ['id'],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath'],
            },
            { 
                model: Post,
                as: 'postB',
                //attributes: ['handle', 'name', 'flagImagePath'],
                include: [
                    { 
                        model: User,
                        as: 'creator',
                        attributes: ['handle', 'name', 'flagImagePath'],
                    }
                ]
            },
        ]
    })

    let incomingLinks = await Link.findAll({
        where: { state: 'visible', itemBId: postId },
        attributes: ['id'],
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath'],
            },
            { 
                model: Post,
                as: 'postA',
                //attributes: ['handle', 'name', 'flagImagePath'],
                include: [
                    { 
                        model: User,
                        as: 'creator',
                        attributes: ['handle', 'name', 'flagImagePath'],
                    }
                ]
            },
        ]
    })

    let links = {
        outgoingLinks,
        incomingLinks
    }
    // .then(links => {
    //     res.json(links)
    // })
    res.json(links)
})

router.post('/toggle-notification-seen', (req, res) => {
    let { notificationId, seen } = req.body
    // console.log('notificationId: ', notificationId)
    // console.log('seen: ', seen)
    Notification
        .update({ seen }, { where: { id: notificationId } })
        .then(res.send('success'))
})

module.exports = router
