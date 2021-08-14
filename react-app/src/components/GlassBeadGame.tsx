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

const Video = (props) => {
    const { peer, videoRef, mainUser, size, loop } = props
    const { accountData } = useContext(AccountContext)
    const ref = useRef<any>(null)
    useEffect(() => {
        if (!mainUser) {
            peer.peer.on('stream', (stream) => {
                if (ref && ref.current) ref.current.srcObject = stream
            })
        }
    }, [])
    return (
        <div className={`${styles.videoWrapper} ${size}`}>
            <video
                autoPlay
                playsInline
                muted={mainUser && !loop}
                ref={mainUser ? videoRef : ref}
                loop={loop}
            >
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
    const { postContextLoading, getPostData, postData } = useContext(PostContext)

    const [numberOfTurns, setNumberOfTurns] = useState<number | undefined>(6)
    const [turnDuration, setTurnDuration] = useState<number | undefined>(3)
    const [introDuration, setIntroDuration] = useState<number | undefined>(3)
    const [intervalDuration, setIntervalDuration] = useState<number | undefined>(3)
    const [numberOfPlayers, setNumberOfPlayers] = useState<number | undefined>(0)
    const [gameInProgress, setGameInProgress] = useState(false)
    const [turns, setTurns] = useState<any[]>([])

    const [peers, setPeers] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')

    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const userRef = useRef<any>({})
    const userVideo = useRef<any>(null)
    const peersRef = useRef<any[]>([])
    const secondsTimerRef = useRef<any>(null)
    const gameInProgressRef = useRef<boolean>(false)
    const mediaRecorderRef = useRef<any>(null)
    const chunksRef = useRef<any[]>([])

    const timerWidth = 400
    const arc = d3
        .arc()
        .innerRadius(timerWidth / 2 - 30)
        .outerRadius(timerWidth / 2)
        .cornerRadius(5)

    function createPeer(userToSignal, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        })
        peer.on('signal', (signal) => {
            const userSignaling = {
                socketId: socketRef.current.id,
                userData: userRef.current,
            }
            socketRef.current.emit('sending-signal', { userToSignal, userSignaling, signal }) // { userToSignal, callerID, signal })
        })
        return peer
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        peer.on('signal', (signal) => {
            socketRef.current.emit('returning-signal', { signal, callerID })
        })
        peer.signal(incomingSignal)
        return peer
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
                            userData: userRef.current,
                            audioPath: res.data,
                            turnNumber,
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
                setTurns((t) => [...t, number])
                if (number < data.numberOfTurns) {
                    // end turn
                    if (userIsActivePlayer) mediaRecorderRef.current.stop()
                    startInterval(number + 1, data)
                } else {
                    // end game
                    d3.select('#turn-text').text('')
                    d3.select('#player-text').text('')
                    setGameInProgress(false)
                    gameInProgressRef.current = false
                    const adminComment = {
                        userData: { name: 'admin' },
                        text: 'The game ended',
                    }
                    setComments((Comments) => [...Comments, adminComment])
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

    // connect video and peers
    useEffect(() => {
        if (!postContextLoading && postData.id) {
            if (socketRef.current) socketRef.current.disconnect()
            socketRef.current = io(config.apiWebSocketURL || '')
            roomIdRef.current = postData.id
            userRef.current = {
                id: accountData.id || uuidv4(),
                handle: accountData.handle,
                name: accountData.name || 'Anonymous',
                flagImagePath: accountData.flagImagePath,
            }

            navigator.mediaDevices
                .getUserMedia({ video: { width: 427, height: 240 }, audio: true })
                .then((stream) => {
                    if (userVideo && userVideo.current) userVideo.current.srcObject = stream

                    socketRef.current.emit('join-room', {
                        roomId: roomIdRef.current,
                        userData: userRef.current,
                    })

                    socketRef.current.on('users-in-room', (users) => {
                        const newPeers = [] as any[]
                        users.forEach((user) => {
                            const peer = createPeer(user.socketId, stream)
                            peersRef.current.push({
                                socketId: user.socketId,
                                peerData: user.userData,
                                peer,
                            })
                            newPeers.push(peer)
                        })
                        setPeers(newPeers)
                    })

                    socketRef.current.on('user-joined', (payload) => {
                        const { signal, userSignaling } = payload
                        const { socketId, userData } = userSignaling
                        // add new peer
                        const peer = addPeer(signal, userSignaling.socketId, stream)
                        peersRef.current.push({ socketId, peerData: userData, peer })
                        setPeers((users) => [...users, peer])
                        // add admin comment
                        const adminComment = {
                            userData: { name: 'admin' },
                            text: `${userData.name} joined the room!`,
                        }
                        setComments((Comments) => [...Comments, adminComment])
                    })

                    socketRef.current.on('receiving-returned-signal', (payload) => {
                        const item = peersRef.current.find((p) => p.socketId === payload.id)
                        item.peer.signal(payload.signal)
                    })

                    socketRef.current.on('user-left', (userId) => {
                        // add admin comment
                        const oldUser = peersRef.current.find((peer) => peer.socketId === userId)
                        const adminComment = {
                            userData: { name: 'admin' },
                            text: `${oldUser.peerData.name} left the room`,
                        }
                        setComments((Comments) => [...Comments, adminComment])
                        // update peers
                        peersRef.current = peersRef.current.filter(
                            (peer) => peer.socketId !== userId
                        )
                        setPeers((users) => [users.filter((user) => user.socketId !== userId)])
                    })

                    socketRef.current.on('returning-comment', (commentData) => {
                        setComments((Comments) => [...Comments, commentData])
                    })

                    socketRef.current.on('returning-start-game', (data) => {
                        const adminComment = {
                            userData: { name: 'admin' },
                            text: `${data.userData.name} started the game`,
                        }
                        setComments((Comments) => [...Comments, adminComment])
                        setGameInProgress(true)
                        gameInProgressRef.current = true
                        setTurns([])
                        startGame(data)
                    })

                    socketRef.current.on('returning-stop-game', (data) => {
                        const adminComment = {
                            userData: { name: 'admin' },
                            text: `${data.userData.name} stopped the game`,
                        }
                        setComments((Comments) => [...Comments, adminComment])
                        gameInProgressRef.current = false
                        setGameInProgress(false)
                        clearInterval(secondsTimerRef.current)
                        d3.select('#timer-path').remove()
                        d3.select('#timer-seconds').text(0)
                        d3.select('#turn-text').text('')
                        d3.select('#player-text').text('')
                        if (
                            mediaRecorderRef.current &&
                            mediaRecorderRef.current.state === 'recording'
                        )
                            mediaRecorderRef.current.stop()
                    })

                    socketRef.current.on('returning-audio-bead', (data) => {
                        d3.select(`#bead-${data.turnNumber}`)
                            .select('audio')
                            .attr('src', data.audioPath)
                        d3.select(`#bead-${data.turnNumber}`).select('p').text(data.userData.name)
                    })
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
                                    {comment &&
                                    comment.userData &&
                                    comment.userData.name &&
                                    comment.userData.name !== 'admin' ? (
                                        <>
                                            <SmallFlagImage
                                                type='user'
                                                size={40}
                                                imagePath={comment.userData.flagImagePath || null}
                                            />
                                            <div className={styles.commentText}>
                                                <p className={styles.userName}>
                                                    {comment.userData.name}
                                                </p>
                                                <p>{comment.text}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className={styles.adminText}>{comment.text}</p>
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
                            <div style={{ width: 150 }}>
                                <div
                                    className={`${styles.button} ${
                                        gameInProgress && styles.danger
                                    } mr-10`}
                                    role='button'
                                    tabIndex={0}
                                    onClick={signalStartGame}
                                    onKeyDown={signalStartGame}
                                >
                                    {gameInProgress ? 'Stop game' : 'Start game'}
                                </div>
                            </div>
                        </div>
                        {numberOfPlayers && numberOfPlayers > 0 ? (
                            <p className='mr-10'>Number of players: {numberOfPlayers}</p>
                        ) : null}
                    </div>
                    <img src='/icons/gbg/gift.png' alt='gift' className={styles.giftIcon} />
                    <div id='timer' />
                </div>
                <div className={`${styles.rightPanel} hide-scrollbars`}>
                    <div className={`${styles.videos} hide-scrollbars`}>
                        <Video videoRef={userVideo} mainUser size={findVideoSize()} />
                        {peersRef.current.map((peer) => {
                            return <Video key={peer.socketId} peer={peer} size={findVideoSize()} />
                        })}
                    </div>
                </div>
            </div>
            <div className={styles.turns}>
                {turns.map((turn, index) => (
                    <div key={turn} className={styles.turnWrapper}>
                        <div className={styles.turn} id={`bead-${turn}`}>
                            <p className={styles.turnText} />
                            <img
                                src='/icons/gbg/sound-wave.png'
                                alt='sound-wave'
                                className={styles.soundWaveIconSmall}
                            />
                            <audio controls>
                                <track kind='captions' />
                            </audio>
                        </div>
                        {turns.length > index + 1 && (
                            <div className={styles.turnDivider}>
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
