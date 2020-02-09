const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Posts = require('../models/posts')

// Get post list
router.get('/', (req, res) => 
    Posts.findAll()
        .then(posts => {
            //console.log(posts)
            res.json(posts)
            //res.sendStatus(200)
        })
        .catch(err => console.log(err))
);

// Add a post
router.post('/', (req, res) => {
    // console.log(req.body.post.title)
    res.send('Post request made')
    const data = req.body.post
    let { title, description, creator, tags, comments, date, likes } = data;
    // console.log('title: ', title);
    // console.log('description: ', description)

    // // Insert into table
    Posts.create({
        title, 
        description, 
        creator, 
        tags, 
        comments, 
        date,
        likes
    })
    //     // .then(post => res.redirect('/posts'))
    //     .catch(err => console.log(err))
});

// Like a post
router.put('/', (req, res) => {
    // const updatedLikes = req.body.post.likes + 1

    Posts.update({ likes: req.body.newLikes }, {
        where: {
            id: req.body.id
        }
    })
    
    res.send('Post liked')
})

// Posts.find({ where: { id: {} } })
//   .on('success', function (project) {
//     // Check if record exists in db
//     if (project) {
//       project.update({
//         title: 'a very different title now'
//       })
//       .success(function () {})
//     }
//   })

module.exports = router;