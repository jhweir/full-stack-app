const express = require('express')
const router = express.Router()
const Posts = require('../models').Post
const Branches = require('../models').Branch
const VerticalBranchRelationships = require('../models').VerticalBranchRelationship
const Comments = require('../models').Comment
const Tags = require('../models').Tag
const BranchTag = require('../models').BranchTag
const PostTag = require('../models').PostTag

// Get all posts (include the branches they appear within)
// router.get('/', (req, res) => 
//     Posts.findAll({ include: [Branches] })
//         .then(posts => {
//             res.json(posts)
//             //res.sendStatus(200)
//         })
//         .catch(err => console.log(err))
// )

//--------------------- Get data for Wall Context ---------------------//

// Get global data
router.get('/globalData', (req, res) => {
    Branches.findAll({ attributes: ['id', 'handle'] })
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))
})

// Get branch data
router.get('/branchData', (req, res) => 
    Branches.findOne({ where: { handle: req.query.id }, include: [Tags, VerticalBranchRelationships] }) // include: [{ model: Posts, include: [Branches] }]
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))
)

// Get branch content
router.get('/branchContent', (req, res) => 
    Tags.findOne({
        where: { 
            name: req.query.id  // 'root'
        },
        include: [Posts, Branches] // change branches to childbranches?
    })
        .then(data => {
            res.json(data)
            //res.sendStatus(200)
        })
        .catch(err => console.log(err))
)

// // Get branch branches
// router.get('/branchBranches', (req, res) => 
//     Tags.findOne({
//         where: { 
//             name: req.query.id
//         }, 
//         include: [Branches]
//     })
//         .then(data => {
//             res.json(data)
//             //res.sendStatus(200)
//         })
//         .catch(err => console.log(err))
// )

//--------------------- ---------------------//

// Create a new branch
router.post('/createBranch', (req, res) => {
    const { name, handle, description, parentBranchId, branchTags } = req.body.branch
    
    // Create new branch
    Branches.create({ name, handle, description })
        .then((branch) => {
            // Link parent branch(es) to new branch (TODO: set up for multiple parents)
            VerticalBranchRelationships.create({ parentBranchId: parentBranchId, childBranchId: branch.id })

            // Create a new tag for the branch
            Tags.create({ name: handle })
                // Create a new branchTag linking the branch to the tag
                .then((tag) => {
                    BranchTag.create({ 
                        branchId: branch.id, 
                        branchName: branch.name,
                        tagId: tag.id,
                        tagName: tag.name
                    })
                })
            
            // Copy the parent branch(es) tags into the new branch
            if (branchTags) {
                branchTags.forEach((tag) => {
                    BranchTag.create({ 
                        branchId: branch.id,
                        branchName: branch.name,
                        tagId: tag.id,
                        tagName: tag.name
                    })
                })
            }
        })
        .catch(err => console.log(err))

    // // Create new tag for branch
    // Tags.create({ name: handle })
    //     .then((tag) => {
    //         // Update the branch tag created for the branch above with the new tag ID
    //         BranchTag.update({ tagId: tag.id, tagName: tag.name }, { where: { branchName: name } })
    //         })
    //     .catch(err => console.log(err))
})


// Get a post (include its comments and branches)
router.get('/post', (req, res) => {
    Posts.findOne({ where: { id: req.query.id }, include: [Comments, Branches] })
        .then(post => {
            res.json(post)
        })
        .catch(err => console.log(err))
})

// Create a new post
router.post('/', (req, res) => {
    res.send('Post request made')
    let { user, title, description, branches, comments, pins, likes } = req.body.post
    // console.log('branches: ', branches)

    function createPostTag(post, tag) {
        PostTag.create({ postId: post.id, tagName: tag })
    }

    Posts.create({ user, title, description, comments, pins, likes })
        .then(post => {
            // console.log(post.id)
            branches.forEach((branch) => createPostTag(post, branch.name))
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



// Get all branches
router.get('/branches', (req, res) => {
    Branches.findAll()
    .then(branches => {
        res.json(branches)
        //res.sendStatus(200)
    })
})

module.exports = router