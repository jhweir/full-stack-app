require("dotenv").config()
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const linkPreviewGenerator = require('link-preview-generator')
const authenticateToken = require('../middleware/authenticateToken')
const { postAttributes } = require('../GlobalConstants')
const {
    Holon,
    PostHolon,
    User,
    Post,
    Comment,
    Reaction,
    PollAnswer,
    Prism,
    PrismUser,
    PlotGraph,
    Link,
    Notification,
} = require('../models')

// GET
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
        where: { id: postId, state: 'visible' },
        attributes: attributes,
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath']
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
            parentCommentId: null,
            text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` },
            createdAt: { [Op.between]: [startDate, Date.now()] },
            // [Op.or]: [
            //     { text: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } },
            //     { creator: { name: { [Op.like]: `%${searchQuery ? searchQuery : ''}%` } } }
            // ]
        },
        order,
        limit: Number(limit),
        offset: Number(offset),
        attributes: ['id', 'creatorId', 'parentCommentId', 'postId', 'text', 'createdAt'],
        include: [
            {
                model: User,
                as: 'creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath']
            },
            {
                model: Comment,
                as: 'replies',
                separate: true,
                where: { state: 'visible' },
                order,
                attributes: ['id', 'creatorId', 'parentCommentId', 'postId', 'text', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'handle', 'name', 'flagImagePath']
                    }
                ]
            },
        ]
    })
    .then(comments => { res.json(comments) })
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

router.get('/scrape-url', async (req, res) => {
    const { url } = req.query
    try {
        const previewData = await linkPreviewGenerator(url)
        res.send(previewData)
    } catch(err) {
        res.send(err.toString())
    }
})

// POST
// todo: add authenticateToken to all endpoints below
router.post('/create-post', authenticateToken, (req, res) => {
    const accountId = req.user.id
    const {
        type,
        subType,
        state,
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
                creatorId: accountId,
                postId: post.id,
                holonId: id
            })
        })
        indirectHandleIds.forEach(id => {
            PostHolon.create({
                type: 'post',
                relationship: 'indirect',
                creatorId: accountId,
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
                userId: accountId
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
            creatorId: accountId,
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
                creatorId: accountId,
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
            holonAId: holonId,
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
            holonAId: holonId,
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
            holonAId: holonId,
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

router.post('/submit-comment', (req, res) => {
    const { accountId, accountHandle, accountName, holonId, postId, text } = req.body

    // find post owner
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
            holonId,
            postId,
            text
        })
        .then(comment => {
            // create notificaton for post owner
            Notification.create({
                ownerId: post.creator.id,
                type: 'post-comment',
                seen: false,
                holonAId: holonId,
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
                    Hi ${post.creator.name}, ${accountName} just commented on your post on weco:
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

router.post('/submit-reply', async (req, res) => {
    const { accountId, accountHandle, accountName, holonId, postId, parentCommentId, text } = req.body

    // find post owner
    const post = await Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [{ 
            model: User,
            as: 'creator',
            attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
        }]
    })

    // find parent comment owner
    const parentComment = await Comment.findOne({
        where: { id: parentCommentId },
        attributes: [],
        include: [{ 
            model: User,
            as: 'creator',
            attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
        }]
    })

    //create reply
    Comment
        .create({
            state: 'visible',
            creatorId: accountId,
            holonId,
            postId,
            parentCommentId,
            text
        })
        .then(comment => {
            // create notificaton for post owner
            Notification.create({
                ownerId: post.creator.id,
                type: 'post-comment',
                seen: false,
                holonAId: holonId,
                userId: accountId,
                postId,
                commentId: comment.id
            })

            // create notificaton for parent comment owner
            Notification.create({
                ownerId: parentComment.creator.id,
                type: 'comment-reply',
                seen: false,
                holonAId: holonId,
                userId: accountId,
                postId,
                commentId: comment.id
            })

            // send email to post owner
            let url = process.env.NODE_ENV === 'dev' ? process.env.DEV_APP_URL : process.env.PROD_APP_URL
            let postOwnerMessage = {
                to: post.creator.email,
                from: 'admin@weco.io',
                subject: 'Weco - notification',
                text: `
                    Hi ${post.creator.name}, ${accountName} just commented on your post on weco:
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
            let parentCommentOwnerMessage = {
                to: parentComment.creator.email,
                from: 'admin@weco.io',
                subject: 'Weco - notification',
                text: `
                    Hi ${post.creator.name}, ${accountName} just replied to your comment on weco:
                    http://${url}/p/${postId}
                `,
                html: `
                    <p>
                        Hi ${post.creator.name},
                        <br/>
                        <a href='${url}/u/${accountHandle}'>${accountName}</a>
                        just replied to your
                        <a href='${url}/p/${postId}'>comment</a>
                        on weco
                    </p>
                `,
            }
            let sendPostOwnerMessage = sgMail.send(postOwnerMessage)
            let sendParentCommentOwnerMessage = sgMail.send(parentCommentOwnerMessage)
            Promise
                .all([sendPostOwnerMessage, sendParentCommentOwnerMessage])
                .then(() => {
                    console.log('Emails sent')
                    res.send('success')
                })
                .catch((error) => {
                    console.error(error)
                })
        })
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
            holonAId: holonId,
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

// DELETE
router.delete('/delete-post', (req, res) => {
    // TODO: endpoints like this are currently unsafe/open to anyone. include authenticate middleware.
    const { itemId } = req.body
    Post
        .update({ state: 'hidden' }, { where: { id: itemId } })
        .then(res.send('success'))
        .catch((error) => {
            console.error(error)
        })
})

router.delete('/delete-comment', (req, res) => {
    // TODO: endpoints like this are currently unsafe/open to anyone. include authenticate middleware.
    const { itemId } = req.body

    Comment
        .update({ state: 'hidden' }, { where: { id: itemId } })
        .then(res.send('success'))
        .catch((error) => {
            console.error(error)
        })
})

module.exports = router