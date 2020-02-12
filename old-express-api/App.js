const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const Post = require('./models').Post
const Comment = require('./models').Comment
const Sequelize = require('sequelize')


// Database
// const db = require('./test/Database')

// Test DB
// db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log('Error: ' + err))

const app = express()

app.use(cors())

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

// Post.create({
//     title: 'Test'
// }).then(post => {
//     post.createComment({
//         text: 'Yooo'
//     }).then(() => console.log('Worked!'))
// })

// Posts.hasMany(Comments, { as: 'Comment'})
// Comments.belongsTo(Posts, { as: 'Post', foreignKey: 'post_id'})

// // serve static assets normally
// app.use(express.static(__dirname + '/public'))

// app.get('/', (req, res) => res.send('INDEX'))

// // Post routes
// app.use('/api/posts', require('./routes/Posts'))

// app.get('*', (req, res) => {
//     res.redirect('http://new.weco.io/')
//     // res.sendFile('http://new.weco.io/')
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
