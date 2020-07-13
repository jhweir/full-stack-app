require("dotenv").config()
const express = require('express')
const router = express.Router()
var sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const holonuser = require("../models/holonuser")
// const jwt = require('jsonwebtoken')
// const passport = require("passport")
// const passportJWT = require('passport-jwt')
// const JwtStrategy = passportJWT.Strategy
// const ExtractJwt = passportJWT.ExtractJwt

// const Op = sequelize.Op;

const Holon = require('../models').Holon
const VerticalHolonRelationship = require('../models').VerticalHolonRelationship
const HolonHandle = require('../models').HolonHandle
const HolonUser = require('../models').HolonUser
const PostHolon = require('../models').PostHolon
const User = require('../models').User
// const UserUser = require('../models').UserUser
const Post = require('../models').Post
const Comment = require('../models').Comment
const Label = require('../models').Label
const PollAnswer = require('../models').PollAnswer
// const Notifications = require('../models').Notification

const postAttributes = [
    'id', 'type', 'subType', 'globalState', 'title', 'description', 'url', 'createdAt',
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.postId = Post.id)`
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

router.get('/global-data', (req, res) => {
    Holon
        .findAll({ attributes: ['handle'] })
        .then(handles => res.json(handles.map(h => h.handle)))
        .catch(err => console.log(err))
})

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
    const { handle, userId } = req.query
    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts.
    // Second query used to return post data.
    // Final function used to replace PostHolons object with an array.
    Post.findAll({ 
        where: { '$PostHolons.handle$': handle },
        attributes: ['id'],
        include: [{ 
            model: Holon,
            as: 'PostHolons',
            attributes: [],
            through: { attributes: [] }
        }],
        // limit: 3,
        // offset: 1,
        subQuery: false
    })
    .then(posts => {
        // Add account reaction data to post attributes
        let attributes = [
            ...postAttributes,
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${userId}
                AND Label.type = 'like'
                AND Label.state = 'active'
                )`),'account_like'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${userId}
                AND Label.type = 'heart'
                AND Label.state = 'active'
                )`),'account_heart'
            ],
            [sequelize.literal(`(
                SELECT COUNT(*)
                FROM Labels
                AS Label
                WHERE Label.postId = Post.id
                AND Label.userId = ${userId}
                AND Label.type = 'rating'
                AND Label.state = 'active'
                )`),'account_rating'
            ]
        ]
        return Post.findAll({ 
            where: { id: posts.map(post => post.id) },
            attributes: attributes,
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
                    attributes: ['name', 'flagImagePath'],
                }
            ]
        })
        .then(posts => {
            posts.forEach(post => {
                // replace PostHolons object with an array
                const newPostHolons = post.PostHolons.map(ph => ph.handle)
                post.setDataValue("spaces", newPostHolons)
                delete post.dataValues.PostHolons
                // check if user has reacted to post and list reactions in 'accountReactions' array
                // console.log('req.query.userId', req.query.userId)
                // Label
                //     .findAll({ 
                //         where: { postId: post.id, userId: req.query.userId },
                //         attributes: ['type']
                //     })
                //     .then(labels => console.log('labels', labels))
            })
            return posts
        })
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/holon-followers', (req, res) => {
    const { holonId } = req.query
    User.findAll({ 
        where: { '$FollowedHolons.id$': holonId },
        //attributes: ['id'],
        include: [{ 
            model: Holon,
            as: 'FollowedHolons',
            attributes: [],
            through: { where: { relationship: 'follower', state: 'active' }, attributes: [] }
        }],
    })
    .then(data => { res.json(data) })
})

router.get('/all-users', (req, res) => {
    User.findAll({})
    .then(data => { res.json(data) })
})

router.get('/user-data', (req, res) => {
    User.findOne({ 
        where: { name: req.query.userName },
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

router.get('/created-posts', (req, res) => {
    const { accountId, userId } = req.query
    // Add account reaction data to post attributes
    let attributes = [
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
    Post.findAll({ 
        where: { creatorId: userId },
        attributes: attributes,
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['name', 'flagImagePath']
            }
        ]
    })
    .then(posts => { res.json(posts) })
    .catch(err => console.log(err))
})


router.get('/post', (req, res) => {
    const { userId } = req.query
    let attributes = [...postAttributes,
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = ${userId} AND Label.type = 'like' AND Label.state = 'active')`
            ),'account_like'
        ],
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = ${userId} AND Label.type = 'heart' AND Label.state = 'active')`
            ),'account_heart'
        ],
        [sequelize.literal(
            `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.userId = ${userId} AND Label.type = 'rating' AND Label.state = 'active')`
            ),'account_rating'
        ]
    ]
    Post.findOne({ 
        where: { id: req.query.id },
        attributes: attributes,
        include: [
            { 
                model: User,
                as: 'creator',
                attributes: ['name', 'flagImagePath']
            },
            { 
                model: Holon,
                as: 'PostHolons',
                attributes: ['handle'],
                through: { attributes: [] }
            },
            { 
                model: Comment,
                attributes: ['creatorId', 'text', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: 'commentCreator',
                        attributes: ['name', 'flagImagePath']
                    }
                ]
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
        // replace PostHolons array of objects with simpler Post_Holons array of strings
        const spaces = post.PostHolons.map(ph => ph.handle)
        post.setDataValue("spaces", spaces)
        delete post.dataValues.PostHolons
        // replace raw createdAt dates in PollAnswer.Labels with parsed number strings
        // post.PollAnswers.forEach(answer => answer.Votes.forEach(label => {
        //     label.setDataValue("parsedCreatedAt", Date.parse(label.createdAt))
        //     delete label.dataValues.createdAt
        // }))
        return post
    })
    .then(post => { res.json(post) })
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

// Create a new holon
router.post('/create-holon', (req, res) => {
    const { handle, name, description, parentHolonId } = req.body

    Holon.findOne({ where: { handle: handle }})
        .then(holon => {
            if (holon) { res.send('holon-handle-taken') }
            else { createHolon() }
        })

    function createHolon() { 
        Holon.create({ name, handle, description }).then((newHolon) => {
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

// Create a new post
router.post('/create-post', (req, res) => {
    const { type, subType, creatorId, title, description, url, holonHandles, pollAnswers } = req.body.post
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
        type, subType, creatorId, title, description, url, globalState: 'visible'
    })
    .then(post => {
        createNewPostHolons(post)
        createNewPollAnswers(post)
    })
    .then(res.send('Post successfully created'))
})

// Delete post
router.delete('/deletePost', (req, res) => {
    //console.log(req.body.id)
    Post.update({ globalState: 'hidden' }, {
        where: { id: req.body.id }
    })
    // Post.destroy({ where: { id: req.body.id }})
})

// Add like label
router.put('/addLike', (req, res) => {
    const { postId, userId, holonId } = req.body
    Label.create({ 
        type: 'like',
        value: null,
        state: 'active',
        holonId,
        userId,
        postId,
        commentId: null,
    }).then(res.send('Post successfully liked'))
})

// Remove like label
router.put('/removeLike', (req, res) => {
    const { postId, userId } = req.body
    Label.update({ state: 'removed' }, {
        where: { type: 'like', state: 'active', postId, userId }
    })
})

// Add heart label
router.put('/addHeart', (req, res) => {
    const { postId, userId, holonId } = req.body
    Label.create({ 
        type: 'heart',
        value: null,
        state: 'active',
        holonId,
        userId,
        postId,
        commentId: null,
    }).then(res.send('Post successfully hearted'))
})

// Remove heart label
router.put('/removeHeart', (req, res) => {
    const { postId, userId } = req.body
    Label.update({ state: 'removed' }, {
        where: { type: 'heart', state: 'active', postId, userId }
    })
})

// Add rating label
router.put('/addRating', (req, res) => {
    const { postId, userId, holonId, newRating } = req.body
    Label.create({ 
        type: 'rating',
        value: newRating,
        state: 'active',
        holonId,
        userId,
        postId,
        commentId: null,
    }).then(res.send('Post successfully rated'))
})

// Remove rating label
router.put('/updateRating', (req, res) => {
    const { postId, userId, holonId, newRating } = req.body
    Label.update({ state: 'removed' }, { where: { type: 'rating', state: 'active', postId, userId } })
    .then(() => {
        Label.create({ 
            type: 'rating',
            value: newRating,
            state: 'active',
            holonId,
            userId,
            postId,
            commentId: null,
        })
    }).then(res.send('Post successfully rated'))
})

// Create comment
router.post('/add-comment', (req, res) => {
    let { creatorId, postId, text } = req.body
    Comment.create({ creatorId, postId, text })
        .catch(err => console.log(err))

    // // Update number of comments on post in Post table
    // Post.update({ comments: comments }, {
    //     where: { id: postId }
    // })
})

// Cast vote
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

// Register account
router.post('/register', async (req, res) => {
    const { newUserName, newEmail, newPassword } = req.body

    // Check username and email is available
    User
        .findOne({ where: { name: newUserName } })
        .then(user => {
            if (user) { res.send('username-taken') }
            else { User.findOne({ where: { email: newEmail } })
                .then(async user => {
                    if (user) { res.send('email-taken') }
                    else {
                        try {
                            const hashedPassword = await bcrypt.hash(newPassword, 10)
                            User.create({
                                name: newUserName,
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

// Follow space
router.post('/followHolon', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser.create({ relationship: 'follower', state: 'active', holonId, userId })
})

// Unfollow space
router.put('/unfollowHolon', (req, res) => {
    const { holonId, userId } = req.body
    HolonUser.update({ state: 'removed' }, { where: { relationship: 'follower', holonId, userId }})
})





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
    //         'globalState',
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