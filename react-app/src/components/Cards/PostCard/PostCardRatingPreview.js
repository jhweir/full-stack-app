import React from 'react'
import styles from '../../../styles/components/PostCardRatingPreview.module.scss'

function PostCardRatingPreview(props) {
    const { reactions, totalReactions, totalReactionPoints } = props

    function totalRatingScore() {
        if (totalReactions) { return (totalReactionPoints / totalReactions).toFixed(2) + '%' }
        else { return 'N/A' }
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.pointerWrapper}>
                    <div className={styles.pointer}/>
                </div>
                <div className={styles.averageRating}>
                    <span className={`${styles.text} mr-10`}>Average:</span>
                    <div className={styles.totalScoreBar}>
                        <div className={styles.totalScorePercentage} style={{width: totalReactions ? totalRatingScore() : 0}}/>
                        <div className={styles.totalScoreText}>{ totalRatingScore() }</div>
                    </div>
                </div>
                <div className={styles.dividerLine}/>
                <div className={styles.items}>
                    {reactions && reactions.map((reaction, index) =>
                        <div className={styles.item} key={index}>
                            <div className={styles.user}>
                                {reaction.creator.flagImagePath
                                    ? <img className={styles.image} src={reaction.creator.flagImagePath}/>
                                    : <div className={styles.placeholderWrapper}>
                                        <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                                    </div>
                                }
                                <div className={`${styles.text} mr-10`}>{reaction.creator.name}</div>
                            </div>
                            <div className={styles.totalScoreBar}>
                                <div className={styles.totalScorePercentage} style={{width: `${reaction.value}%`}}/>
                                <div className={styles.totalScoreText}>{`${reaction.value}%`}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostCardRatingPreview
