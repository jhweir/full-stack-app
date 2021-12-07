import React from 'react'
import styles from '@styles/components/PostCardRatingPreview.module.scss'
import FlagImage from '@components/FlagImage'

const PostCardRatingPreview = (props: {
    reactions: any[]
    totalReactions: number
    totalReactionPoints: number | undefined
}): JSX.Element => {
    const { reactions, totalReactions, totalReactionPoints } = props

    function totalRatingScore() {
        if (totalReactionPoints && totalReactions) {
            return `${(totalReactionPoints / totalReactions).toFixed(2)}%`
        }
        return 'N/A'
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.pointerWrapper}>
                    <div className={styles.pointer} />
                </div>
                <div className={styles.averageRating}>
                    <span className={`${styles.text} mr-10`}>Average score:</span>
                    <div className={styles.totalScoreBar}>
                        <div
                            className={styles.averageScorePercentage}
                            style={{ width: totalReactions ? totalRatingScore() : 0 }}
                        />
                        <div className={styles.totalScoreText}>{totalRatingScore()}</div>
                    </div>
                </div>
                {/* <div className={styles.dividerLine}/> */}
                <div className={styles.items}>
                    {reactions &&
                        reactions.map((reaction) => (
                            <div className={styles.item} key={reaction}>
                                <div className={styles.user}>
                                    <FlagImage
                                        type='user'
                                        size={25}
                                        imagePath={reaction.creator.flagImagePath}
                                    />
                                    <span className={styles.text}>{reaction.creator.name}</span>
                                </div>
                                <div className={styles.totalScoreBar}>
                                    <div
                                        className={styles.totalScorePercentage}
                                        style={{ width: `${reaction.value}%` }}
                                    />
                                    <div
                                        className={styles.totalScoreText}
                                    >{`${reaction.value}%`}</div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default PostCardRatingPreview
