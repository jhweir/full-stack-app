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

// Add post
router.post('/', (req, res) => {
    res.send('Post request made')
    const data = req.body.post
    let { title, description, creator, tags, comments, date, likes } = data;

    Posts.create({ title, description, creator, tags, comments, date, likes})
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

module.exports = router;