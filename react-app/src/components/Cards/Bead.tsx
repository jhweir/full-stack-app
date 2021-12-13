import React, { useContext, useEffect } from 'react'
import styles from '@styles/components/Bead.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import ImageTitle from '@components/ImageTitle'
import { ReactComponent as PlayIconSVG } from '@svgs/play-solid.svg'
import { ReactComponent as PauseIconSVG } from '@svgs/pause-solid.svg'

const Bead = (props: {
    postId: number
    bead: any
    index: number
    toggleAudio: (beadIndex: number) => void
}): JSX.Element => {
    const { postId, bead, index, toggleAudio } = props
    const { accountData } = useContext(AccountContext)

    useEffect(() => {
        const audio = document.getElementById(`${postId}-${index}`) as HTMLAudioElement
        audio.src = bead.beadUrl
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.bead}>
                <ImageTitle
                    type='user'
                    imagePath={bead.user.flagImagePath}
                    title={bead.user.id === accountData.id ? 'You' : bead.user.name}
                    fontSize={12}
                    imageSize={20}
                    style={{ marginRight: 10 }}
                />
                <img src='/icons/gbg/sound-wave.png' alt='sound-wave' />
                <div className={styles.beadControls}>
                    <button type='button' onClick={() => toggleAudio(index)}>
                        {bead.playing ? <PauseIconSVG /> : <PlayIconSVG />}
                    </button>
                </div>
                <audio id={`${postId}-${index}`}>
                    <track kind='captions' />
                </audio>
            </div>
        </div>
    )
}

export default Bead
