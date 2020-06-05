const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('INDEX'))

// Post routes
app.use('/api', require('./routes/Routes'))

app.listen(5000, () => console.log('Listening on port 5000'))