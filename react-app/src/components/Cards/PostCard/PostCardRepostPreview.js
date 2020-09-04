import React from 'react'
import styles from '../../../styles/components/PostCardRepostPreview.module.scss'

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
                        {reaction.creator.flagImagePath
                            ? <img className={styles.image} src={reaction.creator.flagImagePath}/>
                            : <div className={styles.placeholderWrapper}>
                                <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                            </div>
                        }
                        <div className={`${styles.modalItemText} mr-5`}>{reaction.creator.name}</div>
                        <div className={`${styles.modalItemText} mr-10`}>to</div>
                        {reaction.space.flagImagePath
                            ? <img className={styles.image} src={reaction.space.flagImagePath}/>
                            : <div className={styles.placeholderWrapper}>
                                <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                            </div>
                        }
                        <div className={styles.modalItemText}>{reaction.space.name}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCardRepostPreview
