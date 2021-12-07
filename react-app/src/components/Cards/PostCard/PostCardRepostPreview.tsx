import React from 'react'
import styles from '@styles/components/PostCardRepostPreview.module.scss'
import FlagImage from '@components/FlagImage'

const PostCardRepostPreview = (props: { reactions: any[] }): JSX.Element => {
    const { reactions } = props

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.pointerWrapper}>
                    <div className={styles.pointer} />
                </div>
                {reactions &&
                    reactions.map((reaction) => (
                        <div className={styles.modalItem} key={reaction}>
                            <FlagImage
                                type='user'
                                size={25}
                                imagePath={reaction.creator.flagImagePath}
                            />
                            <span className={styles.text}>{reaction.creator.name}</span>
                            <div className={`${styles.modalItemText} greyText mr-10`}>to</div>
                            <FlagImage
                                type='space'
                                size={25}
                                imagePath={reaction.space.flagImagePath}
                            />
                            <span className={styles.text}>{reaction.space.name}</span>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default PostCardRepostPreview
