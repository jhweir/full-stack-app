const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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

// app.get('*', function (req, res) { // TODO: Needs testing, aiming to prevent direct url usage problems from SPA design.

//     Router.run(routes, req.path, function (Handler, state) {
//         var element = React.createElement(Handler);
//         var html = React.renderToString(element);
//         res.render('main', { content: html });
//     });
// });

app.get('/', (req, res) => res.send('INDEX'));

// Post routes
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
