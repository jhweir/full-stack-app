import React from 'react'
import styles from '../../../styles/components/PostCardLikePreview.module.scss'
import FlagImage from '@components/FlagImage'

const PostCardLikePreview = (props: { reactions: any[] }): JSX.Element => {
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
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default PostCardLikePreview
