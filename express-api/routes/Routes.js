const express = require('express')
const router = express.Router()
var sequelize = require('sequelize');
const Op = sequelize.Op;

const Holon = require('../models').Holon
const VerticalHolonRelationship = require('../models').VerticalHolonRelationship
const HolonHandle = require('../models').HolonHandle
// const HolonUser = require('../models').HolonUser
const PostHolon = require('../models').PostHolon
// const User = require('../models').User
// const UserUser = require('../models').UserUser
const Post = require('../models').Post
const Comment = require('../models').Comment
const Label = require('../models').Label
const PollAnswer = require('../models').PollAnswer
// const Notifications = require('../models').Notification

const postAttributes = [
    'id', 'type', 'globalState', 'creator', 'title', 'description', 'url', 'createdAt',
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Comments AS Comment WHERE Comment.postId = Post.id)`
        ),'total_comments'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type != "vote")`
        ),'total_reactions'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "like")`
        ),'total_likes'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "heart")`
        ),'total_hearts'
    ],
    [sequelize.literal(
        `(SELECT COUNT(*) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "rating")`
        ),'total_ratings'
    ],
    [sequelize.literal(
        `(SELECT SUM(value) FROM Labels AS Label WHERE Label.postId = Post.id AND Label.type = "rating")`
        ),'total_rating_points'
    ]
]

router.get('/global-data', (req, res) => {
    Holon.findAll({ attributes: ['handle'] })
    .then(handles => { return handles.map(h => h.handle) })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/holon-data', (req, res) => {
    Holon.findOne({ 
        where: { handle: req.query.handle },
        attributes: ['handle', 'name', 'description'],
        include: [
            { 
                model: Holon,
                as: 'DirectChildHolons',
                attributes: ['handle', 'name', 'description'],
                through: { attributes: [] }
            },
            {
                model: Holon,
                as: 'DirectParentHolons',
                attributes: ['handle', 'name', 'description'],
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
    // Double query required to to prevent results and pagination being effected by top level where clause.
    // Intial query used to find correct posts.
    // Second query used to return post data.
    // Final function used to replace PostHolons object with a simpler array.
    Post.findAll({ 
        where: { '$PostHolons.handle$': req.query.handle },
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
        return Post.findAll({ 
            where: { id: posts.map(post => post.id) },
            attributes: postAttributes,
            include: [
                {
                    model: Holon,
                    as: 'PostHolons',
                    attributes: ['handle'],
                    through: { attributes: [] },
                }
            ]
        })
        .then(posts => {
            posts.forEach(post => {
                const newPostHolons = post.PostHolons.map(ph => ph.handle)
                post.setDataValue("Post_Holons", newPostHolons)
                delete post.dataValues.PostHolons
            })
            return posts
        })
    })
    .then(data => { res.json(data) })
    .catch(err => console.log(err))
})

router.get('/post', (req, res) => {
    Post.findOne({ 
        where: { id: req.query.id },
        attributes: postAttributes,
        include: [
            { 
                model: Holon,
                as: 'PostHolons',
                attributes: ['handle'],
                through: { attributes: [] }
            },
            { 
                model: Comment,
                attributes: ['creator', 'text', 'createdAt']
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
                        `(SELECT SUM(value) FROM Labels AS Label WHERE Label.pollAnswerId = PollAnswers.id)`
                        ),'total_score'
                    ],
                ],
                // include: [
                //     { 
                //         model: Label,
                //         as: 'Votes',
                //         attributes: ['value', 'createdAt']
                //     }
                // ]
            }
        ]
    })
    .then(post => {
        // replace PostHolons array of objects with simpler Post_Holons array of strings
        const Post_Holons = post.PostHolons.map(ph => ph.handle)
        post.setDataValue("Post_Holons", Post_Holons)
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
    const { name, handle, description, parentHolonId } = req.body.holon
    Holon.create({ name, handle, description }).then((newHolon) => {
        // Attach new holon to parent holon(s)
        VerticalHolonRelationship.create({
            state: 'open',
            holonAId: parentHolonId,
            holonBId: newHolon.id,
        })
        // Create a unique tag for the holon
        HolonTag.create({
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
                HolonTag.create({
                    state: 'open',
                    holonAId: newHolon.id,
                    holonBId: tag.id,
                })
            })
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

// Create a new post
router.post('/create-post', (req, res) => {
    const { type, title, description, url, holonHandles, pollAnswers } = req.body.post
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
        type, title, description, url, globalState: 'visible'
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
    Label.create({ 
        type: 'like',
        value: null,
        holonId: req.body.holonId,
        userId: null,
        postId: req.body.id,
        commentId: null,
    }).then(res.send('Post successfully liked'))
})

// Add heart label
router.put('/addHeart', (req, res) => {
    Label.create({ 
        type: 'heart',
        value: null,
        holonId: req.body.holonId,
        userId: null,
        postId: req.body.id,
        commentId: null,
    }).then(res.send('Post successfully hearted'))
})

// Add rating label
router.put('/addRating', (req, res) => {
    Label.create({ 
        type: 'rating',
        value: req.body.newRating,
        holonId: req.body.holonId,
        userId: null,
        postId: req.body.id,
        commentId: null,
    }).then(res.send('Post successfully rated'))
})

// Create comment
router.post('/addComment', (req, res) => {
    let { postId, text } = req.body
    Comment.create({ postId, text })
        .catch(err => console.log(err))

    // // Update number of comments on post in Post table
    // Post.update({ comments: comments }, {
    //     where: { id: postId }
    // })
})

// Cast vote
router.post('/castVote', (req, res) => {
    const { selectedPollAnswers, postId } = req.body.voteData
    selectedPollAnswers.forEach((answer) => {
        Label.create({ 
            type: 'vote',
            value: 1,
            postId: postId,
            pollAnswerId: answer.id,
        })
    })
})



module.exports = router




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