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

    // console.log('reactions: ', reactions)

    // let reposts
    // if () {}

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
                    {reactions && reactions.map((reaction, index) =>
                        <div className={styles.modalItem} key={index}>
                            {reaction.creator.flagImagePath
                                ? <img className={styles.image} src={reaction.creator.flagImagePath}/>
                                : <div className={styles.placeholderWrapper}>
                                    <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                                </div>
                            }
                            <div className={`${styles.modalItemText} mr-10`}>{reaction.creator.name}</div>
                            {text === 'Reposts' &&
                                <>
                                    <div className={`${styles.modalItemText} mr-10`}>to</div>
                                    {reaction.space.flagImagePath
                                        ? <img className={styles.image} src={reaction.space.flagImagePath}/>
                                        : <div className={styles.placeholderWrapper}>
                                            <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                                        </div>
                                    }
                                    <div className={styles.modalItemText}>{reaction.space.name}</div>
                                </>
                            }
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default PostCardReactionItem
