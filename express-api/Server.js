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

// set up websockets for glass bead games
const server = require('http').createServer()
const io = require('socket.io')(server, { cors: { origin: whitelist } })

const rooms = []
const socketsToRooms = []
const maxPlayers = 10

io.on('connection', socket => {
    socket.on('join-room', data => {
        const { roomId, userData } = data
        const user = { socketId: socket.id, userData }
        socket.join(roomId)
        if (!rooms[roomId]) {
            rooms[roomId] = [user]
            socketsToRooms[socket.id] = roomId
        } else {
            if (rooms[roomId].length === maxPlayers) socket.emit('room-full')
            else {
                rooms[roomId].push(user)
                const usersInRoom = rooms[roomId].filter(users => users.socketId !== socket.id)
                socket.emit('users-in-room', usersInRoom)
                socketsToRooms[socket.id] = roomId
            }
        }
    })

    socket.on('sending-signal', payload => {
        io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, userSignaling: payload.userSignaling })
    })

    socket.on('returning-signal', payload => {
        io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id })
    })

    socket.on('sending-comment', commentData => {
        io.in(commentData.roomId).emit('returning-comment', commentData)
    })

    socket.on('sending-start-game', data => {
        io.in(data.roomId).emit('returning-start-game', data)
    })

    socket.on('sending-stop-game', data => {
        io.in(data.roomId).emit('returning-stop-game', data)
    })

    socket.on('disconnect', () => {
        const roomId = socketsToRooms[socket.id]
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(users => users.socketId !== socket.id)
            io.in(roomId).emit('user-left', socket.id)
        }
    })
})

server.listen(5001);
