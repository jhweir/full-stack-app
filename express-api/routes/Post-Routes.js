const express = require('express')
const router = express.Router()

const Holons = require('../models').Holon
const HolonHolons = require('../models').HolonHolon
const HolonUsers = require('../models').HolonUser
const HolonPosts = require('../models').HolonPost
const Users = require('../models').User
const UserUsers = require('../models').UserUser
const Posts = require('../models').Post
const Comments = require('../models').Comment
const Labels = require('../models').Label
const Notifications = require('../models').Notification

//----------- Get data for holon context -----------------// 

router.get('/data', (req, res) => {

    // Global data:
    //// Get all holon names
    // Holons.findAll({ attributes: ['id', 'handle'] })
    //     .then(data => {
    //         res.json(data)
    //     })
    //     .catch(err => console.log(err))

    // Holon data:
    Holons.findOne({ 
        where: { 
            handle: req.query.id
        },
        include: [{
            model: Holons,
            as: 'child'
        }]
    }) // include: [{ model: Posts, include: [Holons] }]

        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))


    // const result = await models.Category.findAll({
    //     where: {
    //         parent: null
    //     },
    //     include: [{
    //         model: models.Category,
    //         as: 'children'
    //     }]
    //     });
    // res.send(result);
})









// Get all posts (include the holons they appear within)
// router.get('/', (req, res) => 
//     Posts.findAll({ include: [Holons] })
//         .then(posts => {
//             res.json(posts)
//             //res.sendStatus(200)
//         })
//         .catch(err => console.log(err))
// )

//--------------------- Get data for Wall Context ---------------------//

// Get global data
router.get('/globalData', (req, res) => {
    Holons.findAll({ attributes: ['id', 'handle'] })
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))
})

// Get holon data
router.get('/holonData', (req, res) => 
    Holons.findOne({ where: { handle: req.query.id }, include: [HolonHolons] }) // include: [{ model: Posts, include: [Holons] }]
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))
)

// Get holon content
router.get('/branchContent', (req, res) => 
    Tags.findOne({
        where: { 
            name: req.query.id  // 'root'
        },
        include: [Posts, Holons] // change holons to childbranches?
    })
        .then(data => {
            res.json(data)
            //res.sendStatus(200)
        })
        .catch(err => console.log(err))
)

// // Get holon holons
// router.get('/branchBranches', (req, res) => 
//     Tags.findOne({
//         where: { 
//             name: req.query.id
//         }, 
//         include: [Holons]
//     })
//         .then(data => {
//             res.json(data)
//             //res.sendStatus(200)
//         })
//         .catch(err => console.log(err))
// )

//--------------------- ---------------------//

// Create a new holon
router.post('/createBranch', (req, res) => {
    const { name, handle, description, parentBranchId, branchTags } = req.body.holon
    
    // Create new holon
    Holons.create({ name, handle, description })
        .then((holon) => {
            // Link parent holon(es) to new holon (TODO: set up for multiple parents)
            VerticalBranchRelationships.create({ parentBranchId: parentBranchId, childBranchId: holon.id })

            // Create a new tag for the holon
            Tags.create({ name: handle })
                // Create a new branchTag linking the holon to the tag
                .then((tag) => {
                    BranchTag.create({ 
                        branchId: holon.id, 
                        branchName: holon.name,
                        tagId: tag.id,
                        tagName: tag.name
                    })
                })
            
            // Copy the parent holon(es) tags into the new holon
            if (branchTags) {
                branchTags.forEach((tag) => {
                    BranchTag.create({ 
                        branchId: holon.id,
                        branchName: holon.name,
                        tagId: tag.id,
                        tagName: tag.name
                    })
                })
            }
        })
        .catch(err => console.log(err))

    // // Create new tag for holon
    // Tags.create({ name: handle })
    //     .then((tag) => {
    //         // Update the holon tag created for the holon above with the new tag ID
    //         BranchTag.update({ tagId: tag.id, tagName: tag.name }, { where: { branchName: name } })
    //         })
    //     .catch(err => console.log(err))
})


// Get a post (include its comments and holons)
router.get('/post', (req, res) => {
    Posts.findOne({ where: { id: req.query.id }, include: [Comments, Holons] })
        .then(post => {
            res.json(post)
        })
        .catch(err => console.log(err))
})

// Create a new post
router.post('/', (req, res) => {
    res.send('Post request made')
    let { user, title, description, holons, comments, pins, likes } = req.body.post
    // console.log('holons: ', holons)

    function createPostTag(post, tag) {
        PostTag.create({ postId: post.id, tagName: tag })
    }

    Posts.create({ user, title, description, comments, pins, likes })
        .then(post => {
            // console.log(post.id)
            holons.forEach((holon) => createPostTag(post, holon.name))
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



// Get all holons
router.get('/holons', (req, res) => {
    Holons.findAll()
    .then(holons => {
        res.json(holons)
        //res.sendStatus(200)
    })
})

module.exports = router