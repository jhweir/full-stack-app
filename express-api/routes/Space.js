require("dotenv").config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const { v4: uuidv4 } = require('uuid')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const authenticateToken = require('../middleware/authenticateToken')
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
const {
    postAttributes,
    totalSpaceFollowers,
    totalSpaceComments,
    totalSpaceReactions,
    totalSpaceLikes,
    totalSpaceRatings,
    totalSpacePosts,
    totalSpaceChildren,
    totalUserPosts,
    totalUserComments,
    asyncForEach
} = require('../GlobalConstants')

const spaceAttributes = [
    'id',
    'handle',
    'name',
    'description',
    'flagImagePath',
    'coverImagePath',
    'createdAt',
    totalSpaceFollowers,
    totalSpaceComments,
    totalSpaceReactions,
    totalSpaceLikes,
    totalSpaceRatings,
    totalSpacePosts,
    totalSpaceChildren
]

const userAttributes = [
    'id',
    'handle',
    'name',
    'bio',
    'flagImagePath',
    'coverImagePath',
    'createdAt',
    totalUserPosts,
    totalUserComments
]

const firstGenLimit = 7
const secondGenLimit = 3
const thirdGenLimit = 3
const fourthGenLimit = 3

function findStartDate(timeRange) {
    let timeOffset = Date.now()
    if (timeRange === 'Last Year') { timeOffset = (24*60*60*1000) * 365 }
    if (timeRange === 'Last Month') { timeOffset = (24*60*60*1000) * 30 }
    if (timeRange === 'Last Week') { timeOffset = (24*60*60*1000) * 7 }
    if (timeRange === 'Last 24 Hours') { timeOffset = 24*60*60*1000 }
    if (timeRange === 'Last Hour') { timeOffset = 60*60*1000 }
    let startDate = new Date()
    startDate.setTime(startDate.getTime() - timeOffset)
    return startDate
}

function findOrder(sortOrder, sortBy) {
    let direction, order
    if (sortOrder === 'Ascending') { direction = 'ASC' } else { direction = 'DESC' }
    if (sortBy === 'Date') { order = [['createdAt', direction]] }
    else { order = [[sequelize.literal(`total_${sortBy.toLowerCase()}`), direction], ['createdAt', 'DESC']] }
    return order
}

function findSpaceFirstAttributes(sortBy) {
    let firstAttributes = ['id']
    if (sortBy === 'Followers') firstAttributes.push(totalSpaceFollowers)
    if (sortBy === 'Posts') firstAttributes.push(totalSpacePosts)
    if (sortBy === 'Comments') firstAttributes.push(totalSpaceComments)
    if (sortBy === 'Reactions') firstAttributes.push(totalSpaceReactions)
    if (sortBy === 'Likes') firstAttributes.push(totalSpaceLikes)
    if (sortBy === 'Ratings') firstAttributes.push(totalSpaceRatings)
    return firstAttributes
}

function findSpaceWhere(spaceId, depth, timeRange, searchQuery) {
    let where
    if (depth === 'All Contained Spaces') { 
        where =
        { 
            '$HolonHandles.id$': spaceId,
            id: { [Op.ne]: [spaceId] },
            createdAt: { [Op.between]: [findStartDate(timeRange), Date.now()] },
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
            '$DirectParentHolons.id$': spaceId,
            createdAt: { [Op.between]: [findStartDate(timeRange), Date.now()] },
            [Op.or]: [
                { handle: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { description: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
            ]
        }
    }
    return where
}

function findSpaceInclude(depth) {
    let include
    if (depth === 'All Contained Spaces') { 
        include = [{ 
            model: Holon,
            as: 'HolonHandles',
            attributes: [],
            through: { attributes: [], where: { state: 'open' } }
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

function findUserFirstAttributes(sortBy) {
    let firstAttributes = ['id']
    if (sortBy === 'Posts') firstAttributes.push(totalUserPosts)
    if (sortBy === 'Comments') firstAttributes.push(totalUserComments)
    return firstAttributes
}

function findTotalSpaceResults(depth, searchQuery, timeRange) {
    function formatDate(date) {
        const d = date.toISOString().split(/[-T:.]/)
        return `${d[0]}-${d[1]}-${d[2]} ${d[3]}:${d[4]}:${d[5]}`
    }
    const startDate = formatDate(findStartDate(timeRange))
    const now = formatDate(new Date)

    if (depth === 'All Contained Spaces') {
        return [sequelize.literal(`(
            SELECT COUNT(*)
                FROM Holons s
                WHERE s.id != Holon.id
                AND s.id IN (
                    SELECT HolonHandles.holonAId
                    FROM HolonHandles
                    RIGHT JOIN Holons
                    ON HolonHandles.holonAId = Holons.id
                    WHERE HolonHandles.holonBId = Holon.id
                    AND HolonHandles.state = 'open'
                ) AND (
                    s.handle LIKE '%${searchQuery}%'
                    OR s.name LIKE '%${searchQuery}%'
                    OR s.description LIKE '%${searchQuery}%'
                ) AND s.createdAt BETWEEN '${startDate}' AND '${now}'
            )`), 'total_results'
        ]
    } else {
        return [sequelize.literal(`(
            SELECT COUNT(*)
                FROM Holons s
                WHERE s.id IN (
                    SELECT vhr.holonBId
                    FROM VerticalHolonRelationships vhr
                    RIGHT JOIN Holons
                    ON vhr.holonAId = Holon.id
                    WHERE vhr.state = 'open'
                ) AND (
                    s.handle LIKE '%${searchQuery}%'
                    OR s.name LIKE '%${searchQuery}%'
                    OR s.description LIKE '%${searchQuery}%'
                ) AND s.createdAt BETWEEN '${startDate}' AND '${now}'
            )`), 'total_results'
        ]
    }
}

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
            type = ['text', 'poll', 'url', 'glass-bead-game', 'prism', 'plot-graph']
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
                // links could be removed for list calls, only needed for map.
                // todo: seperate out 'get space posts' and 'get space map data', as more differeces required for map in future
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
    const {
        accountId,
        spaceId,
        timeRange,
        spaceType,
        sortBy,
        sortOrder,
        depth,
        searchQuery,
        limit,
        offset
    } = req.query

    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts with calculated stats and pagination applied.
    // Second query used to return related models.
    Holon.findAll({
        where: findSpaceWhere(spaceId, depth, timeRange, searchQuery),
        order: findOrder(sortOrder, sortBy),
        attributes: findSpaceFirstAttributes(sortBy),
        include: findSpaceInclude(depth),
        limit: Number(limit),
        offset: Number(offset),
        subQuery: false,
    })
    .then(holons => {
        Holon.findAll({ 
            where: { id: holons.map(holon => holon.id) },
            order: findOrder(sortOrder, sortBy),
            attributes: spaceAttributes,
        }).then(data => { res.json(data) })
    })
    .catch(err => console.log(err))
})

router.get('/holon-users', (req, res) => {
    const { accountId, spaceId, timeRange, userType, sortBy, sortOrder, searchQuery, limit, offset } = req.query

    User.findAll({
        where: { 
            '$FollowedHolons.id$': spaceId,
            emailVerified: true,
            createdAt: { [Op.between]: [findStartDate(timeRange), Date.now()] },
            [Op.or]: [
                { handle: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
                { bio: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } }
            ]
        },
        order: findOrder(sortOrder, sortBy),
        limit: Number(limit),
        offset: Number(offset),
        attributes: findUserFirstAttributes(sortBy),
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
            order: findOrder(sortOrder, sortBy),
            attributes: userAttributes,
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
    const { spaceId, offset, sortBy, sortOrder, timeRange, depth, searchQuery } = req.query

    async function findNextGeneration(generation, parent, limit, offsetAmount) {
        const genOffset = Number(offsetAmount)
        const childAttributes = [
            ...spaceAttributes,
            findTotalSpaceResults(depth, searchQuery, timeRange)
        ]
        parent.children = []
        if (!parent.isExpander && parent.total_children > 0) {
            const nextGeneration = await Holon.findAll({
                where: findSpaceWhere(parent.id, depth, timeRange, searchQuery),
                attributes: childAttributes,
                limit,
                offset: genOffset > 0 ? genOffset : null,
                order: findOrder(sortOrder, sortBy),
                include: findSpaceInclude(depth),
                subQuery: false
            })
            nextGeneration.forEach(child => {
                parent.children.push(child.toJSON())
            })
        }
        // if hidden spaces, replace last space with expander
        if (parent.children.length) {
            if (generation === 1) {
                if (parent.total_results > genOffset + parent.children.length) {
                    parent.children.splice(-1, 1)
                    const remainingChildren = parent.total_results - parent.children.length - genOffset
                    parent.children.push({ isExpander: true, id: uuidv4(), name: `${remainingChildren} more spaces` })
                }
            } else {
                if (parent.total_results > limit) {
                    parent.children.splice(-1, 1)
                    const remainingChildren = parent.total_results - parent.children.length
                    parent.children.push({ isExpander: true, id: uuidv4(), name: `${remainingChildren} more spaces` })
                }
            }
        }
    }

    const rootAttributes = [
        ...spaceAttributes,
        findTotalSpaceResults(depth, searchQuery, timeRange)
    ]
    const findRoot = await Holon.findOne({ 
        where: { id: spaceId },
        attributes: rootAttributes
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
    const findFourthGeneration = await asyncForEach(root.children, async(child) => {
        await asyncForEach(child.children, async(child2) => {
            await asyncForEach(child2.children, async(child3) => {
                await findNextGeneration(4, child3, fourthGenLimit, 0)
            })
        })
    })

    Promise
        .all([findFirstGeneration, findSecondGeneration, findThirdGeneration, findFourthGeneration])
        .then(() => {
            if (offset > 0) res.send(root.children)
            else res.send(root)
        })
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
                                        { model: User, as: 'HolonUsers', through: { where: { relationship: 'moderator' } } },
                                        { model: Holon, as: 'HolonHandles' }
                                    ]
                                })
                                .then(async holon => {
                                    // if user is moderator of parent space, attach space
                                    if (holon.HolonUsers.some(mod => mod.id === creatorId)) {
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
                                        let createAccountNotifications = await holon.HolonUsers.forEach(moderator => {
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

router.post('/delete-space', (req, res) => {
    // 1. find space
    // 2. option to delete all contained spaces if user is mod?
    // 3. set space state from 'active' to 'removed-by-mod'
    // 4. for each child-space, run logic for removing a parent space
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
        // todo: send mod invitation first and wait for it to be accepted before implementing
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
                    { model: User, as: 'HolonUsers', through: { where: { relationship: 'moderator' } } },
                    { model: Holon, as: 'HolonHandles' }
                ]
            })
            .then(async holon => {
                // if user is moderator of parent space, attach space
                if (holon.HolonUsers.some(mod => mod.id === accountId)) {
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
                    // if only parent space is currently 'all', remove vertical relationshsip
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
                    let createAccountNotifications = await holon.HolonUsers.forEach(moderator => {
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
    }
    if (setting === 'remove-parent-holon') {
        // 1. list current parent spaces on front end and allow user to select the parent space they want to remove
        // 2. detach space from parent space (VHRelationship)
        // 3. if no other parent spaces, re-attach to 'all'
        // 4. find parent spaces handles (parent handles)
        // 5. find all other parent spaces handles (other parent handles)
        // 6. compare 'parent handles' with 'other parent handles' and find any 'parent handles' not included in 'other parent handles' (redundant handles)
        // 7. if redundant handles, remove 'redundant handles' from space
        // 8. find all direct child spaces of space
        // 9. repeat stages 5-7 (compare all parent handles against passed down redundant handles), then run the same logic at each level below until no child spaces left

        // rename space handles to a better descriptor: space tags?, space inheritance, inherited space ids

        // check parent space exists
        Holon.findOne({
            where: { handle: newValue },
            include: [{ model: Holon, as: 'HolonHandles' }]
        })
        .then(holon => {
            if (holon) {
                // 

                // // if it exists, find all its own parent spaces
                // VerticalHolonRelationship.findAll({
                //     where: { holonBId: holon.id }
                // })
                // .then(holons => {
                //     // TODO: ...
                //     console.log('holons: ', holons)
                // })
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