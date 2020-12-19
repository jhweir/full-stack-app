import React from 'react'
import styles from '../../../styles/components/PostCardRepostPreview.module.scss'
import SmallFlagImage from '../../SmallFlagImage'

function PostCardRepostPreview(props) {
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
                        <div className={`${styles.modalItemText} greyText mr-10`}>to</div>
                        <SmallFlagImage type='space' size={25} imagePath={reaction.space.flagImagePath}/>
                        <span className={styles.text}>{reaction.space.name}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCardRepostPreview
