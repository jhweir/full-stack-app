/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import Peer from 'simple-peer'
import * as d3 from 'd3'
import { v4 as uuidv4 } from 'uuid'
import styles from '@styles/components/GlassBeadGame.module.scss'
import { PostContext } from '@contexts/PostContext'
import { AccountContext } from '@contexts/AccountContext'
import SmallFlagImage from '@components/SmallFlagImage'
import config from '@src/Config'
import {
    isPlural,
    timeSinceCreated,
    dateCreated,
    notNull,
    allValid,
    defaultErrorState,
} from '@src/Functions'
import GlassBeadGameTopics from '@src/GlassBeadGameTopics'
import Modal from '@components/Modal'
import Input from '@components/Input'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'
import Row from '@components/Row'
import Column from '@components/Column'
import { ReactComponent as AudioIconSVG } from '@svgs/microphone-solid.svg'
import { ReactComponent as AudioSlashIconSVG } from '@svgs/microphone-slash-solid.svg'
import { ReactComponent as VideoIconSVG } from '@svgs/video-solid.svg'
import { ReactComponent as VideoSlashIconSVG } from '@svgs/video-slash-solid.svg'
import { ReactComponent as ChevronUpIconSVG } from '@svgs/chevron-up-solid.svg'
import { ReactComponent as ChevronDownIconSVG } from '@svgs/chevron-down-solid.svg'
import { ReactComponent as DNAIconSVG } from '@svgs/dna.svg'
import { ReactComponent as LockIconSVG } from '@svgs/lock-solid.svg'
import { ReactComponent as PlayIconSVG } from '@svgs/play-solid.svg'
import { ReactComponent as PauseIconSVG } from '@svgs/pause-solid.svg'

const gameDefaults = {
    gameId: null,
    topic: null,
    locked: true,
    introDuration: 30,
    numberOfTurns: 3,
    moveDuration: 60,
    intervalDuration: 0,
}

const colors = {
    red: '#ef0037',
    orange: '#f59c27',
    yellow: '#daf930',
    green: '#00e697',
    aqua: '#00b1a9',
    blue: '#4f8af7',
    purple: '#a65cda',
    grey1: '#e9e9ea',
    grey2: '#d7d7d9',
    grey3: '#c6c6c7',
}

const Video = (props) => {
    const {
        id,
        user,
        size,
        audioEnabled,
        videoEnabled,
        toggleAudio,
        toggleVideo,
        audioOnly,
    } = props
    return (
        <div className={`${styles.videoWrapper} ${size}`}>
            {audioOnly && <AudioIconSVG />}
            <video id={id} muted={id === 'your-video'} autoPlay playsInline>
                <track kind='captions' />
            </video>
            <div className={styles.videoUser}>
                <ImageTitle
                    type='user'
                    imagePath={user.flagImagePath}
                    title={id === 'your-video' ? 'You' : user.name}
                />
            </div>
            {id === 'your-video' && (
                <div className={styles.videoButtons}>
                    <button type='button' onClick={toggleAudio}>
                        {audioEnabled ? <AudioIconSVG /> : <AudioSlashIconSVG />}
                    </button>
                    {!audioOnly && (
                        <button type='button' onClick={toggleVideo}>
                            {videoEnabled ? <VideoIconSVG /> : <VideoSlashIconSVG />}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

const Comment = (props) => {
    const { comment } = props
    const { user, text, createdAt } = comment
    if (user)
        return (
            <div className={styles.userComment}>
                <SmallFlagImage type='user' size={40} imagePath={user.flagImagePath} />
                <div className={styles.commentText}>
                    <Row>
                        <h1>{user.name}</h1>
                        <p title={dateCreated(createdAt)}>{timeSinceCreated(createdAt)}</p>
                    </Row>
                    <p>{text}</p>
                </div>
            </div>
        )
    return (
        <div className={styles.adminComment}>
            <p>{text}</p>
        </div>
    )
}

const GameSettingsModal = (props) => {
    const { close, gameData, socketId, players, setPlayers, signalStartGame } = props

    const [formData, setFormData] = useState({
        introDuration: {
            value: notNull(gameData.introDuration) || gameDefaults.introDuration,
            validate: (v) => (v < 10 || v > 60 ? ['Must be between 10 and 60 seconds'] : []),
            ...defaultErrorState,
        },
        numberOfTurns: {
            value: notNull(gameData.numberOfTurns) || gameDefaults.numberOfTurns,
            validate: (v) => (v < 1 || v > 20 ? ['Must be between 1 and 20 turns'] : []),
            ...defaultErrorState,
        },
        moveDuration: {
            value: notNull(gameData.moveDuration) || gameDefaults.moveDuration,
            validate: (v) => (v < 10 || v > 600 ? ['Must be between 10 seconds and 10 mins'] : []),
            ...defaultErrorState,
        },
        intervalDuration: {
            value: notNull(gameData.intervalDuration) || gameDefaults.intervalDuration,
            validate: (v) => (v > 60 ? ['Must be 60 seconds or less'] : []),
            ...defaultErrorState,
        },
    })
    const { introDuration, numberOfTurns, moveDuration, intervalDuration } = formData
    const [playersError, setPlayersError] = useState('')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    function updateValue(name, value) {
        setFormData({ ...formData, [name]: { ...formData[name], value, state: 'default' } })
    }

    function updatePlayerPosition(from, to) {
        const newPlayers = [...players]
        const player = newPlayers[from]
        newPlayers.splice(from, 1)
        newPlayers.splice(to, 0, player)
        setPlayers(newPlayers)
    }

    function saveSettings(e) {
        e.preventDefault()
        setPlayersError(players.length ? '' : 'At least one player must connect their audio/video')
        if (allValid(formData, setFormData) && players.length) {
            setLoading(true)
            const dbData = {
                gameId: gameData.gameId,
                numberOfTurns: numberOfTurns.value,
                moveDuration: moveDuration.value,
                introDuration: introDuration.value,
                intervalDuration: intervalDuration.value,
                playerOrder: players.map((p) => p.id).join(','),
            }
            axios
                .post(`${config.apiURL}/save-glass-bead-game-settings`, dbData)
                .then(() => {
                    setLoading(false)
                    setSaved(true)
                    signalStartGame({
                        ...gameData,
                        numberOfTurns: numberOfTurns.value,
                        moveDuration: moveDuration.value,
                        introDuration: introDuration.value,
                        intervalDuration: intervalDuration.value,
                        players,
                    })
                    close()
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <Modal close={close} centered>
            <h1>Game settings</h1>
            <p>Players must connect their audio/video to participate in the game</p>
            <form onSubmit={saveSettings}>
                <Row margin='10px 0 30px 0'>
                    <Column margin='0 60px 0 0'>
                        <Input
                            title='Intro duration (seconds)'
                            type='text'
                            margin='0 0 10px 0'
                            disabled={loading || saved}
                            state={introDuration.state}
                            errors={introDuration.errors}
                            value={introDuration.value}
                            onChange={(v) => updateValue('introDuration', +v.replace(/\D/g, ''))}
                        />
                        <Input
                            title='Number of turns'
                            type='text'
                            margin='0 0 10px 0'
                            disabled={loading || saved}
                            state={numberOfTurns.state}
                            errors={numberOfTurns.errors}
                            value={numberOfTurns.value}
                            onChange={(v) => updateValue('numberOfTurns', +v.replace(/\D/g, ''))}
                        />
                        <Input
                            title='Move duration (seconds)'
                            type='text'
                            margin='0 0 10px 0'
                            disabled={loading || saved}
                            state={moveDuration.state}
                            errors={moveDuration.errors}
                            value={moveDuration.value}
                            onChange={(v) => updateValue('moveDuration', +v.replace(/\D/g, ''))}
                        />
                        <Input
                            title='Interval duration (seconds)'
                            type='text'
                            margin='0 0 10px 0'
                            disabled={loading || saved}
                            state={intervalDuration.state}
                            errors={intervalDuration.errors}
                            value={intervalDuration.value}
                            onChange={(v) => updateValue('intervalDuration', +v.replace(/\D/g, ''))}
                        />
                    </Column>
                    <Column width={250}>
                        <h2 style={{ margin: 0 }}>Player order</h2>
                        {players.map((player, i) => (
                            <Row margin='10px 0 0 0'>
                                <div className={styles.position}>{i + 1}</div>
                                <div className={styles.positionControls}>
                                    {i > 0 && (
                                        <button
                                            type='button'
                                            onClick={() => updatePlayerPosition(i, i - 1)}
                                        >
                                            <ChevronUpIconSVG />
                                        </button>
                                    )}
                                    {i < players.length - 1 && (
                                        <button
                                            type='button'
                                            onClick={() => updatePlayerPosition(i, i + 1)}
                                        >
                                            <ChevronDownIconSVG />
                                        </button>
                                    )}
                                </div>
                                <ImageTitle
                                    type='user'
                                    imagePath={player.flagImagePath}
                                    title={player.socketId === socketId ? 'You' : player.name}
                                    fontSize={16}
                                    imageSize={35}
                                />
                            </Row>
                        ))}
                        {!players.length && <p className={styles.grey}>No users connected...</p>}
                        {!!playersError.length && <p className={styles.red}>{playersError}</p>}
                    </Column>
                </Row>
                <Row>
                    {!saved && (
                        <Button
                            text='Start game'
                            colour='blue'
                            size='medium'
                            disabled={loading || saved}
                            submit
                        />
                    )}
                    {loading && <LoadingWheel />}
                    {saved && <SuccessMessage text='Saved' />}
                </Row>
            </form>
        </Modal>
    )
}

const GlassBeadGame = (): JSX.Element => {
    // todo: clean up user objects in usersRef, flatten data if possible
    const {
        loggedIn,
        accountData,
        accountDataLoading,
        setAlertModalOpen,
        setAlertMessage,
    } = useContext(AccountContext)
    const { postData } = useContext(PostContext)

    const [gameData, setGameData] = useState<any>(gameDefaults)
    const [gameInProgress, setGameInProgress] = useState(false)
    const [userIsStreaming, setUserIsStreaming] = useState(false)
    const [players, setPlayers] = useState<any[]>([])
    const [gameSettingsModalOpen, setGameSettingsModalOpen] = useState(false)
    const [beads, setBeads] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [showComments, setShowComments] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [audioTrackEnabled, setAudioTrackEnabled] = useState(false)
    const [videoTrackEnabled, setVideoTrackEnabled] = useState(false)
    const [audioOnly, setAudioOnly] = useState(false)
    const [turn, setTurn] = useState(0)
    const [move, setMove] = useState(0)
    const [seconds, setSeconds] = useState<number | null>(null)
    const [moveState, setMoveState] = useState<'Intro' | 'Move' | 'Interval'>('Move')
    const [loadingStream, setLoadingStream] = useState(false)
    // const [videoRenderKey, setVideoRenderKey] = useState(0)

    // state refs (used to...)
    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const socketIdRef = useRef('')
    const userRef = useRef<any>({})
    const usersRef = useRef<any>([])
    const peersRef = useRef<any[]>([])
    const videosRef = useRef<any[]>([])
    const secondsTimerRef = useRef<any>(null)
    const mediaRecorderRef = useRef<any>(null)
    const chunksRef = useRef<any[]>([])
    const streamRef = useRef<any>(null)
    const videoRef = useRef<any>(null)
    const commentsRef = useRef<HTMLDivElement>(null)

    const highMetalTone = new Audio('/audio/hi-metal-tone.mp3')
    const lowMetalTone = new Audio('/audio/lo-metal-tone.mp3')
    const arcWidth = 20
    const gameArcRadius = 210
    const turnArcRadius = 180
    const moveArcRadius = 150
    const arcs = {
        gameArc: d3
            .arc()
            .innerRadius(gameArcRadius - arcWidth)
            .outerRadius(gameArcRadius)
            .cornerRadius(5),
        turnArc: d3
            .arc()
            .innerRadius(turnArcRadius - arcWidth)
            .outerRadius(turnArcRadius)
            .cornerRadius(5),
        moveArc: d3
            .arc()
            .innerRadius(moveArcRadius - arcWidth)
            .outerRadius(moveArcRadius)
            .cornerRadius(5),
    }
    const iceConfig = {
        // iceTransportPolicy: 'relay',
        iceServers: [
            // { urls: 'stun:stun.l.google.com:19302' },
            // { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            // {
            //     urls: 'turn:relay.backups.cz?transport=tcp',
            //     credential: 'webrtc',
            //     username: 'webrtc',
            // },
            { urls: `stun:${config.turnServerUrl}` },
            {
                urls: `turn:${config.turnServerUrl}`,
                username: config.turnServerUsername,
                credential: config.turnServerPassword,
            },
        ],
    }
    // todo: potentially remove and use players instead
    const totalUsersStreaming = videosRef.current.length + (userIsStreaming ? 1 : 0)
    const isYou = (id) => id === socketIdRef.current

    function scrollToLatestComment() {
        const { current } = commentsRef
        if (current) current.scrollTop = current.scrollHeight
    }

    function getGameData() {
        axios.get(`${config.apiURL}/glass-bead-game-data?postId=${postData.id}`).then((res) => {
            setGameData({
                gameId: res.data.id,
                topic: res.data.topic,
                locked: res.data.locked,
                numberOfTurns: res.data.numberOfTurns,
                moveDuration: res.data.moveDuration,
                introDuration: res.data.introDuration,
                intervalDuration: res.data.intervalDuration,
            })
            setComments(res.data.GlassBeadGameComments)
            scrollToLatestComment()
            setBeads(res.data.GlassBeads)
            res.data.GlassBeads.forEach((bead) => {
                d3.select(`#bead-${bead.index}`).select('audio').attr('src', bead.beadUrl)
            })
            // todo: callback or embed in main useEffect?
        })
    }

    function toggleStream() {
        if (!loggedIn) {
            setAlertModalOpen(true)
            setAlertMessage('Log in to connect audio/video')
        } else if (userIsStreaming) {
            // close stream
            videoRef.current.pause()
            videoRef.current.srcObject = null
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
            setUserIsStreaming(false)
            setAudioTrackEnabled(false)
            setVideoTrackEnabled(false)
            const data = {
                roomId: roomIdRef.current,
                socketId: socketIdRef.current,
                userData: userRef.current,
            }
            socketRef.current.emit('stream-disconnected', data)
        } else {
            // set up and signal stream
            setLoadingStream(true)
            navigator.mediaDevices
                .getUserMedia({ video: { width: 427, height: 240 }, audio: true })
                .then((stream) => {
                    setUserIsStreaming(true)
                    setAudioOnly(false)
                    streamRef.current = stream
                    streamRef.current.getTracks().forEach((track) => (track.enabled = false))
                    peersRef.current.forEach((p) => p.peer.addStream(stream))
                    videoRef.current = document.getElementById('your-video')
                    videoRef.current.srcObject = stream
                    const newPlayer = {
                        id: accountData.id,
                        name: accountData.name,
                        flagImagePath: accountData.flagImagePath,
                        socketId: socketIdRef.current,
                    }
                    setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                    setLoadingStream(false)
                })
                .catch(() => {
                    console.log('Unable to connect video, trying audio only...')
                    navigator.mediaDevices
                        .getUserMedia({ audio: true })
                        .then((stream) => {
                            setUserIsStreaming(true)
                            setAudioOnly(true)
                            streamRef.current = stream
                            streamRef.current
                                .getTracks()
                                .forEach((track) => (track.enabled = false))
                            peersRef.current.forEach((p) => p.peer.addStream(stream))
                            videoRef.current = document.getElementById('your-video')
                            videoRef.current.srcObject = stream
                            const newPlayer = {
                                id: accountData.id,
                                name: accountData.name,
                                flagImagePath: accountData.flagImagePath,
                                socketId: socketIdRef.current,
                            }
                            setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                            setLoadingStream(false)
                        })
                        .catch(() => {
                            setAlertMessage('Unable to connect media devices')
                            setAlertModalOpen(true)
                            setLoadingStream(false)
                        })
                })
        }
    }

    function toggleAudioTrack() {
        const audioTrack = streamRef.current.getTracks()[0]
        audioTrack.enabled = !audioTrackEnabled
        setAudioTrackEnabled(!audioTrackEnabled)
    }

    function toggleVideoTrack() {
        const videoTrack = streamRef.current.getTracks()[1]
        videoTrack.enabled = !videoTrackEnabled
        setVideoTrackEnabled(!videoTrackEnabled)
    }

    function findVideoSize() {
        let videoSize = styles.xl
        if (totalUsersStreaming > 2) videoSize = styles.lg
        if (totalUsersStreaming > 3) videoSize = styles.md
        if (totalUsersStreaming > 4) videoSize = styles.sm
        return videoSize
    }

    function createComment(e) {
        e.preventDefault()
        if (gameData.locked) {
            setAlertModalOpen(true)
            setAlertMessage('Game locked')
        } else if (!loggedIn) {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create comments')
        } else if (newComment.length) {
            const data = {
                gameId: gameData.gameId,
                userId: accountData.id,
                text: newComment,
            }
            axios
                .post(`${config.apiURL}/glass-bead-game-comment`, data)
                .then(() => {
                    const signalData = {
                        roomId: roomIdRef.current,
                        user: userRef.current,
                        text: newComment,
                        createdAt: new Date(),
                    }
                    socketRef.current.emit('sending-comment', signalData)
                    setNewComment('')
                })
                .catch((error) => console.log(error))
        }
    }

    function pushComment(comment) {
        setComments((c) => [...c, comment.user ? comment : { text: comment }])
        scrollToLatestComment()
    }

    function startArc(type: 'game' | 'turn' | 'move', duration: number, color?: string) {
        d3.select(`#${type}-arc`).remove()
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', `${type}-arc`)
            .style('fill', color)
            .style('opacity', 0.8)
            .attr('d', arcs[`${type}Arc`])
            .transition()
            .ease(d3.easeLinear)
            .duration(duration * 1000)
            .attrTween('d', (d) => {
                const interpolate = d3.interpolate(d.endAngle, 0)
                return (t) => {
                    d.endAngle = interpolate(t)
                    return arcs[`${type}Arc`](d)
                }
            })
    }

    function startAudioRecording(moveNumber: number) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((audio) => {
            mediaRecorderRef.current = new MediaRecorder(audio)
            mediaRecorderRef.current.ondataavailable = (e) => {
                chunksRef.current.push(e.data)
            }
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mpeg-3' }) // audio/webm;codecs=opus' })
                const formData = new FormData()
                formData.append('file', blob)
                const options = { headers: { 'Content-Type': 'multipart/form-data' } }
                axios
                    .post(`${config.apiURL}/audio-upload`, formData, options)
                    .then((res) => {
                        chunksRef.current = []
                        const signalData = {
                            roomId: roomIdRef.current,
                            user: userRef.current,
                            beadUrl: res.data,
                            index: moveNumber,
                        }
                        socketRef.current.emit('sending-audio-bead', signalData)
                    })
                    .catch((error) => {
                        const { message } = error.response.data
                        switch (message) {
                            case 'File size too large':
                                // todo: give user option to save bead locally before deleting (edge-case)
                                chunksRef.current = []
                                setAlertMessage(`Error uploading audio. ${message}`)
                                setAlertModalOpen(true)
                                break
                            default:
                                chunksRef.current = []
                                setAlertMessage(`Unknown error uploading audio`)
                                setAlertModalOpen(true)
                                break
                        }
                    })
            }
            mediaRecorderRef.current.start()
        })
    }

    function signalStartGame(data) {
        // todo: remove beads in db if previously saved
        const signalData = {
            roomId: roomIdRef.current,
            userSignaling: userRef.current,
            gameData: data,
        }
        socketRef.current.emit('sending-start-game', signalData)
    }

    function startGame(data) {
        setGameData(data)
        setPlayers(data.players)
        setMoveState('Intro')
        setSeconds(data.introDuration)
        const firstPlayer = data.players[0]
        d3.select(`#player-${firstPlayer.socketId}`).text('(up next)')
        startArc('move', data.introDuration, colors.yellow)
        let timeLeft = data.introDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            setSeconds(timeLeft)
            if (timeLeft < 1) {
                clearInterval(secondsTimerRef.current)
                startMove(1, 0, firstPlayer, data)
            }
        }, 1000)
    }

    function startMove(moveNumber, turnNumber, player, data) {
        const { numberOfTurns, moveDuration, intervalDuration } = data
        // if your move, start audio recording
        if (isYou(player.socketId)) startAudioRecording(moveNumber)
        // calculate turn and game duration
        const turnDuration = data.players.length * (moveDuration + intervalDuration)
        const gameDuration = turnDuration * numberOfTurns - intervalDuration
        // if first move, start game arc
        if (moveNumber === 1) startArc('game', gameDuration, colors.blue)
        // if new turn, start turn arc
        const newTurnNumber = Math.ceil(moveNumber / data.players.length)
        if (turnNumber !== newTurnNumber) {
            setTurn(newTurnNumber)
            startArc(
                'turn',
                // if final turn, remove interval duration from turn duration
                newTurnNumber === numberOfTurns ? turnDuration - intervalDuration : turnDuration,
                colors.aqua
            )
        }
        // start move arc
        startArc('move', moveDuration, colors.green)
        lowMetalTone.play()
        // update ui state
        setMoveState('Move')
        setSeconds(moveDuration)
        d3.selectAll(`.${styles.playerState}`).text('')
        d3.select(`#player-${player.socketId}`).text('(recording)')
        // start seconds timer
        let timeLeft = moveDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            setSeconds(timeLeft)
            if (timeLeft < 1) {
                // end seconds timer
                clearInterval(secondsTimerRef.current)
                // if your move, stop audio recording
                if (isYou(player.socketId)) mediaRecorderRef.current.stop()
                // if more moves left
                if (moveNumber < numberOfTurns * data.players.length) {
                    // calculate next player from previous players index
                    const PPIndex = data.players.findIndex((p) => p.socketId === player.socketId)
                    const endOfTurn = PPIndex + 1 === data.players.length
                    const nextPlayer = data.players[endOfTurn ? 0 : PPIndex + 1]
                    // if interval, start interval
                    if (intervalDuration > 0)
                        startInterval(moveNumber + 1, newTurnNumber, nextPlayer, data)
                    // else start next move
                    else startMove(moveNumber + 1, newTurnNumber, nextPlayer, data)
                } else {
                    // end game
                    highMetalTone.play()
                    setGameInProgress(false)
                    setTurn(0)
                    setSeconds(null)
                    pushComment('The game ended')
                    d3.select(`#game-arc`).remove()
                    d3.select(`#turn-arc`).remove()
                    d3.select(`#move-arc`).remove()
                    d3.selectAll(`.${styles.playerState}`).text('')
                }
            }
        }, 1000)
    }

    function startInterval(moveNumber, turnNumber, nextPlayer, data) {
        const { intervalDuration } = data
        // start interval timer
        startArc('move', intervalDuration, colors.yellow)
        lowMetalTone.play()
        // update ui state
        setMoveState('Interval')
        setSeconds(intervalDuration)
        d3.selectAll(`.${styles.playerState}`).text('')
        d3.select(`#player-${nextPlayer.socketId}`).text('(up next)')
        // start seconds timer
        let timeLeft = intervalDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            setSeconds(timeLeft)
            if (timeLeft === 0) {
                // end seconds timer and start move
                clearInterval(secondsTimerRef.current)
                startMove(moveNumber, turnNumber, nextPlayer, data)
            }
        }, 1000)
    }

    function signalStopGame() {
        const data = {
            roomId: roomIdRef.current,
            userSignaling: userRef.current,
            gameId: gameData.gameId,
        }
        socketRef.current.emit('sending-stop-game', data)
    }

    function saveGame() {
        axios
            .post(`${config.apiURL}/save-glass-bead-game`, { gameId: gameData.gameId, beads })
            .then(() => setGameData({ ...gameData, locked: true }))
            .catch((error) => console.log(error))
    }

    function toggleBeadAudio(beadIndex) {
        const newBeads = [...beads]
        const bead = newBeads.find((b) => b.index === beadIndex)
        const audio = d3.select(`#bead-${beadIndex}`).select('audio').node()
        if (bead.playing) audio.pause()
        else audio.play()
        bead.playing = !bead.playing
        setBeads(newBeads)
    }

    function findTopicSVG(topicName) {
        const topicMatch = GlassBeadGameTopics.find((t) => t.name === topicName)
        return topicMatch ? <topicMatch.icon /> : null
    }

    function peopleInRoomText() {
        const totalUsers = usersRef.current.length
        return `${totalUsers} ${isPlural(totalUsers) ? 'people' : 'person'} in room`
    }

    // todo: flatten out userData into user object with socketId
    useEffect(() => {
        if (postData.id && !accountDataLoading) {
            getGameData()
            // set roomIdRef and userRef
            roomIdRef.current = postData.id
            userRef.current = {
                // todo: store socketId as well after returned from server
                id: accountData.id,
                handle: accountData.handle,
                name: accountData.name || 'Anonymous',
                flagImagePath: accountData.flagImagePath,
            }
            // disconnect previous socket connections if present
            if (socketRef.current) socketRef.current.disconnect()
            // create new connection to socket
            socketRef.current = io(config.apiWebSocketURL || '')
            // join room
            socketRef.current.emit('join-room', {
                roomId: roomIdRef.current,
                userData: userRef.current,
            })
            // listen for signals:
            // room joined (currently firing after 'user-joined' event on page load)
            socketRef.current.on('room-joined', (payload) => {
                const { socketId, usersInRoom } = payload
                // console.log('usersInRoom: ', usersInRoom)
                socketIdRef.current = socketId
                // userRef.current.socketId = socketId
                usersRef.current = usersInRoom
                pushComment(`You joined the room`)
                usersInRoom.forEach((user) => {
                    if (!isYou(user.socketId)) {
                        // create peer connection
                        const peer = new Peer({ initiator: true, config: iceConfig })
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
                                userData: user.userData,
                                peer,
                                audioOnly: !stream.getVideoTracks().length,
                            })
                            pushComment(`${user.userData.name}'s video connected`)
                            const video = document.getElementById(user.socketId) as HTMLVideoElement
                            video.srcObject = stream
                            const newPlayer = {
                                id: user.userData.id,
                                name: user.userData.name,
                                flagImagePath: user.userData.flagImagePath,
                                socketId: user.socketId,
                            }
                            setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                        })
                        peer.on('close', () => peer.destroy())
                        peer.on('error', (error) => console.log(error))
                        peersRef.current.push({
                            socketId: user.socketId,
                            userData: user.userData,
                            peer,
                        })
                    }
                })
            })
            // signal returned from peer
            socketRef.current.on('signal-returned', (payload) => {
                // find peer in peers array
                const peerObject = peersRef.current.find((p) => p.socketId === payload.id)
                // pass singal to peer
                // console.log('peerObject.peer: ', peerObject) // .destroying
                // peerObject.peer.signal(payload.signal)
                // console.log('peerObject: ', peerObject) .peer.readable
                if (peerObject) {
                    if (peerObject.peer.readable) peerObject.peer.signal(payload.signal)
                    else {
                        peerObject.peer.destroy()
                        peersRef.current = peersRef.current.filter((p) => p.socketId !== payload.id)
                    }
                } else {
                    //
                }
            })
            // signal request from peer
            socketRef.current.on('signal-request', (payload) => {
                const { signal, userSignaling } = payload
                const { socketId, userData } = userSignaling
                // search for peer in peers array
                const existingPeer = peersRef.current.find((p) => p.socketId === socketId)
                // if peer exists, pass signal to peer
                if (existingPeer) existingPeer.peer.signal(signal)
                else {
                    // otherwise, create new peer connection (with stream if running)
                    const peer = new Peer({
                        initiator: false,
                        stream: streamRef.current || null,
                        config: iceConfig,
                    })
                    peer.on('signal', (data) => {
                        socketRef.current.emit('returning-signal', {
                            signal: data,
                            callerID: socketId,
                        })
                    })
                    peer.on('stream', (stream) => {
                        videosRef.current.push({
                            socketId,
                            userData,
                            peer,
                            audioOnly: !stream.getVideoTracks().length,
                        })
                        // setVideoRenderKey(videoRenderKey + 1)
                        pushComment(`${userData.name}'s video connected`)
                        // const waitForVideo = setInterval(() => {
                        //     const video = document.getElementById(socketId) as HTMLVideoElement
                        //     console.log('wait')
                        //     if (video) {
                        //         video.srcObject = stream
                        //         const newPlayer = {
                        //             id: userData.id,
                        //             name: userData.name,
                        //             flagImagePath: userData.flagImagePath,
                        //             socketId,
                        //         }
                        //         setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                        //         pushComment(`${userData.name}'s video connected`)
                        //         // setVideoRenderKey(videoRenderKey + 1)
                        //         clearInterval(waitForVideo)
                        //     }
                        // }, 100)
                        const video = document.getElementById(socketId) as HTMLVideoElement
                        // causing error if no video:
                        if (video) video.srcObject = stream
                        else console.log('cant find video')
                        const newPlayer = {
                            id: userData.id,
                            name: userData.name,
                            flagImagePath: userData.flagImagePath,
                            socketId,
                        }
                        setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                        // pushComment(`${userData.name}'s video connected`)
                    })
                    peer.on('close', () => peer.destroy())
                    peer.on('error', (error) => console.log(error))
                    peer.signal(signal)
                    peersRef.current.push({ socketId, userData, peer })
                }
            })
            // user joined room
            socketRef.current.on('user-joined', (user) => {
                // console.log('user-joined', user)
                // if not you ?
                usersRef.current.push(user)
                pushComment(`${user.userData.name} joined the room`)
            })
            // user left room
            socketRef.current.on('user-left', (user) => {
                const { socketId, userData } = user
                usersRef.current = usersRef.current.filter((u) => u.socketId !== socketId)
                peersRef.current = peersRef.current.filter((p) => p.socketId !== socketId)
                videosRef.current = videosRef.current.filter((v) => v.socketId !== socketId)
                setPlayers((ps) => [...ps.filter((p) => p.socketId !== socketId)])
                pushComment(`${userData.name} left the room`)
            })
            // comment recieved
            socketRef.current.on('returning-comment', (data) => {
                pushComment(data)
            })
            // start game signal recieved
            socketRef.current.on('returning-start-game', (data) => {
                setGameSettingsModalOpen(false)
                setGameInProgress(true)
                setBeads([])
                pushComment(`${data.userSignaling.name} started the game`)
                startGame(data.gameData)
            })
            // stop game signal recieved
            socketRef.current.on('returning-stop-game', (data) => {
                pushComment(`${data.userSignaling.name} stopped the game`)
                setGameInProgress(false)
                clearInterval(secondsTimerRef.current)
                d3.selectAll(`.${styles.playerState}`).text('')
                d3.select(`#game-arc`).remove()
                d3.select(`#turn-arc`).remove()
                d3.select(`#move-arc`).remove()
                setSeconds(null)
                setTurn(0)
                setMove(0)
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording')
                    mediaRecorderRef.current.stop()
            })
            // audio bead recieved
            socketRef.current.on('returning-audio-bead', (data) => {
                setBeads((previousBeads) => [...previousBeads, data])
                d3.select(`#bead-${data.index}`).select('audio').attr('src', data.beadUrl)
            })
            // stream disconnected
            socketRef.current.on('stream-disconnected', (data) => {
                const { socketId, userData } = data
                videosRef.current = videosRef.current.filter((v) => v.socketId !== socketId)
                setPlayers((ps) => [...ps.filter((p) => p.socketId !== socketId)])
                pushComment(`${userData.name}'s stream disconnected`)
            })
        }
        return () => socketRef.current && socketRef.current.disconnect()
        // return () => {
        //     // console.log('exit')
        //     if (socketRef.current) socketRef.current.disconnect()
        // }
    }, [postData.id, accountDataLoading])

    useEffect(() => {
        const svg = d3
            .select('#timer')
            .append('svg')
            .attr('id', 'timer-svg')
            .attr('width', gameArcRadius * 2)
            .attr('height', gameArcRadius * 2)

        const timerGroup = svg
            .append('g')
            .attr('id', 'timer-group')
            .attr('transform', `translate(${gameArcRadius},${gameArcRadius})`)

        function createArcBarckground(type: 'game' | 'turn' | 'move', color: string) {
            timerGroup
                .append('path')
                .datum({ startAngle: 0, endAngle: 2 * Math.PI })
                .attr('id', `${type}-arc-background`)
                .style('fill', color)
                .style('opacity', 0.8)
                .attr('d', arcs[`${type}Arc`])
        }

        createArcBarckground('game', colors.grey1)
        createArcBarckground('turn', colors.grey2)
        createArcBarckground('move', colors.grey3)
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div
                    className={`${styles.comments} ${
                        !showComments && styles.hidden
                    } hide-scrollbars`}
                >
                    <div ref={commentsRef} className='hide-scrollbars'>
                        {comments.map((comment) => (
                            <Comment comment={comment} key={uuidv4()} />
                        ))}
                    </div>
                    <form onSubmit={createComment}>
                        <Input
                            type='text'
                            placeholder='comment...'
                            margin='0 10px 0 0'
                            state='default'
                            value={newComment}
                            onChange={(v) => setNewComment(v)}
                        />
                        <Button text='Send' colour='blue' size='medium' submit />
                    </form>
                    <button
                        type='button'
                        className={styles.closeCommentsBar}
                        onClick={() => setShowComments(!showComments)}
                    >
                        <ChevronUpIconSVG transform={`rotate(${showComments ? 270 : 90})`} />
                    </button>
                </div>
                <div className={styles.centerPanel}>
                    {gameInProgress ? (
                        <div className={styles.gameControls}>
                            <Button
                                text='Stop game'
                                colour='red'
                                size='medium'
                                margin='0 0 10px 0'
                                onClick={signalStopGame}
                            />
                            <p>{`Turn ${turn} / ${gameData.numberOfTurns}`}</p>
                            {players.map((player, index) => (
                                <Row margin='10px 0 0 0' centerY key={player.socketId}>
                                    <div className={styles.position}>{index + 1}</div>
                                    <ImageTitle
                                        type='user'
                                        imagePath={player.flagImagePath}
                                        title={isYou(player.socketId) ? 'You' : player.name}
                                        fontSize={16}
                                        imageSize={35}
                                        margin='0 10px 0 0'
                                    />
                                    <p
                                        id={`player-${player.socketId}`}
                                        className={styles.playerState}
                                    />
                                </Row>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.gameControls}>
                            <Button
                                text={`${userIsStreaming ? 'Disconnect' : 'Connect'} audio/video`}
                                colour={userIsStreaming ? 'red' : 'grey'}
                                size='medium'
                                margin='0 0 10px 0'
                                loading={loadingStream}
                                disabled={loadingStream}
                                onClick={toggleStream}
                            />
                            {gameData.locked ? (
                                <div className={styles.gameLocked}>
                                    <LockIconSVG />
                                    <p>Game locked</p>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        text={`${beads.length ? 'Restart' : 'Start'} game`}
                                        colour='grey'
                                        size='medium'
                                        margin='0 0 10px 0'
                                        onClick={() => setGameSettingsModalOpen(true)}
                                    />
                                    {beads.length > 0 && (
                                        <Button
                                            text='Save and lock game'
                                            colour='grey'
                                            size='medium'
                                            margin='0 0 10px 0'
                                            onClick={saveGame}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {gameSettingsModalOpen && (
                        <GameSettingsModal
                            close={() => setGameSettingsModalOpen(false)}
                            gameData={gameData}
                            socketId={socketIdRef.current}
                            players={players}
                            setPlayers={setPlayers}
                            signalStartGame={signalStartGame}
                        />
                    )}
                    <Column centerX>
                        <h1 style={{ margin: 0 }}>{gameData.topic}</h1>
                        <div className={styles.topic}>{findTopicSVG(gameData.topic)}</div>
                        <div className={`${styles.dna} ${styles.top}`}>
                            <DNAIconSVG />
                            <DNAIconSVG />
                            <DNAIconSVG />
                            <DNAIconSVG />
                        </div>
                        <div className={`${styles.dna} ${styles.bottom}`}>
                            <DNAIconSVG />
                            <DNAIconSVG />
                            <DNAIconSVG />
                            <DNAIconSVG />
                        </div>
                        <div id='timer' className={styles.timer}>
                            <div className={styles.timerArcTitles}>
                                <p>Game</p>
                                <p>Turn</p>
                                <p>{moveState}</p>
                                <span>{seconds}</span>
                            </div>
                            <div className={styles.mainBead}>
                                <img src='/icons/gbg/sound-wave.png' alt='' />
                            </div>
                        </div>
                    </Column>
                    <div className={`${styles.peopleInRoom} hide-scrollbars`}>
                        <p>{peopleInRoomText()}</p>
                        {usersRef.current.map((user) => (
                            <ImageTitle
                                key={user.socketId}
                                type='user'
                                imagePath={user.userData.flagImagePath}
                                title={isYou(user.socketId) ? 'You' : user.userData.name}
                                fontSize={16}
                                imageSize={40}
                                margin='0 0 10px 0'
                            />
                        ))}
                    </div>
                </div>
                {/* key={videoRenderKey} */}
                <div className={`${styles.videos} hide-scrollbars`}>
                    {userIsStreaming && (
                        <Video
                            id='your-video'
                            user={userRef.current}
                            size={findVideoSize()}
                            audioEnabled={audioTrackEnabled}
                            videoEnabled={videoTrackEnabled}
                            toggleAudio={toggleAudioTrack}
                            toggleVideo={toggleVideoTrack}
                            audioOnly={audioOnly}
                        />
                    )}
                    {videosRef.current.map((v) => {
                        return (
                            <Video
                                key={v.socketId}
                                id={v.socketId}
                                user={v.userData}
                                size={findVideoSize()}
                                audioOnly={v.audioOnly}
                            />
                        )
                    })}
                </div>
            </div>
            <div className={`${styles.beads}`}>
                {beads.map((bead, index) => (
                    <div key={bead.id} className={styles.beadWrapper}>
                        <div className={styles.bead} id={`bead-${bead.index}`}>
                            <ImageTitle
                                type='user'
                                imagePath={bead.user.flagImagePath}
                                title={bead.user.id === accountData.id ? 'You' : bead.user.name}
                                fontSize={16}
                                imageSize={30}
                                margin='0 10px 0 0'
                            />
                            <img src='/icons/gbg/sound-wave.png' alt='sound-wave' />
                            <div className={styles.beadControls}>
                                <button type='button' onClick={() => toggleBeadAudio(bead.index)}>
                                    {bead.playing ? <PauseIconSVG /> : <PlayIconSVG />}
                                </button>
                            </div>
                            <audio>
                                <track kind='captions' />
                            </audio>
                        </div>
                        {beads.length > index + 1 && (
                            <div className={styles.beadDivider}>
                                <DNAIconSVG />
                                {/* <DNAIconSVG /> */}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GlassBeadGame
// 1058
// 1064
// 1089
// 1094
// 1103
// 1124
// 1191

/* <div className={styles.dividerLine} />
<img
    src='/icons/gbg/infinity.png'
    alt='infinity'
    className={styles.dividerConnector}
/>
<div className={styles.dividerLine} /> */

// <PlayerPosition
//     you={player.socketId === socketId}
//     totalPlayers={players.length}
//     position={index + 1}
//     updatePosition={updatePlayerPosition}
//     socketId={player.socketId}
//     name={player.name}
//     flagImagePath={player.flagImagePath}
// />

// const PlayerPosition = (props) => {
//     const { you, totalPlayers, position, updatePosition, name, flagImagePath } = props
//     return (
//         <Row margin='10px 0 0 0'>
//             <div className={styles.position}>{position}</div>
//             <div className={styles.positionControls}>
//                 {position > 1 && (
//                     <button type='button' onClick={() => updatePosition(position, position - 1)}>
//                         <ChevronUpIconSVG />
//                     </button>
//                 )}
//                 {position < totalPlayers && (
//                     <button type='button' onClick={() => updatePosition(position, position + 1)}>
//                         <ChevronDownIconSVG />
//                     </button>
//                 )}
//             </div>
//             <ImageTitle
//                 type='user'
//                 imagePath={flagImagePath}
//                 title={you ? 'You' : name}
//                 fontSize={16}
//                 imageSize={35}
//             />
//         </Row>
//     )
// }

// todo: create gameData state, then remove 'new' from contsants names in game settings modal
// const [gameId, setGameId] = useState(0)
// const [locked, setLocked] = useState(false)
// const [topic, setTopic] = useState('')
// const [numberOfTurns, setNumberOfTurns] = useState(defaults.numberOfTurns)
// const [moveDuration, setMoveDuration] = useState(defaults.moveDuration)
// const [introDuration, setIntroDuration] = useState(defaults.introDuration)
// const [intervalDuration, setIntervalDuration] = useState(defaults.intervalDuration)
// const [moveInTurn, setMoveInTurn] = useState(0)

// // game settings modal
// type InputState = 'default' | 'valid' | 'invalid'
// const [gameSettingsModalOpen, setGameSettingsModalOpen] = useState(false)
// const [newNumberOfTurns, setNewNumberOfTurns] = useState(defaults.numberOfTurns)
// const [newNumberOfTurnsState, setNewNumberOfTurnsState] = useState<InputState>('default')
// const [newNumberOfTurnsErrors, setNewNumberOfTurnsErrors] = useState<string[]>([])
// const [newMoveDuration, setNewMoveDuration] = useState(defaults.moveDuration)
// const [newMoveDurationState, setNewMoveDurationState] = useState<InputState>('default')
// const [newMoveDurationErrors, setNewMoveDurationErrors] = useState<string[]>([])
// const [newIntroDuration, setNewIntroDuration] = useState(defaults.introDuration)
// const [newIntroDurationState, setNewIntroDurationState] = useState<InputState>('default')
// const [newIntroDurationErrors, setNewIntroDurationErrors] = useState<string[]>([])
// const [newIntervalDuration, setNewIntervalDuration] = useState(defaults.intervalDuration)
// const [newIntervalDurationState, setNewIntervalDurationState] = useState<InputState>('default')
// const [newIntervalDurationErrors, setNewIntervalDurationErrors] = useState<string[]>([])
// const [invalidPlayersError, setInvalidPlayersError] = useState(false)
// // todo: remove, start game instead
// const [loading, setLoading] = useState(false)
// const [settingsSaved, setSettingsSaved] = useState(false)

// <Modal close={() => closeGameSettingsModal()} centered>
//     <h1>Game settings</h1>
//     <p>
//         Players must connect their audio/video to participate in the
//         game
//     </p>
//     <form onSubmit={signalStartGame}>
//         <Row margin='10px 0 30px 0'>
//             <Column margin='0 60px 0 0'>
//                 <Input
//                     title='Intro duration (seconds)'
//                     type='text'
//                     margin='0 0 10px 0'
//                     state={newIntroDurationState}
//                     errors={newIntroDurationErrors}
//                     value={newIntroDuration}
//                     onChange={(v) => {
//                         setNewIntroDurationState('default')
//                         setNewIntroDuration(+v.replace(/\D/g, ''))
//                     }}
//                 />
//                 <Input
//                     title='Number of turns'
//                     type='text'
//                     margin='0 0 10px 0'
//                     state={newNumberOfTurnsState}
//                     errors={newNumberOfTurnsErrors}
//                     value={newNumberOfTurns}
//                     onChange={(v) => {
//                         setNewNumberOfTurnsState('default')
//                         setNewNumberOfTurns(+v.replace(/\D/g, ''))
//                     }}
//                 />
//                 <Input
//                     title='Move duration (seconds)'
//                     type='text'
//                     margin='0 0 10px 0'
//                     state={newMoveDurationState}
//                     errors={newMoveDurationErrors}
//                     value={newMoveDuration}
//                     onChange={(v) => {
//                         setNewMoveDurationState('default')
//                         setNewMoveDuration(+v.replace(/\D/g, ''))
//                     }}
//                 />
//                 <Input
//                     title='Interval duration (seconds)'
//                     type='text'
//                     margin='0 0 10px 0'
//                     // disabled={loading || settingsSaved}
//                     state={newIntervalDurationState}
//                     errors={newIntervalDurationErrors}
//                     value={newIntervalDuration}
//                     onChange={(v) => {
//                         setNewIntervalDurationState('default')
//                         setNewIntervalDuration(+v.replace(/\D/g, ''))
//                     }}
//                 />
//             </Column>
//             <Column margin='0 60px 0 0'>
//                 <h2>Player order</h2>
//                 {players.map((player, index) => (
//                     <PlayerPosition
//                         you={player.socketId === socketIdRef.current}
//                         totalPlayers={players.length}
//                         position={index + 1}
//                         updatePosition={updatePlayerPosition}
//                         // setPosition={setPlayerPosition}
//                         socketId={player.socketId}
//                         name={player.name}
//                         flagImagePath={player.flagImagePath}
//                     />
//                 ))}
//                 {!players.length && (
//                     <p className={styles.noUsersConnected}>
//                         No users connected...
//                     </p>
//                 )}
//                 {invalidPlayersError && (
//                     <p className={styles.error}>
//                         At least one player must connect their
//                         audio/video
//                     </p>
//                 )}
//             </Column>
//         </Row>
//         <Row>
//             {!settingsSaved && (
//                 <Button
//                     text='Start game'
//                     colour='blue'
//                     size='medium'
//                     disabled={loading}
//                     submit
//                 />
//             )}
//             {loading && <LoadingWheel />}
//             {settingsSaved && <SuccessMessage text='Saved' />}
//         </Row>
//     </form>
// </Modal>

// function signalStartGame(e) {
//     e.preventDefault()
//     // validate settings
//     const invalidNumberOfTurns = newNumberOfTurns < 1 || newNumberOfTurns > 20
//     const invalidMoveDuration = newMoveDuration < 10 || newMoveDuration > 600
//     const invalidIntroDuration = newIntroDuration < 10 || newIntroDuration > 60
//     const invalidIntervalDuration = newIntervalDuration < 10 || newIntervalDuration > 60
//     const invalidPlayers = players.length < 1 || players.length > 20
//     setNewNumberOfTurnsState(invalidNumberOfTurns ? 'invalid' : 'valid')
//     setNewNumberOfTurnsErrors(invalidNumberOfTurns ? ['Must be between 1 and 20 turns'] : [])
//     setNewMoveDurationState(invalidMoveDuration ? 'invalid' : 'valid')
//     setNewMoveDurationErrors(
//         invalidMoveDuration ? ['Must be between 10 seconds and 10 minutes'] : []
//     )
//     setNewIntroDurationState(invalidIntroDuration ? 'invalid' : 'valid')
//     setNewIntroDurationErrors(
//         invalidIntroDuration ? ['Must be between 10 seconds and 1 minute'] : []
//     )
//     setNewIntervalDurationState(invalidIntervalDuration ? 'invalid' : 'valid')
//     setNewIntervalDurationErrors(
//         invalidIntervalDuration ? ['Must be between 10 seconds and 1 minute'] : []
//     )
//     setInvalidPlayersError(invalidPlayers)
//     // if all valid
//     if (
//         !invalidNumberOfTurns &&
//         !invalidMoveDuration &&
//         !invalidIntroDuration &&
//         !invalidIntervalDuration &&
//         !invalidPlayers
//     ) {
//         setLoading(true)
//         // save new settings in local state
//         setIntroDuration(newIntroDuration)
//         setNumberOfTurns(newNumberOfTurns)
//         setMoveDuration(newMoveDuration)
//         setIntervalDuration(newIntervalDuration)
//         // save new settings in db
//         const data = {
//             gameId,
//             numberOfTurns: newNumberOfTurns,
//             moveDuration: newMoveDuration,
//             introDuration: newIntroDuration,
//             intervalDuration: newIntervalDuration,
//             playerOrder: players.map((p) => p.id).join(','),
//         }
//         axios
//             .post(`${config.apiURL}/save-glass-bead-game-settings`, data)
//             .then(() => {
//                 setLoading(false)
//                 setSettingsSaved(true)
//                 const signalData = {
//                     roomId: roomIdRef.current,
//                     signaller: userRef.current,
//                     gameData: {
//                         players,
//                         introDuration: newIntroDuration,
//                         numberOfTurns: newNumberOfTurns,
//                         moveDuration: newMoveDuration,
//                         intervalDuration: newIntervalDuration,
//                         turnDuration: players.length * (newMoveDuration + newIntervalDuration),
//                     },
//                 }
//                 socketRef.current.emit('sending-start-game', signalData)
//                 closeGameSettingsModal()
//             })
//             .catch((error) => console.log(error))
//     }
// }

// function closeGameSettingsModal() {
//     setGameSettingsModalOpen(false)
//     setSettingsSaved(false)
//     setNewNumberOfTurns(numberOfTurns)
//     setNewNumberOfTurnsState('default')
//     setNewNumberOfTurnsErrors([])
//     setNewMoveDuration(moveDuration)
//     setNewMoveDurationState('default')
//     setNewMoveDurationErrors([])
//     setNewIntroDuration(introDuration)
//     setNewIntroDurationState('default')
//     setNewIntroDurationErrors([])
//     setNewIntervalDuration(intervalDuration)
//     setNewIntervalDurationState('default')
//     setNewIntervalDurationErrors([])
//     setInvalidPlayersError(false)
// }

// function signalStartGame(data) {
//     socketRef.current.emit('sending-start-game', data)
// }

// function updatePlayerPosition(from, to) {
//     const newPlayers = [...players]
//     const player = newPlayers[from - 1]
//     newPlayers.splice(from - 1, 1)
//     newPlayers.splice(to - 1, 0, player)
//     setPlayers(newPlayers)
// }

/* <div
    className={`${styles.button} ${
        streamRef.current && styles.danger
    } mr-10`}
    role='button'
    tabIndex={0}
    onClick={toggleStream}
    onKeyDown={toggleStream}
>
    Connect video and audio
</div> */

/* <div>
    <p>
        {totalUsersStreaming}{' '}
        {isPlural(totalUsersStreaming) ? 'people' : 'person'} streaming
    </p>
    {/* {usersRef.current.map((user) => (
        // if (user.stream) return
        <ImageTitle
            key={user.socketId}
            type='user'
            imagePath={user.userData.flagImagePath}
            title={user.userData.name}
            fontSize={16}
            imageSize={40}
            margin='0 0 10px 0'
        />
    ))} */
// </div> */}

/* <div className={styles.gameControls}>
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
            value={moveDuration || undefined}
            onChange={(e) => {
                setMoveDuration(+e.target.value)
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
</div> */
/* <div className={`${styles.rightPanel} hide-scrollbars`}>
     <div className={`${styles.users} hide-scrollbars`}>
        <div
            className={`${styles.button} ${
                streamRef.current && styles.danger
            } mr-10`}
            role='button'
            tabIndex={0}
            onClick={toggleStream}
            onKeyDown={toggleStream}
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
    </div> */
/* <div className={`${styles.videos} hide-scrollbars`}>
        {userIsStreaming && <Video mainUser size={findVideoSize()} />}
        {videosRef.current.map((peer) => {
            return <Video key={peer.socketId} peer={peer} size={findVideoSize()} />
        })}
    </div> 
</div> */
