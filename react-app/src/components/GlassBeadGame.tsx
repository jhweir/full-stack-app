import React, { useState, useEffect, useContext, useRef } from 'react'
import { io } from 'socket.io-client'
import styles from '../styles/components/GlassBeadGame.module.scss'
import { PostContext } from '../contexts/PostContext'
import { AccountContext } from '../contexts/AccountContext'
import SmallFlagImage from './SmallFlagImage'

const socket = io('ws://localhost:5001')

const GlassBeadGame = (): JSX.Element => {
    const { accountData } = useContext(AccountContext)
    const { postData } = useContext(PostContext)

    const [turns, setTurns] = useState(['1', '2', '3', '4', '5'])
    const [player1Message, setPlayer1Message] = useState('')
    const [player2Message, setPlayer2Message] = useState('')

    // const video1 = useRef<any>(null)

    function sendMessage1() {
        socket.emit('send-message', player1Message, postData.id)
    }

    function sendMessage2() {
        socket.emit('send-message', player2Message, postData.id)
    }

    useEffect(() => {
        socket.emit('join-room', postData.id, (callbackMessage) => {
            console.log(callbackMessage)
        })
        socket.on('relay-message', (message) => {
            console.log('relay-message: ', message)
        })

        const video = document.createElement('video')
        video.muted = true
        video.width = 300
        video.height = 300

        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                video.srcObject = stream
                video.addEventListener('loadedmetadata', () => {
                    video.play()
                })
                const videoWrapper = document.getElementById('video1')
                if (videoWrapper) videoWrapper.append(video)
                //
                // const video = <HTMLVideoElement>(video1Ref)
                // video1Ref.current && video1Ref.src = stream
            })
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={styles.leftPanel}>
                    <div className={styles.user}>
                        <p>Player 1</p>
                        <SmallFlagImage
                            type='user'
                            size={40}
                            imagePath={accountData.flagImagePath}
                        />
                    </div>

                    {/* <video ref={video1Ref} width='320' height='240' muted /> */}
                    <div id='video1' />

                    <div className={styles.textInputWrapper}>
                        <input
                            className={styles.textInput}
                            placeholder='text...'
                            value={player1Message}
                            onChange={(e) => {
                                setPlayer1Message(e.target.value)
                            }}
                        />
                        <div
                            className={styles.textButton}
                            role='button'
                            tabIndex={0}
                            onClick={sendMessage1}
                            onKeyDown={sendMessage1}
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
                    <div className={styles.user}>
                        <p>Player 2</p>
                        <SmallFlagImage
                            type='user'
                            size={40}
                            imagePath={accountData.flagImagePath}
                        />
                    </div>
                    <div className={styles.textInputWrapper}>
                        <input
                            className={styles.textInput}
                            placeholder='text...'
                            value={player2Message}
                            onChange={(e) => {
                                setPlayer2Message(e.target.value)
                            }}
                        />
                        <div
                            className={styles.textButton}
                            role='button'
                            tabIndex={0}
                            onClick={sendMessage2}
                            onKeyDown={sendMessage2}
                        >
                            Send
                        </div>
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
