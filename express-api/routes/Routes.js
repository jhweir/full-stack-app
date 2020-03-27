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
            { model: Post, include: [Holon, Label] }
             // include: [{ model: Post, include: [Holon] }]
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

    // Find a holons tags and copy those tags to the new holon
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

    Post.create({ title, description }).then(post => {
        holonTags.forEach((holonTag) => createNewHolonTags(holonTag, post))
    })

    // holonTags.forEach((holonTag) => createNewHolonTags(holonTag, post))

    // // Find all the tagged holons tags
    // holonTags.forEach((holonTag) => Holon.findOne({ 
    //     where: { id: holonTag.id },
    //     include: [
    //         { model: Holon, as: 'TagOwner' },
    //     ]
    // }).then(data => {
    //     // Add each tag to the post
    //     data.TagOwner.forEach((holonTag) => PostHolon.create({
    //         creator: null, // to be set up when user tables ready
    //         relationship: 'post',
    //         state: 'visible',
    //         postId: post.id,
    //         holonId: holonTag.id,
    //     })
    // )}).catch(err => console.log(err)))


    // .then(post => {
    //     holonTags.forEach((holonTag) => PostHolon.create({
    //         creator: null, // to be set up when user tables ready
    //         relationship: 'post',
    //         state: 'visible',
    //         postId: post.id,
    //         holonId: holonTag.id,
    //     })
    // )})


    // console.log('holons: ', holons)

    // function createPostTag(post, tag) {
    //     PostTag.create({ postId: post.id, tagName: tag })
    // }

    // Post.create({ user, title, description, comments, pins, likes })
    //     .then(post => {
    //         // console.log(post.id)
    //         holons.forEach((holon) => createPostTag(post, holon.name))
    //     })
})

// Get a post (include its comments and holons)
router.get('/post', (req, res) => {
    Post.findOne({ 
        where: { id: req.query.id }, 
        include: [Comment, Holon] 
    }).then(post => {
        res.json(post)
    }).catch(err => console.log(err))
})

// Delete post
router.delete('/', (req, res) => {
    res.send('Delete request made')

    // Set post visibility to false
    Post.update({ visible: false }, {
        where: { id: req.body.id }
    })

    // Post.destroy({ where: { id: req.body.id }})
})

// Like post
router.put('/addLike', (req, res) => {
    Label.create({ 
        type: 'like',
        value: null,
        holonId: req.body.holonId,
        userId: null,
        postId: req.body.id,
        commentId: null,
    }).then(res.send('Post liked'))
})

// Pin post
router.put('/pinpost', (req, res) => {
    Post.update({ pins: 'Global wall' }, {
        where: { id: req.body.id }
    })
    res.send('Post pinned')
})

// Unpin post
router.put('/unpinpost', (req, res) => {
    Post.update({ pins: null }, {
        where: { id: req.body.id }
    })
    res.send('Post unpinned')
})

// Create comment
router.post('/addcomment', (req, res) => {
    res.send('Comment request made')
    let { postId, text, comments } = req.body

    // Create new comment in Comments table
    Comment.create({ postId, text })
        .catch(err => console.log(err))

    // Update number of comments on post in Post table
    Post.update({ comments: comments }, {
        where: { id: postId }
    })
})



// Get all holons
router.get('/holons', (req, res) => {
    Holon.findAll()
    .then(holons => {
        res.json(holons)
        //res.sendStatus(200)
    })
})

module.exports = router