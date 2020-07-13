import React from 'react'
import styles from '../../styles/components/PostCardRatingModal.module.scss'

function PostCardRatingModal(props) {
    const {
        ratingModalOpen,
        newRating,
        newRatingError,
        totalRatingScore,
        setNewRating,
        setNewRatingError,
        addRating
    } = props
    
    return (
        <div className={`${styles.postRatingModal} ${(ratingModalOpen && styles.visible)}`}>
            <div className={styles.postRatingModalTotalScore}>
                <div className={styles.postRatingModalTotalScoreBar}>
                    <div className={styles.postRatingModalTotalScorePercentage} style={{width: totalRatingScore()}}/>
                    <div className={styles.postRatingModalTotalScoreText}>{ totalRatingScore() }</div>
                </div>
            </div>
            <div className={styles.postRatingModalInputWrapper}>
                <input className={`${styles.postRatingModalInput} ${(newRatingError && styles.error)}`}
                    type="text"
                    value={ newRating }
                    onChange={(e) => { setNewRating(e.target.value); setNewRatingError(false) }}/>
                <div>/ 100</div>
            </div>
            <div className={styles.postRatingModalButton}
                onClick={() => addRating()}>
                Add rating
            </div>
        </div>
    )
}

export default PostCardRatingModal