const express = require('express');
const router = express.Router();
// const db = require('../config/database');
const Posts = require('../models/posts')

// Get all posts
router.get('/', (req, res) => 
    Posts.findAll()
        .then(posts => {
            res.json(posts)
            //res.sendStatus(200)
        })
        .catch(err => console.log(err))
);

// Get a post
router.post('/getpost', (req, res) => {
    console.log(req.body.postId)
    // res.send('Get a post request made')
    // const data = req.body
    // console.log(data)
    Posts.findOne({ where: { id: req.body.postId }})
        .then(post => {
            res.json(post)
            // console.log(post)
        })
        .catch(err => console.log(err))
});

// Add post
router.post('/', (req, res) => {
    res.send('Post request made')
    const data = req.body.post
    let { title, description, creator, tags, comments, date, likes, pinned } = data;

    Posts.create({ title, description, creator, tags, comments, date, likes, pinned })
        // .then(post => res.redirect('/posts'))
        // .catch(err => console.log(err))
});

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
    Posts.update({ pinned: 'Global wall' }, {
        where: { id: req.body.id }
    })
    res.send('Post pinned')
})

// Unpin post
router.put('/unpinpost', (req, res) => {
    Posts.update({ pinned: null }, {
        where: { id: req.body.id }
    })
    res.send('Post unpinned')
})

module.exports = router;