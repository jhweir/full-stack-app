require('dotenv').config()
const config = require('./Config')
const passport = require("passport")
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')
var morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// set up cors with url whitelist
const cors = require('cors')
const whitelist = [config.appURL]
if (process.env.APP_ENV === 'prod') whitelist.push(config.appURL2)
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))
// enable pre-flight requests
app.options('*', cors())

// set up morgan access logs with unique ids
morgan.token('id', function getId(req) { return req.id })
function assignId(req, res, next) { req.id = uuidv4(); next() }
app.use(assignId)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
const settings = ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
app.use(morgan(settings, { stream: accessLogStream }))

// use bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// import routes
app.use('/', require('./routes/Auth'))
app.use('/', require('./routes/Account'))
app.use('/', require('./routes/Post'))
app.use('/', require('./routes/Space'))
app.use('/', require('./routes/User'))
app.use('/', require('./routes/Upload'))

const port = 5000
app.listen(port, () => console.log(`Listening on port ${port}`))

app.get('/', (req, res) => res.send('INDEX'))

// set up websocket for live connections
const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});
io.on('connection', socket => {
    console.log(socket.id)

    socket.on('join-room', (room, callback) => {
        socket.join(room)
        callback(`joined room: ${room}`)
    })

    socket.on('send-message', (message, room) => {
        console.log('room: ', room)
        socket.to(room).emit('relay-message', message)
    })

    // client.on('disconnect', () => { /* … */ });
});
server.listen(5001);
