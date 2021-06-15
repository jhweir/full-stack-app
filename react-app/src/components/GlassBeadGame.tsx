import React, { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
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
                    // outline
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

    const [peers, setPeers] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')

    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const userRef = useRef<any>({})
    const userVideo = useRef<any>(null)
    const peersRef = useRef<any[]>([])
    const turns = [1, 2, 3, 4, 5]

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
                            const peer = createPeer(user.socketId, stream) // (user.socketId, socketRef.current.id, stream)
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

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={styles.leftPanel}>
                    <div className={styles.comments} id='comments'>
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
                            className={styles.textButton}
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
                    <img src='/icons/gbg/gift.png' alt='gift' className={styles.giftIcon} />
                    <div className={styles.activeTurn}>
                        <img
                            src='/icons/gbg/sound-wave.png'
                            alt='sound-wave'
                            className={styles.soundWaveIcon}
                        />
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.videos}>
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
