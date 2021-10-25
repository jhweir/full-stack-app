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
import { isPlural, timeSinceCreated, dateCreated } from '@src/Functions'
import Modal from '@components/Modal'
import Input from '@components/Input'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'
import Row from '@components/Row'
import Column from '@components/Column'
// import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'
import { ReactComponent as AudioIconSVG } from '@svgs/microphone-solid.svg'
import { ReactComponent as AudioSlashIconSVG } from '@svgs/microphone-slash-solid.svg'
import { ReactComponent as VideoIconSVG } from '@svgs/video-solid.svg'
import { ReactComponent as VideoSlashIconSVG } from '@svgs/video-slash-solid.svg'
import { ReactComponent as ChevronUpIconSVG } from '@svgs/chevron-up-solid.svg'
import { ReactComponent as ChevronDownIconSVG } from '@svgs/chevron-down-solid.svg'
// import { ReactComponent as ChevronDownIconSVG } from '@svgs/caret-up-solid.svg'

const Video = (props) => {
    const { mainUser, video, size, audioEnabled, videoEnabled, toggleAudio, toggleVideo } = props
    const { accountData } = useContext(AccountContext)
    const id = mainUser ? 'main-user-video' : video.socketId
    const imagePath = mainUser ? accountData.flagImagePath : video.userData.flagImagePath
    const title = mainUser ? 'You' : video.userData.name
    return (
        <div className={`${styles.videoWrapper} ${size}`}>
            <video id={id} muted={mainUser} autoPlay playsInline>
                <track kind='captions' />
            </video>
            <div className={styles.videoUser}>
                <ImageTitle type='user' imagePath={imagePath} title={title} />
            </div>
            {mainUser && (
                <div className={styles.videoButtons}>
                    <button type='button' onClick={toggleAudio}>
                        {audioEnabled ? <AudioIconSVG /> : <AudioSlashIconSVG />}
                    </button>
                    <button type='button' onClick={toggleVideo}>
                        {videoEnabled ? <VideoIconSVG /> : <VideoSlashIconSVG />}
                    </button>
                </div>
            )}
        </div>
    )
}

const Comment = (props) => {
    const { comment } = props
    const { user, text, createdAt } = comment
    return (
        <div className={styles.commentWrapper}>
            {user ? (
                <>
                    <SmallFlagImage type='user' size={40} imagePath={user.flagImagePath} />
                    <div className={styles.commentText}>
                        <Row>
                            <h1>{user.name}</h1>
                            <p title={dateCreated(createdAt)}>{timeSinceCreated(createdAt)}</p>
                        </Row>
                        <p>{text}</p>
                    </div>
                </>
            ) : (
                <p className={styles.adminText}>{text}</p>
            )}
        </div>
    )
}

const PlayerPosition = (props) => {
    const { you, totalPlayers, position, updatePosition, name, flagImagePath } = props
    return (
        <Row margin='10px 0 0 0'>
            <div className={styles.position}>{position}</div>
            <div className={styles.positionControls}>
                {position > 1 && (
                    <button type='button' onClick={() => updatePosition(position, position - 1)}>
                        <ChevronUpIconSVG />
                    </button>
                )}
                {position < totalPlayers && (
                    <button type='button' onClick={() => updatePosition(position, position + 1)}>
                        <ChevronDownIconSVG />
                    </button>
                )}
            </div>
            <ImageTitle
                type='user'
                imagePath={flagImagePath}
                title={you ? 'You' : name}
                fontSize={16}
                imageSize={35}
            />
        </Row>
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
    const { postDataLoading, postData } = useContext(PostContext)

    const defaults = {
        introDuration: 10,
        numberOfTurns: 6,
        moveDuration: 30,
        intervalDuration: 10,
        numberOfPlayers: 0,
    }

    // todo: create gameData state, then remove 'new' from contsants names in game settings modal
    const [gameId, setGameId] = useState(0)
    const [locked, setLocked] = useState(false)
    const [topic, setTopic] = useState('')
    const [numberOfTurns, setNumberOfTurns] = useState(defaults.numberOfTurns)
    const [moveDuration, setMoveDuration] = useState(defaults.moveDuration)
    const [introDuration, setIntroDuration] = useState(defaults.introDuration)
    const [intervalDuration, setIntervalDuration] = useState(defaults.intervalDuration)
    // todo: number of players not needed
    const [numberOfPlayers, setNumberOfPlayers] = useState(defaults.numberOfPlayers)
    const [gameInProgress, setGameInProgress] = useState(false)
    const [userIsStreaming, setUserIsStreaming] = useState(false)
    const [players, setPlayers] = useState<any[]>([])
    const [turn, setTurn] = useState(0)
    const [moveInTurn, setMoveInTurn] = useState(0)

    // game settings modal
    type InputState = 'default' | 'valid' | 'invalid'
    const [gameSettingsModalOpen, setGameSettingsModalOpen] = useState(false)
    const [newNumberOfTurns, setNewNumberOfTurns] = useState(defaults.numberOfTurns)
    const [newNumberOfTurnsState, setNewNumberOfTurnsState] = useState<InputState>('default')
    const [newNumberOfTurnsErrors, setNewNumberOfTurnsErrors] = useState<string[]>([])
    const [newMoveDuration, setNewMoveDuration] = useState(defaults.moveDuration)
    const [newMoveDurationState, setNewMoveDurationState] = useState<InputState>('default')
    const [newMoveDurationErrors, setNewMoveDurationErrors] = useState<string[]>([])
    const [newIntroDuration, setNewIntroDuration] = useState(defaults.introDuration)
    const [newIntroDurationState, setNewIntroDurationState] = useState<InputState>('default')
    const [newIntroDurationErrors, setNewIntroDurationErrors] = useState<string[]>([])
    const [newIntervalDuration, setNewIntervalDuration] = useState(defaults.intervalDuration)
    const [newIntervalDurationState, setNewIntervalDurationState] = useState<InputState>('default')
    const [newIntervalDurationErrors, setNewIntervalDurationErrors] = useState<string[]>([])
    const [invalidPlayersError, setInvalidPlayersError] = useState(false)
    // todo: remove, start game instead
    const [loading, setLoading] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)

    const [beads, setBeads] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')
    const [audioTrackEnabled, setAudioTrackEnabled] = useState(false)
    const [videoTrackEnabled, setVideoTrackEnabled] = useState(false)

    // state refs (used to...)
    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const socketIdRef = useRef('')
    const userRef = useRef<any>({})
    const usersRef = useRef<any>([])
    const peersRef = useRef<any[]>([])
    const videosRef = useRef<any[]>([])
    const secondsTimerRef = useRef<any>(null)
    // const gameInProgressRef = useRef<boolean>(false)
    const mediaRecorderRef = useRef<any>(null)
    const chunksRef = useRef<any[]>([])
    const streamRef = useRef<any>(null)
    const videoRef = useRef<any>(null)
    const commentsRef = useRef<HTMLDivElement>(null)

    const totalUsersStreaming = userIsStreaming
        ? videosRef.current.length + 1
        : videosRef.current.length

    const gameArcRadius = 210
    const gameArc = d3
        .arc()
        .innerRadius(gameArcRadius - 20)
        .outerRadius(gameArcRadius)
        .cornerRadius(5)

    const turnArcRadius = 180
    const turnArc = d3
        .arc()
        .innerRadius(turnArcRadius - 20)
        .outerRadius(turnArcRadius)
        .cornerRadius(5)

    const moveArcRadius = 150
    const moveArc = d3
        .arc()
        .innerRadius(moveArcRadius - 20)
        .outerRadius(moveArcRadius)
        .cornerRadius(5)

    function scrollToLatestComment() {
        const { current } = commentsRef
        if (current) current.scrollTop = current.scrollHeight
    }

    function getGameData() {
        console.log('getGameData')
        axios.get(`${config.apiURL}/glass-bead-game-data?postId=${postData.id}`).then((res) => {
            // console.log('res: ', res)
            setGameId(res.data.id)
            setLocked(res.data.locked)
            setTopic(res.data.topic)
            setNumberOfTurns(res.data.numberOfTurns || defaults.numberOfTurns)
            setMoveDuration(res.data.moveDuration || defaults.moveDuration)
            setIntroDuration(res.data.introDuration || defaults.introDuration)
            setIntervalDuration(res.data.intervalDuration || defaults.intervalDuration)
            setNumberOfPlayers(res.data.numberOfPlayers || defaults.numberOfPlayers)
            setComments(res.data.GlassBeadGameComments)
            scrollToLatestComment()
            setBeads(res.data.GlassBeads)
            // attach data to beads
            res.data.GlassBeads.forEach((bead) => {
                d3.select(`#bead-${bead.index}`).select('audio').attr('src', bead.beadUrl)
                d3.select(`#bead-${bead.index}`)
                    .select('p')
                    .text(bead.User ? bead.User.name : 'Anonymous')
            })
            // todo: callback?
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
            streamRef.current.getTracks()[0].stop() // audio
            streamRef.current.getTracks()[1].stop() // video
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
            navigator.mediaDevices
                .getUserMedia({ video: { width: 427, height: 240 }, audio: true })
                .then((stream) => {
                    setUserIsStreaming(true)
                    streamRef.current = stream
                    peersRef.current.forEach((p) => p.peer.addStream(stream))
                    videoRef.current = document.getElementById('main-user-video')
                    videoRef.current.srcObject = stream
                    setAudioTrackEnabled(true)
                    setVideoTrackEnabled(true)
                    const newPlayer = {
                        id: accountData.id,
                        name: accountData.name,
                        flagImagePath: accountData.flagImagePath,
                        socketId: socketIdRef.current,
                    }
                    setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                })
        }
    }

    function toggleAudioTrack() {
        const audioTrack = streamRef.current.getTracks()[0]
        if (audioTrackEnabled) {
            audioTrack.enabled = false
            setAudioTrackEnabled(false)
        } else {
            audioTrack.enabled = true
            setAudioTrackEnabled(true)
        }
    }

    function toggleVideoTrack() {
        const videoTrack = streamRef.current.getTracks()[1]
        if (videoTrackEnabled) {
            videoTrack.enabled = false
            setVideoTrackEnabled(false)
        } else {
            videoTrack.enabled = true
            setVideoTrackEnabled(true)
        }
    }

    function findVideoSize() {
        let videoSize = styles.xl
        if (totalUsersStreaming > 2) videoSize = styles.lg
        if (totalUsersStreaming > 3) videoSize = styles.md
        if (totalUsersStreaming > 4) videoSize = styles.sm
        // if (totalUsersStreaming > 6) videoSize = styles.xs
        return videoSize
    }

    function createComment(e) {
        e.preventDefault()
        if (!loggedIn) {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create comments')
        } else if (newComment.length) {
            const data = {
                gameId,
                userId: accountData.id,
                text: newComment,
            }
            // save comment in db
            axios
                .post(`${config.apiURL}/glass-bead-game-comment`, data)
                .then(() => {
                    // singal comment to other users
                    const signalData = {
                        roomId: roomIdRef.current,
                        user: userRef.current,
                        text: newComment,
                        createdAt: new Date(),
                    }
                    socketRef.current.emit('sending-comment', signalData)
                    setNewComment('')
                })
                .catch((error) => console.log('error: ', error))
        }
    }

    function addComment(comment) {
        setComments((c) => [...c, comment.user ? comment : { text: comment }])
        scrollToLatestComment()
    }

    function startGameTimer(duration) {
        d3.selectAll('#game-timer').remove()
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'game-timer')
            .style('fill', '#1ee379')
            .style('opacity', 0.5)
            .attr('d', gameArc)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration * 1000)
            .attrTween('d', (d) => {
                const interpolate = d3.interpolate(d.endAngle, 0)
                return (t) => {
                    d.endAngle = interpolate(t)
                    return gameArc(d)
                }
            })
    }

    function startTurnTimer(duration) {
        d3.selectAll('#turn-timer').remove()
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'turn-timer')
            .style('fill', '#1ee379')
            .style('opacity', 0.7)
            .attr('d', turnArc)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration * 1000)
            .attrTween('d', (d) => {
                const interpolate = d3.interpolate(d.endAngle, 0)
                return (t) => {
                    d.endAngle = interpolate(t)
                    return turnArc(d)
                }
            })
    }

    function startMoveTimer(duration, colour) {
        d3.selectAll('#move-timer').remove()
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'move-timer')
            .style('fill', colour)
            .attr('d', moveArc)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration * 1000)
            .attrTween('d', (d) => {
                const interpolate = d3.interpolate(d.endAngle, 0)
                return (t) => {
                    d.endAngle = interpolate(t)
                    return moveArc(d)
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

    function startGame(gameData) {
        setPlayers(gameData.players)
        setIntroDuration(gameData.introDuration)
        setNumberOfTurns(gameData.numberOfTurns)
        setMoveDuration(gameData.moveDuration)
        setIntervalDuration(gameData.intervalDuration)
        // update canvas text
        const firstPlayer = gameData.players[0]
        // const firstPlayerName =
        //     firstPlayer.socketId === socketIdRef.current ? 'You' : firstPlayer.name
        // d3.select('#turn-text').text('Intro')
        // d3.select('#player-text').text(`Next player: ${firstPlayerName}`)
        d3.select('#timer-seconds').text(gameData.introDuration)
        d3.select(`#player-${firstPlayer.socketId}`).classed(styles.recordingNext, true)
        // start intro timer
        startMoveTimer(gameData.introDuration, '#1ee379')
        let timeLeft = gameData.introDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            d3.select('#timer-seconds').text(timeLeft)
            if (timeLeft === 0) {
                clearInterval(secondsTimerRef.current)
                startMove(1, 0, firstPlayer, gameData)
            }
        }, 1000)
    }

    function startMove(moveNumber, turnNumber, player, gameData) {
        const yourMove = player.socketId === socketIdRef.current
        if (yourMove) startAudioRecording(moveNumber)
        if (moveNumber === 1) {
            const gameDuration =
                gameData.turnDuration * gameData.numberOfTurns - gameData.intervalDuration
            startGameTimer(gameDuration)
        }
        const newTurnNumber = Math.ceil(moveNumber / gameData.players.length)
        const previousTurnMoves = (newTurnNumber - 1) * gameData.players.length
        setMoveInTurn(moveNumber - previousTurnMoves)
        if (turnNumber !== newTurnNumber) {
            setTurn(newTurnNumber)
            const lastTurnDuration = gameData.turnDuration - gameData.intervalDuration
            startTurnTimer(
                newTurnNumber === gameData.numberOfTurns ? lastTurnDuration : gameData.turnDuration
            )
        }
        // update canvas text
        // d3.select('#timer-seconds').text(gameData.moveDuration)
        // d3.select('#turn-text').text(`Turn ${turnNumber}`)
        // // d3.select('#move-text').text(`Move ${moveNumber}`)
        // d3.select('#player-text').text(`Player: ${yourMove ? 'You' : player.name}`)
        d3.selectAll(`.${styles.recordingFlag}`).classed(styles.recordingNext, false)
        d3.selectAll(`.${styles.recordingFlag}`).classed(styles.recording, false)
        d3.select(`#player-${player.socketId}`).classed(styles.recording, true)
        // start timer
        startMoveTimer(gameData.moveDuration, '#4493ff')
        let timeLeft = gameData.moveDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            // d3.select('#timer-seconds').text(timeLeft)
            if (timeLeft === 0) {
                clearInterval(secondsTimerRef.current)
                if (yourMove) mediaRecorderRef.current.stop()
                if (moveNumber < gameData.numberOfTurns * gameData.players.length) {
                    // end turn
                    startInterval(moveNumber, newTurnNumber, player, gameData)
                } else {
                    // end game
                    // d3.select('#turn-text').text('')
                    // d3.select('#player-text').text('')
                    setGameInProgress(false)
                    // gameInProgressRef.current = false
                    addComment('The game ended')
                }
            }
        }, 1000)
    }

    function startInterval(moveNumber, turnNumber, player, gameData) {
        // calculate next player
        const previousPlayerIndex = gameData.players.findIndex(
            (p) => p.socketId === player.socketId
        )
        const endOfTurn = previousPlayerIndex === gameData.players.length - 1
        const nextPlayer = endOfTurn
            ? gameData.players[0]
            : gameData.players[previousPlayerIndex + 1]
        // update canvas text
        // const nextPlayerName = nextPlayer.socketId === socketIdRef.current ? 'You' : nextPlayer.name
        // d3.select('#turn-text').text('Interval')
        // d3.select('#player-text').text(`Next player: ${nextPlayerName}`)
        // d3.select('#timer-seconds').text(gameData.intervalDuration)
        d3.selectAll(`.${styles.recordingFlag}`).classed(styles.recording, false)
        d3.select(`#player-${nextPlayer.socketId}`).classed(styles.recordingNext, true)
        // start interval timer
        startMoveTimer(gameData.intervalDuration, '#1ee379')
        let timeLeft = gameData.intervalDuration
        secondsTimerRef.current = setInterval(() => {
            timeLeft -= 1
            d3.select('#timer-seconds').text(timeLeft)
            if (timeLeft === 0) {
                clearInterval(secondsTimerRef.current)
                startMove(moveNumber + 1, turnNumber, nextPlayer, gameData)
            }
        }, 1000)
    }

    function stopGame() {
        const data = {
            roomId: roomIdRef.current,
            signaller: userRef.current,
        }
        socketRef.current.emit('sending-stop-game', data)
    }

    // function saveGame() {
    //     const gameData = {
    //         gameId,
    //         numberOfTurns,
    //         moveDuration,
    //         introDuration,
    //         intervalDuration,
    //         numberOfPlayers,
    //         beads,
    //     }
    //     axios.post(`${config.apiURL}/save-glass-bead-game`, gameData).then((res) => {
    //         if (res.data === 'game-saved') setLocked(true)
    //     })
    // }

    function signalStartGame(e) {
        e.preventDefault()
        // validate settings
        const invalidNumberOfTurns = newNumberOfTurns < 1 || newNumberOfTurns > 20
        const invalidMoveDuration = newMoveDuration < 10 || newMoveDuration > 600
        const invalidIntroDuration = newIntroDuration < 10 || newIntroDuration > 60
        const invalidIntervalDuration = newIntervalDuration < 10 || newIntervalDuration > 60
        const invalidPlayers = players.length < 1 || players.length > 20
        setNewNumberOfTurnsState(invalidNumberOfTurns ? 'invalid' : 'valid')
        setNewNumberOfTurnsErrors(invalidNumberOfTurns ? ['Must be between 1 and 20 turns'] : [])
        setNewMoveDurationState(invalidMoveDuration ? 'invalid' : 'valid')
        setNewMoveDurationErrors(
            invalidMoveDuration ? ['Must be between 10 seconds and 10 minutes'] : []
        )
        setNewIntroDurationState(invalidIntroDuration ? 'invalid' : 'valid')
        setNewIntroDurationErrors(
            invalidIntroDuration ? ['Must be between 10 seconds and 1 minute'] : []
        )
        setNewIntervalDurationState(invalidIntervalDuration ? 'invalid' : 'valid')
        setNewIntervalDurationErrors(
            invalidIntervalDuration ? ['Must be between 10 seconds and 1 minute'] : []
        )
        setInvalidPlayersError(invalidPlayers)
        // if all valid
        if (
            !invalidNumberOfTurns &&
            !invalidMoveDuration &&
            !invalidIntroDuration &&
            !invalidIntervalDuration &&
            !invalidPlayers
        ) {
            setLoading(true)
            // save new settings in local state
            setIntroDuration(newIntroDuration)
            setNumberOfTurns(newNumberOfTurns)
            setMoveDuration(newMoveDuration)
            setIntervalDuration(newIntervalDuration)
            // save new settings in db
            const data = {
                gameId,
                numberOfTurns: newNumberOfTurns,
                moveDuration: newMoveDuration,
                introDuration: newIntroDuration,
                intervalDuration: newIntervalDuration,
                playerOrder: players.map((p) => p.id).join(','),
            }
            axios
                .post(`${config.apiURL}/save-glass-bead-game-settings`, data)
                .then(() => {
                    setLoading(false)
                    setSettingsSaved(true)
                    const signalData = {
                        roomId: roomIdRef.current,
                        signaller: userRef.current,
                        gameData: {
                            players,
                            introDuration: newIntroDuration,
                            numberOfTurns: newNumberOfTurns,
                            moveDuration: newMoveDuration,
                            intervalDuration: newIntervalDuration,
                            turnDuration: players.length * (newMoveDuration + newIntervalDuration),
                        },
                    }
                    socketRef.current.emit('sending-start-game', signalData)
                    closeGameSettingsModal()
                })
                .catch((error) => console.log(error))
        }
    }

    function closeGameSettingsModal() {
        setGameSettingsModalOpen(false)
        setSettingsSaved(false)
        setNewNumberOfTurns(numberOfTurns)
        setNewNumberOfTurnsState('default')
        setNewNumberOfTurnsErrors([])
        setNewMoveDuration(moveDuration)
        setNewMoveDurationState('default')
        setNewMoveDurationErrors([])
        setNewIntroDuration(introDuration)
        setNewIntroDurationState('default')
        setNewIntroDurationErrors([])
        setNewIntervalDuration(intervalDuration)
        setNewIntervalDurationState('default')
        setNewIntervalDurationErrors([])
        setInvalidPlayersError(false)
    }

    function updatePlayerPosition(from, to) {
        const fromIndex = from - 1
        const toIndex = to - 1
        const newPlayers = [...players]
        const player = newPlayers[fromIndex]
        newPlayers.splice(fromIndex, 1)
        newPlayers.splice(toIndex, 0, player)
        setPlayers(newPlayers)
    }

    // todo: flatten out userData into user object with socketId
    useEffect(() => {
        if (!accountDataLoading && postData.id) {
            getGameData()
            // set roomIdRef and userRef
            roomIdRef.current = postData.id
            userRef.current = {
                // todo: store socketId as well
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
            // room joined
            socketRef.current.on('room-joined', (payload) => {
                const { socketId, usersInRoom } = payload
                socketIdRef.current = socketId
                usersRef.current = usersInRoom
                usersInRoom.forEach((user) => {
                    // if not you
                    if (user.socketId !== socketIdRef.current) {
                        // create peer connection
                        const peer = new Peer({
                            initiator: true,
                            // trickle: false,
                            config: {
                                iceServers: [
                                    { urls: 'stun:stun.l.google.com:19302' },
                                    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                                    {
                                        urls: 'turn:relay.backups.cz?transport=tcp',
                                        credential: 'webrtc',
                                        username: 'webrtc',
                                    },
                                ],
                            },
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
                                userData: user.userData,
                                peer,
                            })
                            addComment(`${user.userData.name}'s video connected`)
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
                peerObject.peer.signal(payload.signal)
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
                        // trickle: false,
                        config: {
                            iceServers: [
                                { urls: 'stun:stun.l.google.com:19302' },
                                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                                {
                                    urls: 'turn:relay.backups.cz?transport=tcp',
                                    credential: 'webrtc',
                                    username: 'webrtc',
                                },
                            ],
                        },
                    })
                    peer.on('signal', (data) => {
                        socketRef.current.emit('returning-signal', {
                            signal: data,
                            callerID: socketId,
                        })
                    })
                    peer.on('stream', (stream) => {
                        videosRef.current.push({ socketId, userData, peer })
                        addComment(`${userData.name}'s video connected`)
                        const video = document.getElementById(socketId) as HTMLVideoElement
                        video.srcObject = stream
                        const newPlayer = {
                            id: userData.id,
                            name: userData.name,
                            flagImagePath: userData.flagImagePath,
                            socketId,
                        }
                        setPlayers((previousPlayers) => [...previousPlayers, newPlayer])
                    })
                    peer.signal(signal)
                    peersRef.current.push({ socketId, userData, peer })
                }
            })
            // user joined room
            socketRef.current.on('user-joined', (user) => {
                usersRef.current.push(user)
                addComment(`${user.userData.name} joined the room`)
            })
            // user left room
            socketRef.current.on('user-left', (user) => {
                const { socketId, userData } = user
                usersRef.current = usersRef.current.filter((u) => u.socketId !== socketId)
                peersRef.current = peersRef.current.filter((p) => p.socketId !== socketId)
                videosRef.current = videosRef.current.filter((v) => v.socketId !== socketId)
                addComment(`${userData.name} left the room`)
            })
            // comment recieved
            socketRef.current.on('returning-comment', (data) => {
                addComment(data)
            })
            // start game signal recieved
            socketRef.current.on('returning-start-game', (data) => {
                addComment(`${data.signaller.name} started the game`)
                setGameInProgress(true)
                // gameInProgressRef.current = true
                setBeads([])
                startGame(data.gameData)
            })
            // stop game signal recieved
            socketRef.current.on('returning-stop-game', (data) => {
                addComment(`${data.signaller.name} stopped the game`)
                setGameInProgress(false)
                clearInterval(secondsTimerRef.current)
                d3.select('#timer-path').remove()
                d3.select('#timer-seconds').text(0)
                // d3.select('#turn-text').text('')
                // d3.select('#player-text').text('')
                setMoveInTurn(0)
                setTurn(0)
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording')
                    mediaRecorderRef.current.stop()
            })
            // audio bead recieved
            socketRef.current.on('returning-audio-bead', (data) => {
                setBeads((b) => [...b, data])
                d3.select(`#bead-${data.index}`).select('audio').attr('src', data.beadUrl)
                d3.select(`#bead-${data.index}`).select('p').text(data.userData.name)
            })
            // stream disconnected
            socketRef.current.on('stream-disconnected', (data) => {
                videosRef.current = videosRef.current.filter((v) => v.socketId !== data.socketId)
                setPlayers((p) => [...p.filter((pl) => pl.socketId !== data.socketId)])
                addComment(`${data.userData.name}'s stream disconnected`)
            })
        }
        return () => (postDataLoading ? null : socketRef.current.disconnect())
    }, [accountDataLoading, postData.id])

    useEffect(() => {
        // create svg
        d3.select('#timer')
            .append('svg')
            .attr('id', 'timer-svg')
            .attr('width', gameArcRadius * 2)
            .attr('height', gameArcRadius * 2)

        // create timer group
        d3.select('#timer-svg')
            .append('g')
            .attr('id', 'timer-group')
            .attr('transform', `translate(${gameArcRadius},${gameArcRadius})`)

        // create game arc background
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'game-arc-background')
            .style('fill', '#000')
            .style('opacity', 0.06)
            .attr('d', gameArc)

        // create turn arc background
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'turn-arc-background')
            .style('fill', '#000')
            .style('opacity', 0.13)
            .attr('d', turnArc)

        // create move arc background
        d3.select('#timer-group')
            .append('path')
            .datum({ startAngle: 0, endAngle: 2 * Math.PI })
            .attr('id', 'move-arc-background')
            .style('fill', '#000')
            .style('opacity', 0.2)
            .attr('d', moveArc)

        // // create timer seconds
        // d3.select('#timer-svg')
        //     .append('text')
        //     .text(0)
        //     .attr('id', 'timer-seconds')
        //     .attr('font-size', 24)
        //     .attr('opacity', 0.5)
        //     .attr('text-anchor', 'middle')
        //     .attr('y', -120)
        //     .attr('x', 0)
        //     .attr('transform', `translate(${moveArcRadius},${moveArcRadius})`)
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={`${styles.comments} hide-scrollbars`}>
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
                </div>
                <div className={styles.centerPanel}>
                    <div className={styles.gameControls}>
                        {gameInProgress ? (
                            <>
                                <Button
                                    text='Stop game'
                                    colour='red'
                                    size='medium'
                                    margin='0 0 10px 0'
                                    onClick={stopGame}
                                />
                                <p>
                                    Turn {turn} / {numberOfTurns}
                                </p>
                                {/* <p>
                                    Move {moveInTurn} / {players.length}
                                </p> */}
                                {/* <p>Players</p> */}
                                {players.map((player, index) => (
                                    <Row margin='10px 0 0 0' centerX key={player.socketId}>
                                        <div className={styles.position}>{index + 1}</div>
                                        <ImageTitle
                                            type='user'
                                            imagePath={player.flagImagePath}
                                            title={
                                                player.socketId === socketIdRef.current
                                                    ? 'You'
                                                    : player.name
                                            }
                                            fontSize={16}
                                            imageSize={35}
                                        />
                                        <div
                                            id={`player-${player.socketId}`}
                                            className={styles.recordingFlag}
                                        />
                                    </Row>
                                ))}
                            </>
                        ) : (
                            <>
                                <Button
                                    text={`${
                                        userIsStreaming ? 'Disconnect' : 'Connect'
                                    } audio/video`}
                                    colour={userIsStreaming ? 'red' : 'grey'}
                                    size='medium'
                                    margin='0 0 10px 0'
                                    onClick={toggleStream}
                                />
                                <Button
                                    text='Start game'
                                    colour='grey'
                                    size='medium'
                                    margin='0 0 10px 0'
                                    // icon={<SlidersIconSVG />}
                                    onClick={() => setGameSettingsModalOpen(true)}
                                />
                            </>
                        )}
                        {gameSettingsModalOpen && (
                            <Modal close={() => closeGameSettingsModal()} centered>
                                <h1>Game settings</h1>
                                <p>
                                    Players must connect their audio/video to participate in the
                                    game
                                </p>
                                <form onSubmit={signalStartGame}>
                                    <Row margin='10px 0 30px 0'>
                                        <Column margin='0 60px 0 0'>
                                            <Input
                                                title='Intro duration (seconds)'
                                                type='text'
                                                margin='0 0 10px 0'
                                                state={newIntroDurationState}
                                                errors={newIntroDurationErrors}
                                                value={newIntroDuration}
                                                onChange={(v) => {
                                                    setNewIntroDurationState('default')
                                                    setNewIntroDuration(+v.replace(/\D/g, ''))
                                                }}
                                            />
                                            <Input
                                                title='Number of turns'
                                                type='text'
                                                margin='0 0 10px 0'
                                                state={newNumberOfTurnsState}
                                                errors={newNumberOfTurnsErrors}
                                                value={newNumberOfTurns}
                                                onChange={(v) => {
                                                    setNewNumberOfTurnsState('default')
                                                    setNewNumberOfTurns(+v.replace(/\D/g, ''))
                                                }}
                                            />
                                            <Input
                                                title='Move duration (seconds)'
                                                type='text'
                                                margin='0 0 10px 0'
                                                state={newMoveDurationState}
                                                errors={newMoveDurationErrors}
                                                value={newMoveDuration}
                                                onChange={(v) => {
                                                    setNewMoveDurationState('default')
                                                    setNewMoveDuration(+v.replace(/\D/g, ''))
                                                }}
                                            />
                                            <Input
                                                title='Interval duration (seconds)'
                                                type='text'
                                                margin='0 0 10px 0'
                                                // disabled={loading || settingsSaved}
                                                state={newIntervalDurationState}
                                                errors={newIntervalDurationErrors}
                                                value={newIntervalDuration}
                                                onChange={(v) => {
                                                    setNewIntervalDurationState('default')
                                                    setNewIntervalDuration(+v.replace(/\D/g, ''))
                                                }}
                                            />
                                        </Column>
                                        <Column margin='0 60px 0 0'>
                                            <h2>Player order</h2>
                                            {players.map((player, index) => (
                                                <PlayerPosition
                                                    you={player.socketId === socketIdRef.current}
                                                    totalPlayers={players.length}
                                                    position={index + 1}
                                                    updatePosition={updatePlayerPosition}
                                                    // setPosition={setPlayerPosition}
                                                    socketId={player.socketId}
                                                    name={player.name}
                                                    flagImagePath={player.flagImagePath}
                                                />
                                            ))}
                                            {!players.length && (
                                                <p className={styles.noUsersConnected}>
                                                    No users connected...
                                                </p>
                                            )}
                                            {invalidPlayersError && (
                                                <p className={styles.error}>
                                                    At least one player must connect their
                                                    audio/video
                                                </p>
                                            )}
                                        </Column>
                                    </Row>
                                    <Row>
                                        {!settingsSaved && (
                                            <Button
                                                text='Start game'
                                                colour='blue'
                                                size='medium'
                                                disabled={loading}
                                                submit
                                            />
                                        )}
                                        {loading && <LoadingWheel />}
                                        {settingsSaved && <SuccessMessage text='Saved' />}
                                    </Row>
                                </form>
                            </Modal>
                        )}
                    </div>
                    <Column centerX>
                        <h1>{topic}</h1>
                        <div className={styles.topic}>
                            <img src={`/images/archetopics/${topic.toLowerCase()}.png`} alt='' />
                        </div>
                        <div id='timer' className={styles.timer}>
                            <div className={styles.timerArcTitles}>
                                <p>Game</p>
                                <p>Turn</p>
                                <p>Move</p>
                            </div>
                            <div className={styles.moveCard}>
                                <img src='/icons/gbg/sound-wave.png' alt='' />
                            </div>
                        </div>
                    </Column>
                    <div className={`${styles.peopleInRoom} hide-scrollbars`}>
                        <div>
                            <p>
                                {usersRef.current.length}{' '}
                                {isPlural(usersRef.current.length) ? 'people' : 'person'} in room
                            </p>
                            {usersRef.current.map((user) => (
                                <ImageTitle
                                    key={user.socketId}
                                    type='user'
                                    imagePath={user.userData.flagImagePath}
                                    title={
                                        user.socketId === socketIdRef.current
                                            ? 'You'
                                            : user.userData.name
                                    }
                                    fontSize={16}
                                    imageSize={40}
                                    margin='0 0 10px 0'
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`${styles.videos} hide-scrollbars`}>
                    {userIsStreaming && (
                        <Video
                            mainUser
                            size={findVideoSize()}
                            audioEnabled={audioTrackEnabled}
                            videoEnabled={videoTrackEnabled}
                            toggleAudio={toggleAudioTrack}
                            toggleVideo={toggleVideoTrack}
                        />
                    )}
                    {videosRef.current.map((video) => {
                        return <Video key={video.socketId} video={video} size={findVideoSize()} />
                    })}
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
