/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import * as d3 from 'd3'
import { v4 as uuidv4 } from 'uuid'
import styles from '../styles/components/DecisionTree.module.scss'
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

const DecisionTree = (): JSX.Element => {
    const { accountData } = useContext(AccountContext)
    const { postContextLoading, getPostData, postData } = useContext(PostContext)

    const [peers, setPeers] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState('')

    // const width = 500
    // const height = 800

    const roomIdRef = useRef<number>()
    const socketRef = useRef<any>(null)
    const userRef = useRef<any>({})
    const userVideo = useRef<any>(null)
    const peersRef = useRef<any[]>([])

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

    // connect video and peers
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

    // function autoBox() {
    //     document.body.appendChild(this)
    //     const { x, y, width, height } = this.getBBox()
    //     document.body.removeChild(this)
    //     return [x, y, width, height]
    // }

    useEffect(() => {
        //     const root = tree(data)
        //     const svg = d3.create('svg')
        //     svg.append('g')
        //         .attr('fill', 'none')
        //         .attr('stroke', '#555')
        //         .attr('stroke-opacity', 0.4)
        //         .attr('stroke-width', 1.5)
        //         .selectAll('path')
        //         .data(root.links())
        //         .join('path')
        //         .attr(
        //             'd',
        //             d3
        //                 .linkRadial()
        //                 .angle((d) => d.x)
        //                 .radius((d) => d.y)
        //         )
        //     svg.append('g')
        //         .selectAll('circle')
        //         .data(root.descendants())
        //         .join('circle')
        //         .attr(
        //             'transform',
        //             (d) => `
        //     rotate(${(d.x * 180) / Math.PI - 90})
        //     translate(${d.y},0)
        //   `
        //         )
        //         .attr('fill', (d) => (d.children ? '#555' : '#999'))
        //         .attr('r', 2.5)
        //     svg.append('g')
        //         .attr('font-family', 'sans-serif')
        //         .attr('font-size', 10)
        //         .attr('stroke-linejoin', 'round')
        //         .attr('stroke-width', 3)
        //         .selectAll('text')
        //         .data(root.descendants())
        //         .join('text')
        //         .attr(
        //             'transform',
        //             (d) => `
        //     rotate(${(d.x * 180) / Math.PI - 90})
        //     translate(${d.y},0)
        //     rotate(${d.x >= Math.PI ? 180 : 0})
        //   `
        //         )
        //         .attr('dy', '0.31em')
        //         .attr('x', (d) => (d.x < Math.PI === !d.children ? 6 : -6))
        //         .attr('text-anchor', (d) => (d.x < Math.PI === !d.children ? 'start' : 'end'))
        //         .text((d) => d.data.name)
        //         .clone(true)
        //         .lower()
        //         .attr('stroke', 'white')
        //     return svg.attr('viewBox', autoBox).node()
        // // create svg
        // d3.select('#tree')
        //     .append('svg')
        //     .attr('id', 'tree-svg')
        //     .attr('width', width)
        //     .attr('height', height)
        // d3.select('#tree-svg')
        //     .append('circle')
        //     .attr('id', 'first-node')
        //     .attr('r', 100)
        //     .attr('fill', 'white')
        //     .attr('stroke-width', 3)
        //     .attr('stroke', 'black')
        //     .attr('transform', `translate(${width / 2},${height / 2})`)
        //     .style('cursor', 'pointer')
        // attempt 1
        // const margins = { top: 20, bottom: 300, left: 30, right: 100 }
        // const height = 600
        // const width = 900
        // const totalWidth = width + margins.left + margins.right
        // const totalHeight = height + margins.top + margins.bottom
        // const svg = d3
        //     .select('#tree')
        //     .append('svg')
        //     .attr('width', totalWidth)
        //     .attr('height', totalHeight)
        // const graphGroup = svg
        //     .append('g')
        //     .attr('transform', `translate(${width / 2 - margins.left},${height / 2 - margins.top})`)
        // const root = {
        //     name: 'Araneae',
        //     children: [
        //         {
        //             name: 'Agelenidae',
        //             children: [
        //                 { name: 'Hobo Spider' },
        //                 { name: 'Giant House Spider' },
        //                 { name: 'Domestic House Spider' },
        //                 { name: 'Dust Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Araneidae',
        //             children: [
        //                 { name: 'Grass Spider' },
        //                 { name: 'Cross Orb Weaver' },
        //                 { name: 'Banded Garden Spider' },
        //                 { name: 'Golden Orb Weaver Spider' },
        //                 { name: 'Long-Jawed Orb Weaver Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Ctenidae',
        //             children: [{ name: 'Brazilian Wandering Spider' }, { name: 'Fishing Spider' }],
        //         },
        //         {
        //             name: 'Desidae',
        //             children: [
        //                 { name: 'Black House Spider' },
        //                 { name: 'Brown House Spider' },
        //                 { name: 'Hollow Twig Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Filistatidae',
        //             children: [
        //                 { name: 'Southern House Spider' },
        //                 { name: 'Arizona Black Hole Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Lycosidae',
        //             children: [
        //                 { name: 'Carolina Wolf Spider' },
        //                 { name: 'Brown Wolf Spider' },
        //                 { name: 'Texas Wolf Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Pholcidae',
        //             children: [
        //                 { name: 'Cellar Spider' },
        //                 { name: 'Yellow Sac Spider' },
        //                 { name: 'Ground Spider' },
        //                 { name: 'Banded Garden Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Salticidae',
        //             children: [
        //                 { name: 'Bold Jumping Spider' },
        //                 { name: 'Zebra Jumping Spider' },
        //                 { name: 'Gray Wall Jumping Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Sicariidae',
        //             children: [{ name: 'Brown Spider' }, { name: 'Brown Recluse Spider' }],
        //         },
        //         {
        //             name: 'Theraphosidae',
        //             children: [
        //                 { name: 'King Baboon Spider' },
        //                 { name: 'Bird Eating Spider' },
        //                 { name: 'Pinktoe Tarantula Spider' },
        //                 { name: 'Indian Ornamental Tree Spider' },
        //             ],
        //         },
        //         {
        //             name: 'Theridiidae',
        //             children: [
        //                 { name: 'Black Widow Spider' },
        //                 { name: 'Brown Widow Spider' },
        //                 { name: 'Red Widow Spider' },
        //             ],
        //         },
        //     ],
        // }
        // function radialPoint(x, y) {
        //     // returns radial projections of a point coordinates
        //     return [
        //         parseFloat(((y = +y) * Math.cos((x -= Math.PI / 2))).toString()).toFixed(4),
        //         parseFloat((y * Math.sin(x)).toString()).toFixed(4),
        //     ]
        // }
        // const diameter = 760
        // const hierTree = d3
        //     .tree()
        //     .size([360, diameter / 2 - 190])
        //     .separation(function (a, b) {
        //         return (a.parent === b.parent ? 1 : 2) / a.depth
        //     })
        // const diagonal = function link(d) {
        //     return `M${d.x},${d.y}C${(d.x + d.parent.x) / 2},${d.y} ${(d.x + d.parent.x) / 2},${
        //         d.parent.y
        //     } ${d.parent.x},${d.parent.y}`
        // }
        // const treeRoot = d3.hierarchy(root, function (d) {
        //     // creates a hierarchy from data read
        //     return d.children
        // })
        // const treeData = hierTree(treeRoot)
        // //    var treeData = d3.tree(treeRoot)
        // const nodes = treeData.descendants()
        // const links = nodes.slice(1)
        // const link = graphGroup
        //     .selectAll('.link')
        //     .data(links)
        //     .enter()
        //     .append('line')
        //     .attr('class', 'link')
        //     .attr('fill', 'none')
        //     .attr('stroke', '#365CB7')
        //     .attr('stroke-width', 0.8)
        //     .attr('x1', function (d) {
        //         return radialPoint(d.x, d.y)[0]
        //     })
        //     .attr('y1', function (d) {
        //         return radialPoint(d.x, d.y)[1]
        //     })
        //     .attr('x2', function (d) {
        //         return radialPoint(d.parent.x, d.parent.y)[0]
        //     })
        //     .attr('y2', function (d) {
        //         return radialPoint(d.parent.x, d.parent.y)[1]
        //     })
        // const node = graphGroup
        //     .selectAll('.node')
        //     .data(nodes)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'node')
        //     .attr('transform', function (d) {
        //         return `translate(${radialPoint(d.x, d.y)})`
        //     })
        // node.append('circle').attr('r', 5)
        // node.append('text')
        //     .attr('dy', '.31em')
        //     .attr('text-anchor', function (d) {
        //         return d.x > 0 && d.x < 180 ? 'start' : 'end'
        //     })
        //     .attr('transform', function (d) {
        //         return d.x < 180 ? 'translate(8)' : 'translate(-8)'
        //     })
        //     .text(function (d) {
        //         return d.data.name
        //     })
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
                    <div id='tree' />
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
        </div>
    )
}

export default DecisionTree
