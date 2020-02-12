const express = require('express');
const router = express.Router();
const Posts = require('../models').Post;
const Comments = require('../models').Comment;

// Get all posts
router.get('/', (req, res) => 
    Posts.findAll()
        .then(posts => {
            res.json(posts)
            //res.sendStatus(200)
        })
        .catch(err => console.log(err))
)

// Get a post
router.get('/post', (req, res) => {
    Posts.findOne({ where: { id: req.query.id }, include: [Comments] })
        .then(post => {
            res.json(post)
        })
        .catch(err => console.log(err))
})

// Add post
router.post('/', (req, res) => {
    res.send('Post request made')
    const data = req.body.post
    let { user, title, description, tags, comments, pins, likes } = data;

    Posts.create({ user, title, description, tags, comments, pins, likes })
        // .then(post => res.redirect('/posts'))
        // .catch(err => console.log(err))
})

// Delete post
router.delete('/', (req, res) => {
    res.send('Delete request made')

    Posts.destroy({ where: { id: req.body.id }})
})

// Like post
router.put('/', (req, res) => {
    Posts.update({ likes: req.body.newLikes }, {
        where: { id: req.body.id }
    })
    
    res.send('Post liked')
})

// Pin post
router.put('/pinpost', (req, res) => {
    Posts.update({ pins: 'Global wall' }, {
        where: { id: req.body.id }
    })
    res.send('Post pinned')
})

// Unpin post
router.put('/unpinpost', (req, res) => {
    Posts.update({ pins: null }, {
        where: { id: req.body.id }
    })
    res.send('Post unpinned')
})

// Create comment
router.post('/addcomment', (req, res) => {
    res.send('Comment request made')
    let { postId, text, comments } = req.body

    // Create new comment in Comments table
    Comments.create({ postId, text })
        .catch(err => console.log(err))

    // Update number of comments on post in Posts table
    Posts.update({ comments: comments }, {
        where: { id: postId }
    })
})

// Like post
router.put('/', (req, res) => {
    Posts.update({ likes: req.body.newLikes }, {
        where: { id: req.body.id }
    })
    
    res.send('Post liked')
})

module.exports = router;