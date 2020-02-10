const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Posts = require('./models/posts')
const Comments = require('./models/Comments')
// const path = require('path')

// Database
const db = require('./config/database.js');

// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

const app = express();

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Posts.hasMany(Comments, { as: 'Comment'})
// Comments.belongsTo(Posts, { as: 'Post', foreignKey: 'post_id'})

// // serve static assets normally
// app.use(express.static(__dirname + '/public'))

// // handle every other route with index.html, which will contain
// // a script tag to your application's JavaScript file(s).
// app.get('*', function (request, response){
//     response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
//   })

app.get('/', (req, res) => res.send('INDEX'));

// Post routes
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
