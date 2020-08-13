require("dotenv").config()
const express = require('express')
const router = express.Router()
var sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const Op = sequelize.Op
const db = require('../models/index')

const Holon = require('../models').Holon
const VerticalHolonRelationship = require('../models').VerticalHolonRelationship
const HolonHandle = require('../models').HolonHandle
const HolonUser = require('../models').HolonUser
const PostHolon = require('../models').PostHolon
const User = require('../models').User
const Post = require('../models').Post
const Comment = require('../models').Comment
const Label = require('../models').Label
const PollAnswer = require('../models').PollAnswer
// const Notifications = require('../models').Notification

//const postAttributes = (userId) => [
const postAttributes = [
    'id', 'type', 'subType', 'state', 'text', 'url', 'createdAt',
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
        ),'total_comments'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type != "vote" AND Label.state = 'active')`
        ),'total_reactions'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "like" AND Label.state = 'active')`
        ),'total_likes'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "heart" AND Label.state = 'active')`
        ),'total_hearts'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "rating" AND Label.state = 'active')`
        ),'total_ratings'
    ],
    [sequelize.literal(
        `(SELECT SUM(value) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "rating" AND Label.state = 'active')`
        ),'total_rating_points'
    ],
    // [sequelize.literal(
    //     `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = 2 AND Label.type = 'like')`
    //     ),'account_like'
    // ],
    // [sequelize.literal(
    //     `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = 2 AND Label.type = 'heart')`
    //     ),'account_heart'
    // ],
    // [sequelize.literal(
    //     `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = 2 AND Label.type = 'rating')`
    //     ),'account_rating'
    // ]
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
            }
        ]
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/holon-posts', (req, res) => {
    const { accountId, handle, timeRange, postType, sortBy, sortOrder, depth, searchQuery, limit, offset } = req.query
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

    function findType() {
        let type
        if (postType === 'All Types') { type = ['text', 'poll'] }
        if (postType !== 'All Types') { type = postType.toLowerCase() }
        return type
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
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.state = 'visible' AND Comment.postId = Post.id)`
            ),'total_comments'
        ])}
        if (sortBy === 'Reactions') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type != "vote" AND Label.state = 'active')`
            ),'total_reactions'
        ])}
        if (sortBy === 'Likes') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "like" AND Label.state = 'active')`
            ),'total_likes'
        ])}
        if (sortBy === 'Hearts') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "heart" AND Label.state = 'active')`
            ),'total_hearts'
        ])}
        if (sortBy === 'Ratings') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "rating" AND Label.state = 'active')`
            ),'total_ratings'
        ])}
        return firstAttributes
    }

    // TODO: set up 'Only Direct Posts To Space' when direct holons set up on posts
    function findWhere() {
        let where
        if (depth === 'All Contained Posts') { 
            where =
            { 
                '$PostHolons.handle$': handle,
                state: 'visible',
                createdAt: { [Op.between]: [startDate, Date.now()] },
                type,
                text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` }
            } 
        }
        if (depth === 'Only Direct Posts To Space') {
            where =
            { 
                '$PostHolons.handle$': handle,
                state: 'visible',
                createdAt: { [Op.between]: [startDate, Date.now()] },
                type,
                text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` }
                // [Op.or]: [
                //     { title: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                //     { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
                // ]
            }
        }
        return where
    }

    let startDate = findStartDate()
    let type = findType()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()
    let where = findWhere()

    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts with calculated stats and pagination applied.
    // Second query used to return related models.
    // Final function used to replace PostHolons object with a simpler array.
    Post.findAll({
        subQuery: false,
        where,
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: firstAttributes,
        include: [{ 
            model: Holon,
            as: 'PostHolons',
            attributes: [],
            through: { attributes: [] }
        }]
    })
    .then(posts => {
        // Add account reaction data to post attributes
        let mainAttributes = [
            ...postAttributes,
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${accountId}
                AND Label.type = 'like'
                AND Label.state = 'active'
                )`),'account_like'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${accountId}
                AND Label.type = 'heart'
                AND Label.state = 'active'
                )`),'account_heart'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${accountId}
                AND Label.type = 'rating'
                AND Label.state = 'active'
                )`),'account_rating'
            ]
        ]
        return Post.findAll({ 
            where: { id: posts.map(post => post.id) },
            attributes: mainAttributes,
            order,
            include: [
                {
                    model: Holon,
                    as: 'PostHolons',
                    attributes: ['handle'],
                    through: { attributes: [] },
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
                // replace PostHolons object with simpler array
                const newPostHolons = post.PostHolons.map(ph => ph.handle)
                post.setDataValue("spaces", newPostHolons)
                delete post.dataValues.PostHolons
            })
            return posts
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
                FROM Labels
                WHERE Labels.state = 'active'
                AND Labels.type != 'vote'
                AND Labels.postId IN (
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
                FROM Labels
                WHERE Labels.state = 'active'
                AND Labels.type = 'like'
                AND Labels.postId IN (
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
                FROM Labels
                WHERE Labels.state = 'active'
                AND Labels.type = 'heart'
                AND Labels.postId IN (
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
                FROM Labels
                WHERE Labels.state = 'active'
                AND Labels.type = 'rating'
                AND Labels.postId IN (
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
                        FROM Labels
                        WHERE Labels.state = 'active'
                        AND Labels.type != 'vote'
                        AND Labels.postId IN (
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
                        FROM Labels
                        WHERE Labels.state = 'active'
                        AND Labels.type = 'like'
                        AND Labels.postId IN (
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
                        FROM Labels
                        WHERE Labels.state = 'active'
                        AND Labels.type = 'heart'
                        AND Labels.postId IN (
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
                        FROM Labels
                        WHERE Labels.state = 'active'
                        AND Labels.type = 'rating'
                        AND Labels.postId IN (
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
        // replace raw createdAt dates in PollAnswer.Labels with parsed number strings
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
        if (postType === 'All Types') { type = ['text', 'poll'] }
        if (postType !== 'All Types') { type = postType.toLowerCase() }
        return type
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
        if (sortBy === 'Comments') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.postId = Post.id)`
            ),'total_comments'
        ])}
        if (sortBy === 'Reactions') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type != "vote" AND Label.state = 'active')`
            ),'total_reactions'
        ])}
        if (sortBy === 'Likes') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "like" AND Label.state = 'active')`
            ),'total_likes'
        ])}
        if (sortBy === 'Hearts') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "heart" AND Label.state = 'active')`
            ),'total_hearts'
        ])}
        if (sortBy === 'Ratings') { firstAttributes.push([sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "rating" AND Label.state = 'active')`
            ),'total_ratings'
        ])}
        return firstAttributes
    }

    // TODO: set up 'Only Direct Posts To Space' when direct holons set up on posts
    // function findWhere() {
    //     let where
    //     if (depth === 'All Contained Posts') { 
    //         where =
    //         { 
    //             '$PostHolons.handle$': handle,
    //             createdAt: { [Op.between]: [startDate, Date.now()] },
    //             type,
    //             [Op.or]: [
    //                 { title: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
    //                 { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
    //             ]
    //         } 
    //     }
    //     if (depth === 'Only Direct Posts To Space') {
    //         where =
    //         { 
    //             '$PostHolons.handle$': handle,
    //             createdAt: { [Op.between]: [startDate, Date.now()] },
    //             type,
    //             [Op.or]: [
    //                 { title: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
    //                 { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
    //             ]
    //         }
    //     }
    //     return where
    // }

    let startDate = findStartDate()
    let type = findType()
    let order = findOrder()
    let firstAttributes = findFirstAttributes()
    // let where = findWhere()

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
            text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` }
            // [Op.or]: [
            //     { title: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
            //     { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
            // ]
        },
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: firstAttributes,
        include: [{ 
            model: Holon,
            as: 'PostHolons',
            attributes: [],
            through: { attributes: [] }
        }]
    })
    .then(posts => {
        // Add account reaction data to post attributes
        let mainAttributes = [
            ...postAttributes,
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${accountId}
                AND Label.type = 'like'
                AND Label.state = 'active'
                )`),'account_like'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${accountId}
                AND Label.type = 'heart'
                AND Label.state = 'active'
                )`),'account_heart'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${accountId}
                AND Label.type = 'rating'
                AND Label.state = 'active'
                )`),'account_rating'
            ]
        ]
        return Post.findAll({ 
            where: { id: posts.map(post => post.id) },
            attributes: mainAttributes,
            order,
            include: [
                {
                    model: Holon,
                    as: 'PostHolons',
                    attributes: ['handle'],
                    through: { attributes: [] },
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
                // replace PostHolons object with simpler array
                const newPostHolons = post.PostHolons.map(ph => ph.handle)
                post.setDataValue("spaces", newPostHolons)
                delete post.dataValues.PostHolons
            })
            return posts
        })
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/post-data', (req, res) => {
    const { accountId, postId } = req.query
    let attributes = [...postAttributes,
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = ${accountId} AND Label.type = 'like' AND Label.state = 'active')`
            ),'account_like'
        ],
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = ${accountId} AND Label.type = 'heart' AND Label.state = 'active')`
            ),'account_heart'
        ],
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = ${accountId} AND Label.type = 'rating' AND Label.state = 'active')`
            ),'account_rating'
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
                as: 'PostHolons',
                attributes: ['handle'],
                through: { attributes: [] }
            },
            {
                model: PollAnswer,
                attributes: [
                    'id', 'text',
                    [sequelize.literal(
                        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.pollAnswerId = PollAnswers.id )`
                        ),'total_votes'
                    ],
                    [sequelize.literal(
                        `(SELECT ROUND(SUM(value), 2) FROM Labels AS Label WHERE Label.pollAnswerId = PollAnswers.id)`
                        ),'total_score'
                    ],
                ]
            }
        ]
    })
    .then(post => {
        // replace PostHolons array of objects with simpler 'spaces' array of strings
        const spaces = post.PostHolons.map(ph => ph.handle)
        post.setDataValue("spaces", spaces)
        delete post.dataValues.PostHolons
        return post
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

router.get('/suggested-holon-handles', (req, res) => {
    const { searchQuery } = req.query
    Holon.findAll({
        where: { handle: { [Op.like]: `%${searchQuery}%` } },
        attributes: ['handle']
    })
    .then(handles => { res.json(handles) })
    .catch(err => console.log(err))
})

router.get('/validate-holon-handle', (req, res) => {
    const { searchQuery } = req.query
    Holon.findAll({
        where: { handle: searchQuery },
        attributes: ['handle']
    })
    .then(handle => { res.json(handle) })
    .catch(err => console.log(err))
})

router.get('/poll-votes', (req, res) => {
    Label.findAll({ 
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
        Holon.create({ name, handle, description }).then((newHolon) => {
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
            Holon.findOne({
                where: { id: parentHolonId },
                include: [{ model: Holon, as: 'HolonHandles' }]
            }).then(data => {
            //// 2. Add them to the new holon
                data.HolonHandles.forEach((tag) => {
                    HolonHandle.create({
                        state: 'open',
                        holonAId: newHolon.id,
                        holonBId: tag.id,
                    })
                })
            }).catch(err => console.log(err))
        }).then(res.send('success')).catch(err => console.log(err))
    }
})

router.post('/create-post', (req, res) => {
    const { type, subType, state, creatorId, text, url, holonHandles, pollAnswers } = req.body.post
    let holonIds = []

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array)
        }
    }

    async function findIncludedHolonIds(handle) {
        await Holon.findOne({
            where: { handle: handle },
            include: [{ model: Holon, as: 'HolonHandles', attributes: ['id'], through: { attributes: [] } }]
        })
        .then(holon => {
            holonIds.push(...holon.HolonHandles.map(holon => holon.id))
        })
    }
    
    async function createNewPostHolons(post) {
        await asyncForEach(holonHandles, async(handle) => {
            await findIncludedHolonIds(handle)
        })
        let filteredHolonIds = Array.from(new Set(holonIds))
        filteredHolonIds.forEach(id => PostHolon.create({
            relationship: 'post',
            localState: 'visible',
            postId: post.id,
            holonId: id
        }))
    }

    function createNewPollAnswers(post) {
        pollAnswers.forEach(answer => PollAnswer.create({ text: answer, postId: post.id }))
    }

    // Create the post and all of its assosiated content
    Post.create({
        type, subType, state, creatorId, text, url, state: 'visible'
    })
    .then(post => {
        createNewPostHolons(post)
        createNewPollAnswers(post)
    })
    .then(res.send('Post successfully created'))
})

router.delete('/delete-post', (req, res) => {
    // TODO: endpoints like this are currently unsafe/open to anyone. include authenticate middleware.
    const { postId } = req.body
    Post.update({ state: 'hidden' }, { where: { id: postId } })
    // Post.destroy({ where: { id: req.body.id }})
})

router.put('/add-like', (req, res) => {
    const { accountId, postId, holonId } = req.body
    Label.create({ 
        type: 'like',
        value: null,
        state: 'active',
        holonId,
        userId: accountId,
        postId,
        commentId: null,
    }).then(res.send('Post successfully liked'))
})

router.put('/remove-like', (req, res) => {
    const { accountId, postId } = req.body
    Label.update({ state: 'removed' }, {
        where: { type: 'like', state: 'active', postId, userId: accountId }
    })
})

router.put('/add-heart', (req, res) => {
    const { accountId, postId, holonId } = req.body
    Label.create({ 
        type: 'heart',
        value: null,
        state: 'active',
        holonId,
        userId: accountId,
        postId,
        commentId: null,
    }).then(res.send('Post successfully hearted'))
})

router.put('/remove-heart', (req, res) => {
    const { accountId, postId } = req.body
    Label.update({ state: 'removed' }, {
        where: { type: 'heart', state: 'active', postId, userId: accountId }
    })
})

router.put('/add-rating', (req, res) => {
    const { accountId, postId, holonId, newRating } = req.body
    Label.create({ 
        type: 'rating',
        value: newRating,
        state: 'active',
        holonId,
        userId: accountId,
        postId,
        commentId: null,
    }).then(res.send('Post successfully rated'))
})

router.put('/update-rating', (req, res) => {
    const { accountId, postId, holonId, newRating } = req.body
    Label.update({ state: 'removed' }, { where: { type: 'rating', state: 'active', postId, userId: accountId } })
    .then(() => {
        Label.create({ 
            type: 'rating',
            value: newRating,
            state: 'active',
            holonId,
            userId: accountId,
            postId,
            commentId: null,
        })
    }).then(res.send('Post successfully rated'))
})

router.post('/add-comment', (req, res) => {
    let { creatorId, postId, text } = req.body
    Comment.create({ state: 'visible', creatorId, postId, text })
        .catch(err => console.log(err))

    // // Update number of comments on post in Post table
    // Post.update({ comments: comments }, {
    //     where: { id: postId }
    // })
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
        Label.create({ 
            type: 'vote',
            value: value,
            postId: postId,
            pollAnswerId: answer.id
        })
    })
})

router.post('/register', async (req, res) => {
    const { newHandle, newName, newEmail, newPassword } = req.body

    // Check username and email is available
    User
        .findOne({ where: { handle: newHandle } })
        .then(user => {
            if (user) { res.send('handle-taken') }
            else { User.findOne({ where: { email: newEmail } })
                .then(async user => {
                    if (user) { res.send('email-taken') }
                    else {
                        try {
                            const hashedPassword = await bcrypt.hash(newPassword, 10)
                            User.create({
                                handle: newHandle,
                                name: newName,
                                email: newEmail,
                                password: hashedPassword
                            })
                            res.send('account-registered')
                        } catch {
                            //res.redirect('/')
                        }
                    }
                })
            }
        })
})

router.post('/followHolon', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser.create({ relationship: 'follower', state: 'active', holonId, userId })
})

router.put('/unfollowHolon', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser.update({ state: 'removed' }, { where: { relationship: 'follower', holonId, userId }})
})

module.exports = router

// const options = {
//     secretOrKey: process.env.ACCESS_TOKEN_SECRET,
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// }

// const strategy = new JwtStrategy(options, (payload, next) => {
//     //const user = null
//     //User.find
//     next(null, user)
// })

// passport.use(strategy)
// router.use(passport.initialize())

// router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//     res.send('i\'m protected')
// })

// // Log in
// router.post('/log-in', async (req, res) => {
//     const { email, password } = req.body
//     // Authenticate user
//     User.findOne({ where: { email: email } }).then(user => {
//         //res.send(user)
//         if (!user) { return res.status(400).send('User not found') }
//         bcrypt.compare(password, user.password, function(error, success) {
//             if (error) { /* handle error */ }
//             if (success) { 
//                 const payload = { id: user.id }
//                 const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
//                 res.send(token)
//                 //res.send('Success')
//             }
//             else { res.send('Incorrect password') }
//         })
//     })

//     // Create JWT access token
//     // const user = { email: email }
//     // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
//     // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//     // res.json({ accessToken: accessToken, refreshToken: refreshToken })
// })

// const user = await User.findOne({ where: { email: email } })
// if (!user) { res.status(400).send('User not found') }
// if (await bcrypt.compare(password, user.password)) { 
//     res.send('Success')
//     // user.then(user => {
//     //     const payload = { id: user.id }
//     //     const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
//     //     res.send(token)
//     // })
// }
// else { res.send('Incorrect password') }

// // Pin post
// router.put('/pinpost', (req, res) => {
//     Post.update({ pins: 'Global wall' }, {
//         where: { id: req.body.id }
//     })
//     res.send('Post pinned')
// })

// // Unpin post
// router.put('/unpinpost', (req, res) => {
//     Post.update({ pins: null }, {
//         where: { id: req.body.id }
//     })
//     res.send('Post unpinned')
// })



// .then(data => {
//     console.log(data)
//     // Label.count({
//     //     where: { type: like }
//     // })
// })
// Label.count({
//     // include: ...,
//     where: { type: 'heart'},
//     //distinct: true,
//     col: 'Label.type'
// })
// Label.findAll({
//     // attributes: ['type', [sequelize.fn('count', sequelize.col('type')), 'total']],
//     // group : ['Label.type'],
//     //raw: true,
//     //order: sequelize.literal('count DESC')
// })
// Post.findAll({
//     attributes: [
//         'id',
//         'title',
//         [sequelize.fn('count', sequelize.col('Comments.id')), 'totalComments'],
//         //[sequelize.fn('count', sequelize.col('Labels.id')), 'totalLabels']
//     ],
//     //distinct: true,
//     required: false,
//     right: true,
//     // attributes: {
//     //     include: [[sequelize.fn('count', sequelize.col('Comments.id')), 'totalComments']],
//     //     // group: [sequelize.col('id')],
//     // },
//     group: [sequelize.col('id')],
//     include: [
//         {
//             model: Comment,
//             required: false,
//             //right: true
//             //as: 'postComments'
//             //attributes: []
//         },
//         // {
//         //     model: Label,
//         //     required: false,
//         //     //as: 'postComments'
//         //     //attributes: []
//         // }
//     ]
// })
// Post.findAll({
//     attributes: ['Posts.*', 'Comments.*', [sequelize.fn('count', sequelize.col('Comments.id')), 'totalComments']],
//     //group: [sequelize.col('id')],
//     // required: false,
//     // subQuery: false,
//     // nested: true,
//     include: [
//         {
//             model: Comment,
//             //attributes: []
//         },
//         // {
//         //     model: Label,
//         //     //attributes: []
//         // },
//     ]
// })
// Holon.findOne({
//     where: { id: 1 },
//     include: [
//         {
//             model: Post,
//             through: { attributes: [] },
//             attributes: ['id', 'title', [sequelize.fn('count', sequelize.col('text')), 'total']],
//             // subQuery: false,
//             // attributes: {
//             //     include: [[sequelize.fn('count', sequelize.col('text')), 'total']],
//             // },
//             include: [
//                 {
//                     model: Comment,
//                     //attributes: []
//                     //as: 'postComment',
//                     //required: false,
//                     // attributes: {
//                     //     include: [[sequelize.fn('count', sequelize.col('text')), 'total']],
//                     // } 
//                 },
//             ],
//             required: false,
//         },
//     ]
// })
// Label.findAll({
//     attributes: ['id', 'type', [sequelize.fn('count', sequelize.col('Label.id')), 'totalLabels']],
//     // attributes: {
//     //     include: [[sequelize.fn('count', sequelize.col('Comments.id')), 'totalComments']],
//     //     // group: [sequelize.col('id')],
//     // },
//     group: [sequelize.col('Label.postId')],
//     // include: [
//     //     {
//     //         model: Comment,
//     //     }
//     // ]
// })


    // .then(data => {
//     data.dataValues.Posts.forEach(post => post.dataValues.Holons = post.dataValues.Holons.map(h => h.handle))
//     console.log(d.dataValues.Posts[0].dataValues.Holons)
//     res.json(data)
// })
//// var plainObject = d.get({ plain: true })


    // Post.findAll({
//     attributes: ['id',
//         [sequelize.literal(`(
//             SELECT COUNT(*)
//             FROM Comments AS Comment
//             WHERE
//                 Comment.postId = Post.id
//             )`),
//             'totalComments'
//         ]
//     ],
//     include: [
//         {
//             model: Comment,
//             attributes: ['text']
//         }
//     ],
//     limit: 2
// })




// Post.findAll({ 
//     where: { '$PostHolons.handle$': req.query.id },
//     limit: 2,
//     //offset: 1,
//     subQuery: false,
//     //duplicating: false,
//     //subQuery: false,
//     //required: false,
//     //distinct: true,
//     //separate: true,
//     attributes: [
//         'id',
//         'type',
//         'state',
//         'creator',
//         'title',
//         'description',
//         'url',
//         'createdAt',
//         [sequelize.literal(
//             `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.postId = Post.id )`
//             ),'totalComments'
//         ],
//         [sequelize.literal(
//             `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id)`
//             ),'totalLabels'
//         ],
//         [sequelize.literal(
//             `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "like")`
//             ),'totalLikes'
//         ],
//         [sequelize.literal(
//             `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "heart")`
//             ),'totalHearts'
//         ]
//     ],
//     include: [
//         {
//             model: Holon,
//             //required: false,
//             as: 'PostHolons',
//             attributes: [],
//             //required: false,
//             //distinct: true,
//             // separate: true,
//             // subQuery: false,
//             // duplicating: false,
//             through: { attributes: [] },
//         },
//         {
//             model: Holon,
//             //required: false,
//             as: 'PostHolonsNew',
//             //required: false,
//             // distinct: true,
//             // subQuery: false,
//             // //separate: true,
//             // duplicating: false,
//             attributes: ['id', 'handle'],
//             through: { attributes: [] },
//         },
//         {
//             model: Label,
//             attributes: ['type'],
//             //required: false,
//             separate: true,
//         },
//         {
//             model: Comment,
//             attributes: ['text', 'createdAt'],
//             //required: false,
//             separate: true,
//         }
//     ]
// })
// Post.findAll({ 
//     where: { '$PostHolons.handle$': req.query.id },
//     include: [
//         {
//             model: Holon,
//             as: 'PostHolons',
//             attributes: [],
//             through: { attributes: [] },
//         }
//     ]
// })
// .then(data => {
//     Holon.findAll({
//         where: {
//             '$HolonPosts.id$': 2
//         }
//     })
// })

// router.get('/holon-posts', (req, res) => {
//     const { userId, handle, timeRange, postType, sortBy, searchQuery } = req.query
//     console.log('req.query: ', req.query)
//     // Double query required to to prevent results and pagination being effected by top level where clause.
//     // Intial query used to find correct posts. (including calculated stats and pagination)
//     // Second query used to return post data. (related models only)
//     // Final function used to replace PostHolons object with an array.
//     Post.findAll({ 
//         where: { '$PostHolons.handle$': handle },
//         attributes: ['id'],
//         include: [{ 
//             model: Holon,
//             as: 'PostHolons',
//             attributes: [],
//             through: { attributes: [] }
//         }],
//         //order: [['id', 'DESC']],
//         // limit: 3,
//         // offset: 1,
//         subQuery: false
//     })
//     .then(posts => {
//         // Add account reaction data to post attributes
//         let attributes = [
//             ...postAttributes,
//             [sequelize.literal(`(
//                 SELECT COUNT(*)
//                 FROM Labels
//                 AS Label
//                 WHERE Label.postId = Post.id
//                 AND Label.userId = ${userId}
//                 AND Label.type = 'like'
//                 AND Label.state = 'active'
//                 )`),'account_like'
//             ],
//             [sequelize.literal(`(
//                 SELECT COUNT(*)
//                 FROM Labels
//                 AS Label
//                 WHERE Label.postId = Post.id
//                 AND Label.userId = ${userId}
//                 AND Label.type = 'heart'
//                 AND Label.state = 'active'
//                 )`),'account_heart'
//             ],
//             [sequelize.literal(`(
//                 SELECT COUNT(*)
//                 FROM Labels
//                 AS Label
//                 WHERE Label.postId = Post.id
//                 AND Label.userId = ${userId}
//                 AND Label.type = 'rating'
//                 AND Label.state = 'active'
//                 )`),'account_rating'
//             ]
//         ]
//         return Post.findAll({ 
//             where: { id: posts.map(post => post.id) },
//             attributes: attributes,
//             include: [
//                 {
//                     model: Holon,
//                     as: 'PostHolons',
//                     attributes: ['handle'],
//                     through: { attributes: [] },
//                 },
//                 {
//                     model: User,
//                     as: 'creator',
//                     attributes: ['name', 'flagImagePath'],
//                 }
//             ]
//         })
//         .then(posts => {
//             posts.forEach(post => {
//                 // replace PostHolons object with simpler array
//                 const newPostHolons = post.PostHolons.map(ph => ph.handle)
//                 post.setDataValue("spaces", newPostHolons)
//                 delete post.dataValues.PostHolons
//             })
//             return posts
//         })
//     })
//     .then(data => { res.json(data) })
//     .catch(err => console.log(err))
// })


// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//         req.user = user
//         next()
//     })
// }

// function generateAccessToken(user) {
//     return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
// }

// // Log in
// router.post('/log-in', async (req, res) => {
//     const { email, password } = req.body
//     // Authenticate user
//     User.findOne({ where: { email: email } }).then(user => {
//         //res.send(user)
//         if (!user) { return res.status(400).send('User not found') }
//         bcrypt.compare(password, user.password, function(error, success) {
//             if (error) { /* handle error */ }
//             if (success) { 
//                 const payload = { id: user.id }
//                 const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
//                 res.send(token)
//                 //res.send('Success')
//             }
//             else { res.send('Incorrect password') }
//         })
//     })

//     // Create JWT access token
//     // const user = { email: email }
//     // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
//     // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//     // res.json({ accessToken: accessToken, refreshToken: refreshToken })
// })

// const holonuser = require("../models/holonuser")
// const jwt = require('jsonwebtoken')
// const passport = require("passport")
// const passportJWT = require('passport-jwt')
// const JwtStrategy = passportJWT.Strategy
// const ExtractJwt = passportJWT.ExtractJwt

// replace raw createdAt dates in PollAnswer.Labels with parsed number strings
// post.PollAnswers.forEach(answer => answer.Votes.forEach(label => {
//     label.setDataValue("parsedCreatedAt", Date.parse(label.createdAt))
//     delete label.dataValues.createdAt
// }))