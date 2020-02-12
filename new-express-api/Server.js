const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const Post = require('./models').Post;
const Comment = require('./models').Comment;

// Post.create({
//     title: 'Post title'
// }).then(post => {
//     post.createComment({
//         text: 'Comment text...'
//     }).then(() => console.log('Success!'))
// });

// Newpost.findAll({
//     include: [Comment]
// }).then(posts => {
//     console.log(posts[0].Comments)
// })

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('INDEX'))

// Post routes
app.use('/api/posts', require('./routes/Post-Routes'))

app.listen(5000, () => console.log('Listening on port 5000'))