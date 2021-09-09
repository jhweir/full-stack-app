/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import Peer from 'simple-peer'
import * as d3 from 'd3'
import { v4 as uuidv4 } from 'uuid'
import styles from '../styles/components/GlassBeadGame.module.scss'
import { PostContext } from '../contexts/PostContext'
import { AccountContext } from '../contexts/AccountContext'
import SmallFlagImage from './SmallFlagImage'
import config from '../Config'
import { isPlural } from '../Functions'

const Video = (props) => {
    const { peer, mainUser, size } = props
    const { accountData } = useContext(AccountContext)
    const id = mainUser ? 'main-user-video' : peer.socketId
    return (
        <div className={`${styles.videoWrapper} ${size}`}>
            <video autoPlay playsInline muted={mainUser} id={id}>
                <track kind='captions' />
            </video>
            <div className={styles.userData}>
                <SmallFlagImage
                    type='user'
                    size={30}
                    imagePath={mainUser ? accountData.flagImagePath : peer.peerData.flagImagePath}
                />
                <p>{mainUser ? 'You' : peer.peerData.name}</p>
            </div>
        </div>
    )
}

const GlassBeadGame = (): JSX.Element => {
    const { accountData } = useContext(AccountContext)
    const { postContextLoading, postData } = useContext(PostContext)

    const defaults = {
        numberOfTurns: 6,
        turnDuration: 5,
        introDuration: 5,
        intervalDuration: 5,
        numberOfPlayers: 0,
    }

    const [gameId, setGameId] = useState(0)
    const [locked, setLocked] = useState(false)
    const [topic, setTopic] = useState('')
    const [numberOfTurns, setNumberOfTurns] = useState(defaults.numberOfTurns)
    const [turnDuration, setTurnDuration] = useState(defaults.turnDuration)
    const [introDuration, setIntroDuration] = useState(defaults.introDuration)
    const [intervalDuration, setIntervalDuration] = useState(defaults.intervalDuration)
    const [numberOfPlayers, setNumberOfPlayers] = useState(defaults.numberOfPlayers)
    const [gameInProgress, setGameInProgress] = useState(false)
    const [showUserVideo, setShowUserVideo] = useState(false)

    const [beads, setBeads] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')

    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const socketIdRef = useRef('')
    const userRef = useRef<any>({})
    const usersRef = useRef<any>([])
    const peersRef = useRef<any[]>([])
    const videosRef = useRef<any[]>([])
    const secondsTimerRef = useRef<any>(null)
    const gameInProgressRef = useRef<boolean>(false)
    const mediaRecorderRef = useRef<any>(null)
    const chunksRef = useRef<any[]>([])
    const streamRef = useRef<any>(null)

    const timerWidth = 400
    const arc = d3
        .arc()
        .innerRadius(timerWidth / 2 - 30)
        .outerRadius(timerWidth / 2)
        .cornerRadius(5)

    function getGameData() {
        console.log('getGameData')
        axios.get(`${config.apiURL}/glass-bead-game-data?postId=${postData.id}`).then((res) => {
            console.log('res: ', res)
            setGameId(res.data.id)
            setLocked(res.data.locked)
            setTopic(res.data.topic)
            setNumberOfTurns(res.data.numberOfTurns || defaults.numberOfTurns)
            setTurnDuration(res.data.turnDuration || defaults.turnDuration)
            setIntroDuration(res.data.introDuration || defaults.introDuration)
            setIntervalDuration(res.data.intervalDuration || defaults.intervalDuration)
            setNumberOfPlayers(res.data.numberOfPlayers || defaults.numberOfPlayers)
            setComments(res.data.GlassBeadGameComments)
            setBeads(res.data.GlassBeads)
            res.data.GlassBeads.forEach((bead) => {
                d3.select(`#bead-${bead.index}`).select('audio').attr('src', bead.beadUrl)
                d3.select(`#bead-${bead.index}`)
                    .select('p')
                    .text(bead.User ? bead.User.name : 'Anonymous')
            })
        })
    }

    function connectMedia() {
        if (!showUserVideo) {
            navigator.mediaDevices
                .getUserMedia({ video: { width: 427, height: 240 }, audio: true })
                .then((stream) => {
                    setShowUserVideo(true)
                    const video = document.getElementById('main-user-video') as HTMLVideoElement
                    video.srcObject = stream
                    streamRef.current = stream
                    peersRef.current.forEach((p) => p.peer.addStream(stream))
                })
        }
    }

    function adminComment(text) {
        return {
            // userData: { name: 'admin' },
            admin: true,
            text,
        }
    }

    function findVideoSize() {
        const totalUsers = peersRef.current.length + 1
        let videoSize = styles.xl
        if (totalUsers > 2) videoSize = styles.lg
        if (totalUsers > 3) videoSize = styles.md
        if (totalUsers > 4) videoSize = styles.sm
        // if (totalUsers > 6) videoSize = styles.xs
        return videoSize
    }

    function signalComment() {
        if (newComment.length) {
            const commentData = {
                roomId: roomIdRef.current,
                gameId,
                userData: userRef.current,
                text: newComment,
            }
            socketRef.current.emit('sending-comment', commentData)
            setNewComment('')
        }
    }

    function signalStartGame() {
        if (gameInProgress) {
            const data = {
                roomId: roomIdRef.current,
                userData: userRef.current,
            }
            socketRef.current.emit('sending-stop-game', data)
        } else {
            const data = {
                roomId: roomIdRef.current,
                userData: userRef.current,
                numberOfTurns,
                turnDuration,
                introDuration,
                intervalDuration,
            }
            socketRef.current.emit('sending-start-game', data)
        }
    }

    function startTimerPath(duration, colour) {
        d3.selectAll('#timer-path').remove()
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'timer-path')
            .style('fill', colour)
            .attr('d', arc)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration * 1000)
            .attrTween('d', (d) => {
                const interpolate = d3.interpolate(d.endAngle, 0)
                return (t) => {
                    d.endAngle = interpolate(t)
                    return arc(d)
                }
            })
    }

    function startAudioRecording(turnNumber) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((audio) => {
            mediaRecorderRef.current = new MediaRecorder(audio)
            mediaRecorderRef.current.ondataavailable = (e) => {
                chunksRef.current.push(e.data)
            }
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' })
                const formData = new FormData()
                formData.append('file', blob)
                axios
                    .post(`${config.apiURL}/audio-upload`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then((res) => {
                        chunksRef.current = []
                        // send audio url to players
                        const data = {
                            roomId: roomIdRef.current,
                            // gameId,
                            userData: userRef.current,
                            beadUrl: res.data,
                            index: turnNumber,
                        }
                        socketRef.current.emit('sending-audio-bead', data)
                    })
            }
            mediaRecorderRef.current.start()
        })
    }

    function startGame(data) {
        setNumberOfTurns(data.numberOfTurns)
        setTurnDuration(data.turnDuration)
        setIntroDuration(data.introDuration)
        setIntervalDuration(data.intervalDuration)
        setNumberOfPlayers(data.players.length)
        const firstPlayer = data.players[0].userData
        const firstPlayerName = firstPlayer.id === userRef.current.id ? 'You' : firstPlayer.name
        data.loopNumber = 1
        // update canvas text
        d3.select('#turn-text').text('Intro')
        d3.select('#player-text').text(`Next player: ${firstPlayerName}`)
        d3.select('#timer-seconds').text(data.introDuration)
        // start timer
        startTimerPath(data.introDuration, '#1ee379')
        let timeLeft = data.introDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            d3.select('#timer-seconds').text(timeLeft)
            if (timeLeft === 0) {
                clearInterval(secondsTimerRef.current)
                startTurn(1, firstPlayer, data)
            }
        }, 1000)
    }

    function startTurn(number, player, data) {
        const userIsActivePlayer = player.id === userRef.current.id
        if (userIsActivePlayer) startAudioRecording(number)
        // update canvas text
        d3.select('#timer-seconds').text(data.turnDuration)
        d3.select('#turn-text').text(`Turn ${number}`)
        d3.select('#player-text').text(`Player: ${userIsActivePlayer ? 'You' : player.name}`)
        // start timer
        startTimerPath(data.turnDuration, '#4493ff')
        let timeLeft = data.turnDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            d3.select('#timer-seconds').text(timeLeft)
            if (timeLeft === 0) {
                clearInterval(secondsTimerRef.current)
                if (userIsActivePlayer) mediaRecorderRef.current.stop()
                if (number < data.numberOfTurns) {
                    // end turn
                    startInterval(number + 1, data)
                } else {
                    // end game
                    d3.select('#turn-text').text('')
                    d3.select('#player-text').text('')
                    setGameInProgress(false)
                    gameInProgressRef.current = false
                    setComments((Comments) => [...Comments, adminComment('The game ended')])
                }
            }
        }, 1000)
    }

    function startInterval(number, data) {
        // calculate next active player
        if (number > data.players.length * data.loopNumber) data.loopNumber += 1
        const turnsInPreviousLoops = (data.loopNumber - 1) * data.players.length
        const playerIndex = number - turnsInPreviousLoops - 1
        const nextActivePlayer = data.players[playerIndex].userData
        const userIsNextActivePlayer = nextActivePlayer.id === userRef.current.id
        const nextActivePlayerName = userIsNextActivePlayer ? 'You' : nextActivePlayer.name
        // update canvas text
        d3.select('#turn-text').text('Interval')
        d3.select('#player-text').text(`Next player: ${nextActivePlayerName}`)
        d3.select('#timer-seconds').text(data.intervalDuration)
        // start timer
        startTimerPath(data.intervalDuration, '#1ee379')
        let timeLeft = data.intervalDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            d3.select('#timer-seconds').text(timeLeft)
            if (timeLeft === 0) {
                clearInterval(secondsTimerRef.current)
                startTurn(number, nextActivePlayer, data)
            }
        }, 1000)
    }
    function saveGame() {
        const gameData = {
            gameId,
            numberOfTurns,
            turnDuration,
            introDuration,
            intervalDuration,
            numberOfPlayers,
            beads,
        }
        axios.post(`${config.apiURL}/save-glass-bead-game`, gameData).then((res) => {
            if (res.data === 'game-saved') setLocked(true)
        })
    }

    useEffect(() => {
        if (!postContextLoading && postData.id) {
            getGameData()
            // set roomIdRef and userRef
            roomIdRef.current = postData.id
            userRef.current = {
                id: accountData.id || uuidv4(),
                handle: accountData.handle,
                name: accountData.name || 'Anonymous',
                flagImagePath: accountData.flagImagePath,
            }
            // disconnect previous socket connections and create new connection to socket
            if (socketRef.current) socketRef.current.disconnect()
            socketRef.current = io(config.apiWebSocketURL || '')
            // join room
            socketRef.current.emit('join-room', {
                roomId: roomIdRef.current,
                userData: userRef.current,
            })
            // on room joined
            socketRef.current.on('room-joined', (payload) => {
                const { socketId, usersInRoom } = payload
                socketIdRef.current = socketId
                usersRef.current = usersInRoom
                usersInRoom.forEach((user) => {
                    if (user.socketId !== socketIdRef.current) {
                        const peer = new Peer({
                            initiator: true,
                            // trickle: false,
                        })
                        peer.on('signal', (data) => {
                            socketRef.current.emit('sending-signal', {
                                userToSignal: user.socketId,
                                userSignaling: {
                                    socketId: socketRef.current.id,
                                    userData: userRef.current,
                                },
                                signal: data,
                            })
                        })
                        peer.on('stream', (stream) => {
                            videosRef.current.push({
                                socketId: user.socketId,
                                peerData: user.userData,
                                peer,
                            })
                            setComments((c) => [
                                ...c,
                                adminComment(`${user.userData.name}'s video connected`),
                            ])
                            const video = document.getElementById(user.socketId) as HTMLVideoElement
                            video.srcObject = stream
                        })
                        peersRef.current.push({
                            socketId: user.socketId,
                            peerData: user.userData,
                            peer,
                        })
                    }
                })
                setComments((c) => [...c, adminComment('You joined the room')])
            })
            // on signal returned from peer
            socketRef.current.on('signal-returned', (payload) => {
                const peerObject = peersRef.current.find((p) => p.socketId === payload.id)
                peerObject.peer.signal(payload.signal)
            })
            // on signal request from peer
            socketRef.current.on('signal-request', (payload) => {
                const { signal, userSignaling } = payload
                const { socketId, userData } = userSignaling
                const existingPeer = peersRef.current.find((p) => p.socketId === socketId)
                if (existingPeer) {
                    existingPeer.peer.signal(signal)
                } else {
                    const peer = new Peer({
                        initiator: false,
                        // trickle: false,
                        stream: streamRef.current || null,
                    })
                    peer.on('signal', (data) => {
                        socketRef.current.emit('returning-signal', {
                            signal: data,
                            callerID: userSignaling.socketId,
                        })
                    })
                    peer.on('stream', (stream) => {
                        videosRef.current.push({ socketId, peerData: userData, peer })
                        setComments((c) => [
                            ...c,
                            adminComment(`${userData.name}'s video connected`),
                        ])
                        const video = document.getElementById(socketId) as HTMLVideoElement
                        video.srcObject = stream
                    })
                    peer.signal(signal)
                    peersRef.current.push({ socketId, peerData: userData, peer })
                }
            })
            // on user joined room
            socketRef.current.on('user-joined', (user) => {
                usersRef.current.push(user)
                setComments((c) => [...c, adminComment(`${user.userData.name} joined the room`)])
            })
            // on user left room
            socketRef.current.on('user-left', (user) => {
                const { socketId, userData } = user
                usersRef.current = usersRef.current.filter((u) => u.socketId !== socketId)
                peersRef.current = peersRef.current.filter((p) => p.socketId !== socketId)
                videosRef.current = videosRef.current.filter((v) => v.socketId !== socketId)
                setComments((c) => [...c, adminComment(`${userData.name} left the room`)])
            })
            // on comment recieved
            socketRef.current.on('returning-comment', (commentData) => {
                setComments((c) => [...c, commentData])
            })
            // on start game signal recieved
            socketRef.current.on('returning-start-game', (data) => {
                setComments((c) => [...c, adminComment(`${data.userData.name} started the game`)])
                setGameInProgress(true)
                gameInProgressRef.current = true
                setBeads([])
                startGame(data)
            })
            // on stop game signal recieved
            socketRef.current.on('returning-stop-game', (data) => {
                setComments((c) => [...c, adminComment(`${data.userData.name} stopped the game`)])
                gameInProgressRef.current = false
                setGameInProgress(false)
                clearInterval(secondsTimerRef.current)
                d3.select('#timer-path').remove()
                d3.select('#timer-seconds').text(0)
                d3.select('#turn-text').text('')
                d3.select('#player-text').text('')
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording')
                    mediaRecorderRef.current.stop()
            })
            // on audio bead recieved
            socketRef.current.on('returning-audio-bead', (data) => {
                setBeads((b) => [...b, data])
                d3.select(`#bead-${data.index}`).select('audio').attr('src', data.beadUrl)
                d3.select(`#bead-${data.index}`).select('p').text(data.userData.name)
            })
        }
        return () => (postContextLoading ? null : socketRef.current.disconnect())
    }, [postContextLoading, postData.id])

    useEffect(() => {
        // create svg
        d3.select('#timer')
            .append('svg')
            .attr('id', 'timer-svg')
            .attr('width', timerWidth)
            .attr('height', timerWidth)

        // create turn border
        const rectSize = 200
        d3.select('#timer-svg')
            .append('rect')
            .attr('width', rectSize)
            .attr('height', rectSize)
            .attr('fill', 'none')
            .attr('stroke', '#ddd')
            .attr('stroke-width', 2)
            .attr('rx', 10)
            .attr(
                'transform',
                `translate(${timerWidth / 2 - rectSize / 2},${timerWidth / 2 - rectSize / 2})`
            )

        // add turn image
        d3.select('#timer-svg')
            .append('svg:image')
            .attr('width', 100)
            .attr('height', 100)
            .attr('xlink:href', '/icons/gbg/sound-wave.png')
            .attr('transform', `translate(${timerWidth / 2 - 50},${timerWidth / 2 - 50})`)

        // create timer group
        d3.select('#timer-svg')
            .append('g')
            .attr('id', 'timer-group')
            .attr('transform', `translate(${400 / 2},${400 / 2})`)

        // create timer path background
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'timer-path-background')
            .style('fill', '#ddd')
            .attr('d', arc)

        // create timer seconds
        d3.select('#timer-svg')
            .append('text')
            .text(0)
            .attr('id', 'timer-seconds')
            .attr('font-size', 24)
            .attr('opacity', 0.5)
            .attr('text-anchor', 'middle')
            .attr('y', -120)
            .attr('x', 0)
            .attr('transform', `translate(${timerWidth / 2},${timerWidth / 2})`)

        // create turn text
        d3.select('#timer-svg')
            .append('text')
            .text('')
            .attr('id', 'turn-text')
            .attr('font-size', 22)
            .attr('opacity', 0.5)
            .attr('text-anchor', 'middle')
            .attr('y', -70)
            .attr('x', 0)
            .attr('transform', `translate(${timerWidth / 2},${timerWidth / 2})`)

        // create player text
        d3.select('#timer-svg')
            .append('text')
            .text('')
            .attr('id', 'player-text')
            .attr('font-size', 14)
            .attr('opacity', 0.5)
            .attr('text-anchor', 'middle')
            .attr('y', -45)
            .attr('x', 0)
            .attr('transform', `translate(${timerWidth / 2},${timerWidth / 2})`)
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={`${styles.leftPanel} hide-scrollbars`}>
                    <div className={`${styles.comments} hide-scrollbars`} id='comments'>
                        {comments.map(
                            (comment): JSX.Element => (
                                <div className={styles.commentWrapper} key={uuidv4()}>
                                    {comment.admin ? (
                                        <p className={styles.adminText}>{comment.text}</p>
                                    ) : (
                                        // todo: create user comment component
                                        <>
                                            <SmallFlagImage
                                                type='user'
                                                size={40}
                                                imagePath={
                                                    comment.userData
                                                        ? comment.userData.flagImagePath
                                                        : null
                                                }
                                            />
                                            <div className={styles.commentText}>
                                                <p className={styles.userName}>
                                                    {comment.userData
                                                        ? comment.userData.name
                                                        : 'Anonymous'}
                                                </p>
                                                <p>{comment.text}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                    <div className={styles.textInputWrapper}>
                        <input
                            className={styles.textInput}
                            placeholder='text...'
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') signalComment()
                            }}
                        />
                        <div
                            className={styles.button}
                            role='button'
                            tabIndex={0}
                            onClick={signalComment}
                            onKeyDown={signalComment}
                        >
                            Send
                        </div>
                    </div>
                </div>
                <div className={styles.centerPanel}>
                    <div className={styles.gameControls}>
                        <div>
                            <p className='mr-10'>Number of turns</p>
                            <input
                                type='number'
                                className={styles.numberInput}
                                value={numberOfTurns || undefined}
                                onChange={(e) => {
                                    setNumberOfTurns(+e.target.value)
                                }}
                            />
                            <p className='mr-10'>Turn duration</p>
                            <input
                                type='number'
                                className={styles.numberInput}
                                value={turnDuration || undefined}
                                onChange={(e) => {
                                    setTurnDuration(+e.target.value)
                                }}
                            />
                            <p className='mr-10'>Intro duration</p>
                            <input
                                type='number'
                                className={styles.numberInput}
                                value={introDuration || undefined}
                                onChange={(e) => {
                                    setIntroDuration(+e.target.value)
                                }}
                            />
                            <p className='mr-10'>Interval duration</p>
                            <input
                                type='number'
                                className={styles.numberInput}
                                value={intervalDuration || undefined}
                                onChange={(e) => {
                                    setIntervalDuration(+e.target.value)
                                }}
                            />
                        </div>
                        {numberOfPlayers > 0 && (
                            <p className='mr-10'>Number of players: {numberOfPlayers}</p>
                        )}
                        {locked ? (
                            <p>Game locked</p>
                        ) : (
                            <>
                                <div
                                    className={`${styles.button} ${
                                        gameInProgress && styles.danger
                                    }`}
                                    role='button'
                                    tabIndex={0}
                                    onClick={signalStartGame}
                                    onKeyDown={signalStartGame}
                                >
                                    {gameInProgress ? 'Stop game' : 'Start game'}
                                </div>
                                <div
                                    className={styles.button}
                                    role='button'
                                    tabIndex={0}
                                    onClick={saveGame}
                                    onKeyDown={saveGame}
                                >
                                    Save game
                                </div>
                            </>
                        )}
                    </div>
                    <p className={styles.topic}>Topic: {topic}</p>
                    {/* <img src='/icons/gbg/gift.png' alt='gift' className={styles.giftIcon} /> */}
                    <div id='timer' />
                </div>
                <div className={`${styles.rightPanel} hide-scrollbars`}>
                    <div className={`${styles.users} hide-scrollbars`}>
                        <div
                            className={`${styles.button} ${
                                streamRef.current && styles.danger
                            } mr-10`}
                            role='button'
                            tabIndex={0}
                            onClick={connectMedia}
                            onKeyDown={connectMedia}
                        >
                            Connect video and audio
                        </div>
                        <p>
                            {usersRef.current.length}{' '}
                            {isPlural(usersRef.current.length) ? 'people' : 'person'} in room
                        </p>
                        {usersRef.current.map((user) => (
                            <div className={styles.user} key={user.socketId}>
                                <SmallFlagImage
                                    type='user'
                                    size={40}
                                    imagePath={user.userData.flagImagePath || null}
                                />
                                <p>{user.userData.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.videos} hide-scrollbars`}>
                        {showUserVideo && <Video mainUser size={findVideoSize()} />}
                        {videosRef.current.map((peer) => {
                            return <Video key={peer.socketId} peer={peer} size={findVideoSize()} />
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.beads}>
                {beads.map((bead, index) => (
                    <div key={bead.index} className={styles.beadWrapper}>
                        <div className={styles.bead} id={`bead-${bead.index}`}>
                            <p className={styles.beadText}>Test</p>
                            <img
                                src='/icons/gbg/sound-wave.png'
                                alt='sound-wave'
                                className={styles.soundWaveIconSmall}
                            />
                            <audio controls>
                                <track kind='captions' />
                            </audio>
                        </div>
                        {beads.length > index + 1 && (
                            <div className={styles.beadDivider}>
                                <div className={styles.dividerLine} />
                                <img
                                    src='/icons/gbg/infinity.png'
                                    alt='infinity'
                                    className={styles.dividerConnector}
                                />
                                <div className={styles.dividerLine} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GlassBeadGame
