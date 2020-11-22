import React from 'react'
import styles from '../../../styles/components/PostCardLikePreview.module.scss'
import SmallFlagImage from '../../SmallFlagImage'

function PostCardLikePreview(props) {
    const { reactions } = props

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.pointerWrapper}>
                    <div className={styles.pointer}/>
                </div>
                {reactions && reactions.map((reaction, index) =>
                    <div className={styles.modalItem} key={index}>
                        <SmallFlagImage type='user' size={25} imagePath={reaction.creator.flagImagePath}/>
                        <span className={styles.text}>{reaction.creator.name}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCardLikePreview
