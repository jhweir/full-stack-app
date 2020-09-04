import React from 'react'
import styles from '../../../styles/components/PostCardLikePreview.module.scss'

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
                        {reaction.creator.flagImagePath
                            ? <img className={styles.image} src={reaction.creator.flagImagePath}/>
                            : <div className={styles.placeholderWrapper}>
                                <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                            </div>
                        }
                        <div className={`${styles.modalItemText} mr-10`}>{reaction.creator.name}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCardLikePreview
