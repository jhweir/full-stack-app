import React, { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import * as d3 from 'd3'
import { v4 as uuidv4 } from 'uuid'
import styles from '../styles/components/GlassBeadGame.module.scss'
import { PostContext } from '../contexts/PostContext'
import { AccountContext } from '../contexts/AccountContext'
import SmallFlagImage from './SmallFlagImage'
import config from '../Config'

const Video = (props) => {
    const { peer, videoRef, mainUser, size } = props
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
            <video autoPlay playsInline muted={mainUser} ref={mainUser ? videoRef : ref}>
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

    const [numberOfTurns, setNumberOfTurns] = useState<number | undefined>(5)
    const [turnDuration, setTurnDuration] = useState<number | undefined>(5)
    const [timeLeftInTurn, setTimeLeftInTurn] = useState<number | undefined>(0)
    const [turnNumber, setTurnNumber] = useState<number | undefined>(0)
    const [gameInProgress, setGameInProgress] = useState(false)
    const [turns, setTurns] = useState<any[]>([])

    const timerWidth = 400

    const [peers, setPeers] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')

    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const userRef = useRef<any>({})
    const userVideo = useRef<any>(null)
    const peersRef = useRef<any[]>([])
    // const turns = []

    // interface IUser {
    //     accountId: number | null
    //     handle: string | null
    //     name: string | null
    //     flagImagePath: string | null
    //     socketId: string | null
    // }

    // interface IComment {
    //     text: string
    //     user: IUser | null
    // }

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

    function sendComment() {
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

    // connect video and peers using socket.io and simple-peer
    useEffect(() => {
        if (!postContextLoading && postData.id) {
            if (socketRef.current) socketRef.current.disconnect()
            socketRef.current = io(config.apiWebSocketURL || '')
            roomIdRef.current = postData.id
            userRef.current = {
                id: accountData.id,
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
                })
        }
        return () => (postContextLoading ? null : socketRef.current.disconnect())
    }, [postContextLoading, postData.id])

    const arc = d3
        .arc()
        .innerRadius(timerWidth / 2 - 30)
        .outerRadius(timerWidth / 2)
        .cornerRadius(5)

    // function startDelay() {
    //     startTurn(1)
    // }

    function startTurn(turn) {
        if (turnDuration && numberOfTurns) {
            setTurnNumber(turn)
            setTimeLeftInTurn(turnDuration)

            // start seconds timer
            let secondsLeft = turnDuration
            const secondsTimer = setInterval(() => {
                secondsLeft -= 1
                setTimeLeftInTurn(secondsLeft)
                if (secondsLeft === 0) {
                    setTurns((t) => [...t, 1])
                    // turns.push(1)
                    clearInterval(secondsTimer)
                    if (turn < numberOfTurns) startTurn(turn + 1)
                    else {
                        setTurnNumber(0)
                        setGameInProgress(false)
                    }
                }
            }, 1000)

            // start timer path transition
            d3.select('#timer-path').remove()
            d3.select('#timer-group')
                .append('path')
                .datum({ startAngle: 0, endAngle: 2 * Math.PI })
                .attr('id', 'timer-path')
                // .style('fill', 'rgb(130, 130, 130)')
                .attr('d', arc)

            d3.select('#timer-path')
                .transition()
                .ease(d3.easeLinear)
                .duration(turnDuration * 1000)
                .attrTween('d', (d) => {
                    const interpolate = d3.interpolate(d.endAngle, 0)
                    return (t) => {
                        d.endAngle = interpolate(t)
                        return arc(d)
                    }
                })
        }
    }

    function startGame() {
        if (turnDuration && !gameInProgress) {
            setGameInProgress(true)
            setTurns([])
            // startDelay()
            startTurn(1)
        }
    }

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
                                if (e.key === 'Enter') sendComment()
                            }}
                        />
                        <div
                            className={styles.button}
                            role='button'
                            tabIndex={0}
                            onClick={sendComment}
                            onKeyDown={sendComment}
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
                            <p className='mr-10'>Turn duration (seconds)</p>
                            <input
                                type='number'
                                className={styles.numberInput}
                                value={turnDuration || undefined}
                                onChange={(e) => {
                                    setTurnDuration(+e.target.value)
                                }}
                            />
                            <div
                                className={`${styles.button} mr-10`}
                                role='button'
                                tabIndex={0}
                                onClick={startGame}
                                onKeyDown={startGame}
                            >
                                Start game
                            </div>
                        </div>
                        <div>
                            <p className='mr-20'>
                                Turn: {turnNumber}/{numberOfTurns}
                            </p>
                            <p className='mr-10'>Time left in turn: {timeLeftInTurn} seconds</p>
                        </div>
                    </div>
                    <img src='/icons/gbg/gift.png' alt='gift' className={styles.giftIcon} />
                    <div id='timer' />
                    {/* <div className={styles.activeTurn}>
                        <img
                            src='/icons/gbg/sound-wave.png'
                            alt='sound-wave'
                            className={styles.soundWaveIcon}
                        />
                    </div> */}
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
                        <div className={styles.turn}>
                            <img
                                src='/icons/gbg/sound-wave.png'
                                alt='sound-wave'
                                className={styles.soundWaveIconSmall}
                            />
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
