const express = require('express')
const router = express.Router()
const Posts = require('../models').Post
const Branches = require('../models').Branch
const Branch_Post = require('../models').Branch_Post
const Comments = require('../models').Comment
const Tags = require('../models').Tag

// Get all posts (include the branches it appears within)
router.get('/', (req, res) => 
    Posts.findAll({ include: [Branches] })
        .then(posts => {
            res.json(posts)
            //res.sendStatus(200)
        })
        .catch(err => console.log(err))
)

// Get a post (include its comments)
router.get('/post', (req, res) => {
    Posts.findOne({ where: { id: req.query.id }, include: [Comments, Branches] })
        .then(post => {
            res.json(post)
        })
        .catch(err => console.log(err))
})

// Add post
router.post('/', (req, res) => {
    res.send('Post request made')
    const data = req.body.post
    let { user, title, description, branches, comments, pins, likes } = data

    function createBranchPost(branch, post) {
        Branch_Post.create({ branchId: branch.id, postId: post.id })
    }

    Posts.create({ user, title, description, comments, pins, likes })
        .then(post => {
            // console.log(post.id)
            branches.forEach((branch) => createBranchPost(branch, post))
        })
})

// Delete post
router.delete('/', (req, res) => {
    res.send('Delete request made')

    // Set post visibility to false
    Posts.update({ visible: false }, {
        where: { id: req.body.id }
    })

    // Posts.destroy({ where: { id: req.body.id }})
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

// Get all branch names
router.get('/all_branch_names', (req, res) => {
    Branches.findAll({ attributes: ['id', 'name'] })
    .then(branchNames => {
        res.json(branchNames)
        //res.sendStatus(200)
    })
})

// Get all branches
router.get('/branches', (req, res) => {
    Branches.findAll()
    .then(branches => {
        res.json(branches)
        //res.sendStatus(200)
    })
})

module.exports = router