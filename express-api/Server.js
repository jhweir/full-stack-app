require('dotenv').config()
const config = require('./Config')
const passport = require("passport")
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')
var morgan = require('morgan')
const express = require('express')
const app = express()
const axios = require('axios')

// set up cors with url whitelist
const cors = require('cors')
const whitelist = [config.appURL]
if (process.env.APP_ENV === 'prod') whitelist.push(config.appURL2)
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
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

// use express bodyparser middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// import routes
app.use('/', require('./routes/Auth'))
app.use('/', require('./routes/Account'))
app.use('/', require('./routes/Post'))
app.use('/', require('./routes/Space'))
app.use('/', require('./routes/User'))
app.use('/', require('./routes/Upload'))

const port = 5000
app.listen(port, () => console.log(`Listening on port ${port}`))

// set up websockets for glass bead games
const server = require('http').createServer()
const io = require('socket.io')(server, { cors: { origin: whitelist } })

const rooms = []
const socketsToRooms = []
const maxPlayers = 10

io.on('connection', socket => {
    socket.on('join-room', data => {
        const { roomId, userData } = data
        console.log(data)
        // create user object
        const user = { socketId: socket.id, userData }
        // if no room, create room
        if (!rooms[roomId]) rooms[roomId] = []
        // add user object to room
        rooms[roomId].push(user)
        // create socketToRoom record for use when user leaves room (is there a way to avoid this?)
        socketsToRooms[socket.id] = roomId
        // connect to room
        socket.join(roomId)
        // notify room of new user
        io.in(roomId).emit('user-joined', user)
        // send room data back to new user
        const usersInRoom = rooms[roomId] //.filter(users => users.socketId !== socket.id)
        socket.emit('room-joined', { socketId: socket.id, usersInRoom })
    })

    socket.on('sending-signal', payload => {
        io.to(payload.userToSignal).emit('signal-request', { signal: payload.signal, userSignaling: payload.userSignaling })
    })

    socket.on('returning-signal', payload => {
        io.to(payload.callerID).emit('signal-returned', { signal: payload.signal, id: socket.id })
    })

    socket.on('sending-comment', data => {
        io.in(data.roomId).emit('returning-comment', data)
    })

    socket.on('sending-start-game', data => {
        const { userSignaling, roomId, gameData } = data
        io.in(roomId).emit('returning-start-game', data)
        // todo: investigate why not wokring in production
        const comment = {
            gameId: gameData.gameId,
            text: `${userSignaling.name} started the game`
        }
        axios
            .post(`${config.apiUrl}/glass-bead-game-comment`, comment)
            .catch((error) => console.log('error: ', error))
    })

    socket.on('sending-stop-game', data => {
        const { userSignaling, roomId, gameId } = data
        io.in(roomId).emit('returning-stop-game', data)
        // todo: investigate why not working in production
        const comment = { gameId, text: `${userSignaling.name} stopped the game` }
        axios
            .post(`${config.apiUrl}/glass-bead-game-comment`, comment)
            .catch((error) => console.log('error: ', error))
    })

    socket.on('sending-audio-bead', data => {
        io.in(data.roomId).emit('returning-audio-bead', data)
    })

    socket.on('stream-disconnected', data => {
        io.in(data.roomId).emit('stream-disconnected', data)
    })

    socket.on('disconnecting', () => {
        console.log('socket.rooms', socket.rooms)
    })

    socket.on('disconnect', (data) => {
        console.log(data)
        const roomId = socketsToRooms[socket.id]
        if (rooms[roomId]) {
            const user = rooms[roomId].find(users => users.socketId === socket.id)
            io.in(roomId).emit('user-left', user)
            rooms[roomId] = rooms[roomId].filter(users => users.socketId !== socket.id)
        }
    })
})

server.listen(5001);
