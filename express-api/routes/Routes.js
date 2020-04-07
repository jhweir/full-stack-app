const express = require('express')
const router = express.Router()

const Holon = require('../models').Holon
const VerticalHolonRelationship = require('../models').VerticalHolonRelationship
const HolonTag = require('../models').HolonTag
const HolonUser = require('../models').HolonUser
const PostHolon = require('../models').PostHolon
const User = require('../models').User
const UserUser = require('../models').UserUser
const Post = require('../models').Post
const Comment = require('../models').Comment
const Label = require('../models').Label
const Notifications = require('../models').Notification

// Get data for holon context
//// 1. Get holon data
router.get('/getHolonData', (req, res) => {
    Holon.findOne({ 
        where: { handle: req.query.id },
        include: [
            { model: Holon, as: 'DirectChildHolons' },
            { model: Holon, as: 'DirectParentHolons' },
            { model: Holon, as: 'TagOwner' },
            { model: Post, include: [Holon, Label, Comment] }
        ]
    }).then(data => {
            res.json(data)
    }).catch(err => console.log(err))
})
//// 2. Get global data
router.get('/getGlobalData', (req, res) => {
    //// Get all holon names
    Holon.findAll({ 
        attributes: ['id', 'handle'] 
    }).then(data => {
        res.json(data)
    }).catch(err => console.log(err))
})

// Create a new holon
router.post('/createHolon', (req, res) => {
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
            include: [
                { model: Holon, as: 'TagOwner' }
            ]
        }).then(data => {
        //// 2. Add them to the new holon
            data.TagOwner.forEach((tag) => {
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
router.post('/createPost', (req, res) => {
    res.send('Post request made')
    const { title, description, holonTags } = req.body.post

    console.log('holonTags: ', holonTags)

    // Find the holons tags
    function createNewHolonTags(tag, post) {
        Holon.findOne({ 
            where: { id: tag.id },
            include: [
                { model: Holon, as: 'TagOwner' },
            ]
        }).then((data) => {
            // Add each tag to the post
            data.TagOwner.forEach((holon) => PostHolon.create({
                creator: null, // to be set up when user tables ready
                relationship: 'post',
                state: 'visible',
                postId: post.id,
                holonId: holon.id,
            })
        )}).catch(err => console.log(err))
    }

    // Create the post and all its holon tags
    Post.create({ title, description, globalState: 'visible' }).then(post => {
        holonTags.forEach((holonTag) => createNewHolonTags(holonTag, post))
    })
})

// Get a post (include its comments, holons, and lables)
router.get('/getPost', (req, res) => {
    Post.findOne({ 
        where: { id: req.query.id },
        include: [Holon, Label, Comment] 
        // include: [Comment, Holon, Label]
    }).then(post => {
        //console.log('post from routes: ', post)
        res.json(post)
    }).catch(err => console.log(err))
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

// Create comment
router.post('/addComment', (req, res) => {
    res.send('Comment request made')
    let { postId, newComment } = req.body
    let text = newComment
    // Create new comment in Comments table
    Comment.create({ postId, text })
        .catch(err => console.log(err))

    // // Update number of comments on post in Post table
    // Post.update({ comments: comments }, {
    //     where: { id: postId }
    // })
})



// // Get all holons
// router.get('/holons', (req, res) => {
//     Holon.findAll()
//     .then(holons => {
//         res.json(holons)
//         //res.sendStatus(200)
//     })
// })

module.exports = router