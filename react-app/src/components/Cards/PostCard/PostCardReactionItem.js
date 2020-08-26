import React from 'react'
import styles from '../../../styles/components/PostCardReactionItem.module.scss'

function PostCardReactionItem(props) {
    const {
        reactions,
        text,
        previewOpen,
        setPreviewOpen,
        accountReaction,
        totalReactions,
        iconPath,
        onClick
    } = props

    return (
        <div className={styles.item}
            onMouseOver={() => setPreviewOpen(true)}
            onMouseOut={() => setPreviewOpen(false)}
            onClick={() => onClick()}>
            <img
                className={`${styles.postIcon} ${accountReaction > 0 && styles.selected}`}
                src={`/icons/${iconPath}`} alt=''
            />
            <div>{totalReactions} {text}</div>
            {previewOpen && totalReactions > 0 &&
                <div className={styles.modal}>
                    {reactions.map((reaction, index) =>
                        <div className={styles.modalItem} key={index}>
                            {reaction.creator.flagImagePath
                                ? <img className={styles.creatorImage} src={reaction.creator.flagImagePath}/>
                                : <div className={styles.placeholderWrapper}>
                                    <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                                </div>
                            }
                            <div className={styles.modalItemText}>{reaction.creator.name}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default PostCardReactionItem
