import React from 'react'
import styles from '../../../styles/components/PostCardReactionItem.module.scss'
import PostCardLikePreview from './PostCardLikePreview'
import PostCardRepostPreview from './PostCardRepostPreview'
import PostCardRatingPreview from './PostCardRatingPreview'
import PostCardLinkPreview from './PostCardLinkPreview'

function PostCardReactionItem(props) {
    const {
        reactions,
        text,
        previewOpen,
        setPreviewOpen,
        accountReaction,
        totalReactions,
        totalReactionPoints,
        iconPath,
        onClick
    } = props

    const previewModalOpen = totalReactions > 0 && previewOpen

    return (
        <div className={styles.itemWrapper}>
            <div className={styles.item}
                onMouseEnter={() => setPreviewOpen(true)}
                onMouseLeave={() => setPreviewOpen(false)}
                onClick={onClick}>
                <img
                    className={`
                        ${styles.icon}
                        ${accountReaction > 0 && styles.selected}
                        ${text === 'Reposts' && styles.large}
                    `}
                    src={`/icons/${iconPath}`} alt=''
                />
                <span className='greyText'>{totalReactions} {text}</span>
            </div>

            {previewModalOpen &&
                <>
                    {text === 'Likes' && 
                        <PostCardLikePreview reactions={reactions}/>
                    }
                    {text === 'Reposts' && 
                        <PostCardRepostPreview reactions={reactions}/>
                    }
                    {text === 'Ratings' &&
                        <PostCardRatingPreview
                            reactions={reactions}
                            totalReactions={totalReactions}
                            totalReactionPoints={totalReactionPoints}
                        />
                    }
                    {text === 'Links' &&
                        <PostCardLinkPreview
                            links={reactions}
                        />
                    }
                </>
            }

            {/* {mainModalOpen &&
                <>
                </>
            } */}
            {/* {previewModalOpen && text === 'Likes' &&
                <PostCardLikePreview reactions={reactions}/>
            }
            {previewModalOpen && text === 'Reposts' &&
                <PostCardRepostPreview reactions={reactions}/>
            }
            {previewModalOpen && text === 'Ratings' &&
                <PostCardRatingPreview
                    reactions={reactions}
                    totalReactions={totalReactions}
                    totalReactionPoints={totalReactionPoints}
                />
            } */}
        </div>
    )
}

export default PostCardReactionItem

{/* {previewOpen && totalReactions > 0 &&
    <div className={styles.modal}>
        {text === 'Ratings' &&
            <div className={styles.}>
                <div className={styles.totalScoreBar}>
                    <div className={styles.totalScorePercentage} style={{width: totalReactions ? totalRatingScore() : 0}}/>
                    <div className={styles.totalScoreText}>{ totalRatingScore() }</div>
                </div>
            </div>
        }
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

                {text === 'Ratings' &&
                    <>
                        <div className={styles.totalScoreBar}>
                            <div className={styles.totalScorePercentage} style={{width: `${reaction.value}%`}}/>
                            <div className={styles.totalScoreText}>{`${reaction.value}%`}</div>
                        </div>
                    </>
                }

            </div>
        )}
    </div>
} */}