require("dotenv").config()
const config = require('../Config')
const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const Op = sequelize.Op
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const puppeteer = require('puppeteer')
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
    GlassBeadGame,
    GlassBeadGameComment,
    GlassBead
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
            // {
            //     model: GlassBeadGame,
            //     attributes: ['topic']
            // }
            // {
            //     model: PollAnswer,
            //     attributes: [
            //         'id', 'text',
            //         [sequelize.literal(
            //             `(SELECT COUNT(*) FROM Reactions AS Reaction WHERE Reaction.pollAnswerId = PollAnswers.id )`
            //             ),'total_votes'
            //         ],
            //         [sequelize.literal(
            //             `(SELECT ROUND(SUM(value), 2) FROM Reactions AS Reaction WHERE Reaction.pollAnswerId = PollAnswers.id)`
            //             ),'total_score'
            //         ],
            //     ]
            // }
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
                as: 'Creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath']
            },
            {
                model: Comment,
                as: 'Replies',
                separate: true,
                where: { state: 'visible' },
                order,
                attributes: ['id', 'creatorId', 'parentCommentId', 'postId', 'text', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: 'Creator',
                        attributes: ['id', 'handle', 'name', 'flagImagePath']
                    }
                ]
            },
        ]
    })
    .then(comments => { res.json(comments) })
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
        // title, description, domain, image
        const browser = await puppeteer.launch() //{ headless: false })
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle0' }) // load, domcontentloaded, networkidle0, networkidle2
        await page.evaluate(async() => {
            const youtubeCookieConsent = await document.querySelector('base[href="https://consent.youtube.com/"]')
            if (youtubeCookieConsent) {
                const acceptButton = await document.querySelector('button[aria-label="Agree to the use of cookies and other data for the purposes described"]')
                acceptButton.click()
                return
            } else {
                return
            }
        })
        await page.waitForSelector('title')
        const data = await page.evaluate(async() => {
            let title = await document.title
            // let title = await document.querySelector('meta[property="og:title"]')
            // if (!title) title = await document.querySelector('title').innerHTML
            // else title = title.content

            let description = await document.querySelector('meta[property="og:description"]')
            if (description) description = description.content
            // else description = await document.querySelector('p').innerHTML
            const domain = await document.querySelector('meta[property="og:site_name"]') // site_name, url
            const image = await document.querySelector('meta[property="og:image"]')
            return {
                title: title || null,
                description: description || null,
                domain: domain ? domain.content : null,
                image: image ? image.content : null
            }
        })
        res.send(data)
        await browser.close()
    } catch(e) {
        res.send({
            title: null,
            description: null,
            domain: null,
            image: null
        })
    }
})

router.get('/glass-bead-game-data', (req, res) => {
    const { postId } = req.query
    GlassBeadGame.findOne({ 
        where: { postId },
        attributes: [
            'id',
            'topic',
            'locked',
            'numberOfTurns',
            'moveDuration',
            'introDuration',
            'intervalDuration'
        ],
        include: [
            { 
                model: GlassBead,
                // attributes: [],
                order: [['index', 'ASC']],
                separate: true,
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['handle', 'name', 'flagImagePath']
                    }
                ]
            },
            {
                model: GlassBeadGameComment,
                // attributes: [],
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['handle', 'name', 'flagImagePath']
                    }
                ]
            },

        ]
    })
    .then(post => res.json(post))
    .catch(err => console.log(err))
})


// POST
// todo: add authenticateToken to all endpoints below
router.post('/create-post', authenticateToken, (req, res) => {
    const accountId = req.user.id
    const {
        type,
        // subType,
        text,
        url,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription,
        topic,
        spaceHandles,
        // pollAnswers,
        // numberOfPrismPlayers,
        // prismDuration,
        // prismPrivacy,
        // numberOfPlotGraphAxes,
        // axis1Left,
        // axis1Right,
        // axis2Top,
        // axis2Bottom,
        // // createPostFromTurnData,
        // GBGTopic,
        // GBGCustomTopic,
    } = req.body

    // console.log(req.body)

    let directHandleIds = []
    let indirectHandleIds = []

    // todo: pull in from global constants
    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    // todo, use ids from request instead
    function findDirectHandleIds() {
        Holon.findAll({
            where: { handle: spaceHandles, state: 'active' },
            attributes: ['id']
        })
        .then(holons => {
            directHandleIds.push(...holons.map(holon => holon.id))
        })
    }

    async function findIndirectHandleIds(handle) {
        await Holon.findOne({
            where: { handle: handle, state: 'active' },
            include: [{
                model: Holon,
                as: 'HolonHandles',
                attributes: ['id'],
                through: { where: { state: 'open' }, attributes: [] }
            }]
        })
        .then(holon => {
            indirectHandleIds.push(...holon.HolonHandles.map(holon => holon.id))
        })
    }

    async function findHandleIds() {
        findDirectHandleIds()
        await asyncForEach(spaceHandles, async(handle) => {
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

    function createGlassBeadGame(post) {
        GlassBeadGame.create({
            postId: post.id,
            topic: topic,
        })
    }

    Promise.all([findHandleIds()]).then(() => {
        Post.create({
            type,
            // subType,
            state: 'visible',
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
            if (type === 'glass-bead-game') createGlassBeadGame(post)
            res.send(post)
        })
        // .then(res.send('success'))
    })
})

router.post('/repost-post', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { accountHandle, accountName, postId, spaceId, selectedSpaceIds } = req.body

    const post = await Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [{ 
            model: User,
            as: 'Creator',
            attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
        }]
    })

    const sendNotification = await Notification.create({
        ownerId: post.Creator.id,
        type: 'post-repost',
        seen: false,
        holonAId: spaceId,
        userId: accountId,
        postId,
    })

    const sendEmail = await sgMail.send({
        to: post.Creator.email,
        from: 'admin@weco.io',
        subject: 'Weco - notification',
        text: `
            Hi ${post.Creator.name}, ${accountName} just reposted your post on weco:
            http://${config.appURL}/p/${postId}
        `,
        html: `
            <p>
                Hi ${post.Creator.name},
                <br/>
                <a href='${config.appURL}/u/${accountHandle}'>${accountName}</a>
                just reposted your
                <a href='${config.appURL}/p/${postId}'>post</a>
                on weco
            </p>
        `,
    })

    const createReactionsAndPostSpaceRelationships = await Holon.findAll({
        where: { id: selectedSpaceIds },
        attributes: ['id'],
        include: [{
            model: Holon,
            as: 'HolonHandles', // SpaceIds or SpaceDNA
            attributes: ['id'],
            through: { attributes: [] }
        }]
    }).then(spaces => {
        spaces.forEach((space) => {
            Reaction.create({
                type: 'repost',
                state: 'active',
                holonId: space.id,
                userId: accountId,
                postId: postId
            })
            PostHolon.create({
                type: 'repost',
                relationship: 'direct',
                creatorId: accountId,
                postId: postId,
                holonId: space.id
            })
            // loop through SpaceIds ('HolonHandles' for now) to create indirect post spaces ('PostSpaceRelationships' ?)
            space.HolonHandles.map(item => item.id).forEach(spaceId => {
                if (spaceId !== space.id) {
                    // todo: check for 'active' state when set up in db
                    PostHolon
                        .findOne({ where: { postId: postId, holonId: spaceId } })
                        .then(postHolon => {
                            if (!postHolon) {
                                PostHolon.create({
                                    type: 'repost',
                                    relationship: 'indirect',
                                    // state: 'active',
                                    creatorId: accountId,
                                    postId: postId,
                                    holonId: spaceId
                                })
                            }
                        })
                }
            })
        })
    })

    Promise
        .all([sendNotification, sendEmail, createReactionsAndPostSpaceRelationships])
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch(() => res.status(500).json({ message: 'Error' }))
})

router.post('/add-like', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { accountHandle, accountName, postId, holonId } = req.body

    const post = await Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [{ 
            model: User,
            as: 'Creator',
            attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
        }]
    })

    const createReaction = await Reaction.create({ 
        type: 'like',
        value: null,
        state: 'active',
        holonId,
        userId: accountId,
        postId,
        commentId: null,
    })

    const createNotification = await Notification.create({
        ownerId: post.Creator.id,
        type: 'post-like',
        seen: false,
        holonAId: holonId,
        userId: accountId,
        postId,
        commentId: null
    })

    const sendEmail = await sgMail.send({
        to: post.Creator.email,
        from: 'admin@weco.io',
        subject: 'Weco - notification',
        text: `
            Hi ${post.Creator.name}, ${accountName} just liked your post on weco:
            http://${config.appURL}/p/${postId}
        `,
        html: `
            <p>
                Hi ${post.Creator.name},
                <br/>
                <a href='${config.appURL}/u/${accountHandle}'>${accountName}</a>
                just liked your
                <a href='${config.appURL}/p/${postId}'>post</a>
                on weco
            </p>
        `,
    })

    Promise
        .all([createReaction, createNotification, sendEmail])
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch(() => res.status(500).json({ message: 'Error' }))
})

router.post('/remove-like', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { postId } = req.body
    Reaction
        .update({ state: 'removed' }, { where: { 
            type: 'like',
            state: 'active',
            postId,
            userId: accountId
        }})
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch(() => res.status(500).json({ message: 'Error' }))
})

router.post('/add-rating', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { accountHandle, accountName, postId, spaceId, newRating } = req.body

    const post = await Post.findOne({
        where: { id: postId },
        attributes: [],
        include: [{ 
            model: User,
            as: 'Creator',
            attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
        }]
    })

    const createReaction = await Reaction.create({ 
        type: 'rating',
        value: newRating,
        state: 'active',
        holonId: spaceId,
        userId: accountId,
        postId,
    })

    const sendNotification = await Notification.create({
        ownerId: post.Creator.id,
        type: 'post-rating',
        seen: false,
        holonAId: spaceId,
        userId: accountId,
        postId,
    })

    const sendEmail = await sgMail.send({
        to: post.Creator.email,
        from: 'admin@weco.io',
        subject: 'Weco - notification',
        text: `
            Hi ${post.Creator.name}, ${accountName} just rated your post on weco:
            http://${config.appURL}/p/${postId}
        `,
        html: `
            <p>
                Hi ${post.Creator.name},
                <br/>
                <a href='${config.appURL}/u/${accountHandle}'>${accountName}</a>
                just rated your
                <a href='${config.appURL}/p/${postId}'>post</a>
                on weco
            </p>
        `,
    })

    Promise
        .all([createReaction, sendNotification, sendEmail])
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch(() => res.status(500).json({ message: 'Error' }))
})

router.post('/remove-rating', authenticateToken, (req, res) => {
    const accountId = req.user.id
    const { postId, spaceId } = req.body
    Reaction
        .update({ state: 'removed' }, {
            where: { 
                type: 'rating',
                state: 'active',
                userId: accountId,
                postId
            }
        })
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch(() => res.status(500).json({ message: 'Error' }))
})

router.post('/add-link', authenticateToken, async (req, res) => {
    const accountId = req.user.id
    const { accountHandle, accountName, spaceId, description, itemAId, itemBId } = req.body

    const itemB = await Post.findOne({ where: { id: itemBId } })
    if (!itemB) res.status(404).send({ message: 'Item B not found' })
    else {
        const itemA = await Post.findOne({
            where: { id: itemAId },
            attributes: [],
            include: [{ 
                model: User,
                as: 'Creator',
                attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
            }]
        })

        const createLink = await Link.create({
            state: 'visible',
            creatorId: accountId,
            description,
            itemAId,
            itemBId
        })

        // todo: also send notification to itemB owner, and include itemB info in email
        const sendNotification = await Notification.create({
            ownerId: itemA.Creator.id,
            type: 'post-link',
            seen: false,
            holonAId: spaceId,
            userId: accountId,
            postId: itemAId,
        })

        const sendEmail = await sgMail.send({
            to: itemA.Creator.email,
            from: 'admin@weco.io',
            subject: 'Weco - notification',
            text: `
                Hi ${itemA.Creator.name}, ${accountName} just linked your post to another post on weco:
                http://${config.appURL}/p/${itemAId}
            `,
            html: `
                <p>
                    Hi ${itemA.Creator.name},
                    <br/>
                    <a href='${config.appURL}/u/${accountHandle}'>${accountName}</a>
                    just linked your
                    <a href='${config.appURL}/p/${itemAId}'>post</a>
                    to another post on weco
                </p>
            `,
        })
            
        Promise
            .all([createLink, sendNotification, sendEmail])
            .then((data) => res.status(200).json({ link: data[0], message: 'Success' }))
            .catch(() => res.status(500).json({ message: 'Error' }))
    }
})

router.post('/remove-link', authenticateToken, (req, res) => {
    const accountId = req.user.id
    let { linkId } = req.body
    Link.update({ state: 'hidden' }, { where: { id: linkId } })
        .then(() => res.status(200).json({ message: 'Success' }))
        .catch(() => res.status(500).json({ message: 'Error' }))
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
                as: 'Creator',
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
            as: 'Creator',
            attributes: ['id', 'handle', 'name', 'flagImagePath', 'email']
        }]
    })

    // find parent comment owner
    const parentComment = await Comment.findOne({
        where: { id: parentCommentId },
        attributes: [],
        include: [{ 
            model: User,
            as: 'Creator',
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

router.post('/save-glass-bead-game', (req, res) => {
    const {
        gameId,
        beads
    } = req.body

    console.log(req.body)

    // lock game
    GlassBeadGame
        .update({ locked: true }, { where: { id: gameId }})
        .then(() => {
            // save beads
            beads.forEach((bead) => {
                GlassBead.create({
                    gameId,
                    index: bead.index,
                    userId: bead.user.id,
                    beadUrl: bead.beadUrl,
                    // state: 'active'
                })
            })
            res.status(200).send({ message: 'Game saved' })
        })
})

router.post('/glass-bead-game-comment', (req, res) => {
    const { gameId, userId, text } = req.body
    GlassBeadGameComment.create({
        gameId,
        userId,
        text
    }).then(res.status(200).send({ message: 'Success' }))
})

router.post('/save-glass-bead-game-settings', (req, res) => {
    const {
        gameId,
        playerOrder,
        introDuration,
        numberOfTurns,
        moveDuration,
        intervalDuration,
    } = req.body

    console.log('playerOrder: ', playerOrder)
    GlassBeadGame
        .update({
            playerOrder,
            introDuration,
            numberOfTurns,
            moveDuration,
            intervalDuration,
        }, { where: { id: gameId }})
        .then(res.status(200).send({ message: 'Success' }))
        .catch(error => console.log(error))
})

router.post('/viable-post-spaces', (req, res) => {
    const { query, blacklist } = req.body
    Holon.findAll({
        limit: 20,
        where: {
            state: 'active',
            [Op.not]: [{ id: blacklist }],
            [Op.or]: [
                { handle: { [Op.like]: `%${query}%` } },
                { name: { [Op.like]: `%${query}%` } },
            ],
        },
        attributes: ['id', 'handle', 'name', 'flagImagePath'],
    })
    .then(spaces => res.send(spaces))
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

// old create post
// router.post('/create-post', authenticateToken, (req, res) => {
//     const accountId = req.user.id
//     const {
//         type,
//         subType,
//         state,
//         text,
//         url,
//         urlImage,
//         urlDomain,
//         urlTitle,
//         urlDescription,
//         topic,
//         spaceHandles,
//         // pollAnswers,
//         // numberOfPrismPlayers,
//         // prismDuration,
//         // prismPrivacy,
//         // numberOfPlotGraphAxes,
//         // axis1Left,
//         // axis1Right,
//         // axis2Top,
//         // axis2Bottom,
//         // // createPostFromTurnData,
//         // GBGTopic,
//         // GBGCustomTopic,
//     } = req.body

//     let directHandleIds = []
//     let indirectHandleIds = []

//     // todo: pull in from global constants
//     async function asyncForEach(array, callback) {
//         for (let index = 0; index < array.length; index++) {
//             await callback(array[index], index, array)
//         }
//     }

//     function findDirectHandleIds() {
//         Holon.findAll({
//             where: { handle: spaceHandles, state: 'active' },
//             attributes: ['id']
//         })
//         .then(holons => {
//             directHandleIds.push(...holons.map(holon => holon.id))
//         })
//     }

//     async function findIndirectHandleIds(handle) {
//         await Holon.findOne({
//             where: { handle: handle, state: 'active' },
//             include: [{
//                 model: Holon,
//                 as: 'HolonHandles',
//                 attributes: ['id'],
//                 through: { where: { state: 'open' }, attributes: [] }
//             }]
//         })
//         .then(holon => {
//             indirectHandleIds.push(...holon.HolonHandles.map(holon => holon.id))
//         })
//     }

//     async function findHandleIds() {
//         findDirectHandleIds()
//         await asyncForEach(spaceHandles, async(handle) => {
//             await findIndirectHandleIds(handle)
//         })
//         // remove duplicates from indirect handle ids
//         indirectHandleIds = [...new Set(indirectHandleIds)]
//         // remove ids already included in direct handle ids from indirect handle ids
//         indirectHandleIds = indirectHandleIds.filter(id => !directHandleIds.includes(id))
//     }

//     function createNewPostHolons(post) {
//         directHandleIds.forEach(id => {
//             PostHolon.create({
//                 type: 'post',
//                 relationship: 'direct',
//                 creatorId: accountId,
//                 postId: post.id,
//                 holonId: id
//             })
//         })
//         indirectHandleIds.forEach(id => {
//             PostHolon.create({
//                 type: 'post',
//                 relationship: 'indirect',
//                 creatorId: accountId,
//                 postId: post.id,
//                 holonId: id
//             })
//         })
//     }

//     // function createNewPollAnswers(post) {
//     //     pollAnswers.forEach(answer => PollAnswer.create({ text: answer, postId: post.id }))
//     // }

//     // function createPrism(post) {
//     //     Prism.create({
//     //         postId: post.id,
//     //         numberOfPlayers: numberOfPrismPlayers,
//     //         duration: prismDuration,
//     //         privacy: prismPrivacy
//     //     })
//     //     .then(prism => {
//     //         PrismUser.create({
//     //             prismId: prism.id,
//     //             userId: accountId
//     //         })
//     //     })
//     // }

//     // function createPlotGraph(post) {
//     //     PlotGraph.create({
//     //         postId: post.id,
//     //         numberOfPlotGraphAxes,
//     //         axis1Left,
//     //         axis1Right,
//     //         axis2Top,
//     //         axis2Bottom
//     //     })
//     // }

//     // function createTurnLink(post) {
//     //     Link.create({
//     //         state: 'visible',
//     //         creatorId: accountId,
//     //         type: 'post-post',
//     //         relationship: 'turn',
//     //         itemAId: createPostFromTurnData.postId,
//     //         itemBId: post.id
//     //     })
//     // }

//     function createGlassBeadGame(post) {
//         GlassBeadGame.create({
//             postId: post.id,
//             topic: topic,
//             // saved: false
//         })
//     }

//     // let renamedSubType
//     // if (subType === 'Single Choice') { renamedSubType = 'single-choice' }
//     // if (subType === 'Multiple Choice') { renamedSubType = 'multiple-choice' }
//     // if (subType === 'Weighted Choice') { renamedSubType = 'weighted-choice' }

//     // function createPost() {
//         Promise.all([findHandleIds()]).then(() => {
//             Post.create({
//                 type,
//                 subType,
//                 state,
//                 creatorId: accountId,
//                 text,
//                 url,
//                 urlImage,
//                 urlDomain,
//                 urlTitle,
//                 urlDescription,
//                 state: 'visible'
//             })
//             .then(post => {
//                 createNewPostHolons(post)
//                 // if (type === 'poll') createNewPollAnswers(post)
//                 // if (type === 'prism') createPrism(post)
//                 // if (type === 'plot-graph') createPlotGraph(post)
//                 if (type === 'glass-bead-game') createGlassBeadGame(post)
//                 // if (type === 'glass-bead' && createPostFromTurnData.postId) createTurnLink(post)
//             })
//             .then(res.send('success'))
//         })
//     // }

//     // createPost()
// })

// router.get('/post-link-data', async (req, res) => {
//     const { postId } = req.query
//     let outgoingLinks = await Link.findAll({
//         where: { state: 'visible', itemAId: postId },
//         attributes: ['id'],
//         include: [
//             { 
//                 model: User,
//                 as: 'creator',
//                 attributes: ['id', 'handle', 'name', 'flagImagePath'],
//             },
//             { 
//                 model: Post,
//                 as: 'postB',
//                 //attributes: ['handle', 'name', 'flagImagePath'],
//                 include: [
//                     { 
//                         model: User,
//                         as: 'creator',
//                         attributes: ['handle', 'name', 'flagImagePath'],
//                     }
//                 ]
//             },
//         ]
//     })

//     let incomingLinks = await Link.findAll({
//         where: { state: 'visible', itemBId: postId },
//         attributes: ['id'],
//         include: [
//             { 
//                 model: User,
//                 as: 'creator',
//                 attributes: ['id', 'handle', 'name', 'flagImagePath'],
//             },
//             { 
//                 model: Post,
//                 as: 'postA',
//                 //attributes: ['handle', 'name', 'flagImagePath'],
//                 include: [
//                     { 
//                         model: User,
//                         as: 'creator',
//                         attributes: ['handle', 'name', 'flagImagePath'],
//                     }
//                 ]
//             },
//         ]
//     })

//     let links = {
//         outgoingLinks,
//         incomingLinks
//     }
//     // .then(links => {
//     //     res.json(links)
//     // })
//     res.json(links)
// })

// router.get('/post-reaction-data', (req, res) => {
//     const { postId } = req.query
//     Post.findOne({ 
//         where: { id: postId },
//         attributes: [],
//         include: [
//             { 
//                 model: Reaction,
//                 where: { state: 'active' },
//                 attributes: ['id', 'type', 'value'],
//                 include: [
//                     {
//                         model: User,
//                         as: 'creator',
//                         attributes: ['handle', 'name', 'flagImagePath']
//                     },
//                     // TODO: potentially change Reaction includes based on reaction type to reduce unused data
//                     // (most wouldn't need holon data)
//                     {
//                         model: Holon,
//                         as: 'space',
//                         attributes: ['handle', 'name', 'flagImagePath']
//                     }
//                 ]
//             },
//             // {
//             //     model: Holon,
//             //     as: 'Reposts',
//             //     attributes: ['handle'],
//             //     through: { where: { type: 'repost', relationship: 'direct' }, attributes: ['creatorId'] },
//             // },
//         ]
//     })
//     .then(post => { res.json(post) })
//     .catch(err => console.log(err))
// })

// router.post('/cast-vote', (req, res) => {
//     const { selectedPollAnswers, postId, pollType } = req.body.voteData
//     selectedPollAnswers.forEach((answer) => {
//         let value = 1
//         if (pollType === 'weighted-choice') { value = answer.value / 100}
//         Reaction.create({ 
//             type: 'vote',
//             value: value,
//             postId: postId,
//             pollAnswerId: answer.id
//         })
//     })
// })