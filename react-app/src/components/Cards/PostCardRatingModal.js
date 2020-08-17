import React, { useState } from 'react'
import styles from '../../styles/components/PostCardRatingModal.module.scss'

function PostCardRatingModal(props) {
    const {
        isLoggedIn,
        totalRatings,
        totalRatingPoints,
        newRating,
        newRatingError,
        setNewRating,
        setNewRatingError,
        addRating,
        removeRating,
        accountRating
    } = props

    const alreadyRatedByUser = accountRating !== 0

    function totalRatingScore() {
        if (totalRatings) { return (totalRatingPoints / totalRatings).toFixed(2) + '%' }
        else { return 'N/A' }
    }

    console.log('totalRatingScore: ', totalRatingScore)
    return (
        <div className={styles.postCardRatingModal}>
            <div className={styles.totalScore}>
                <div className={styles.totalScoreBar}>
                    <div className={styles.totalScorePercentage} style={{width: totalRatings ? totalRatingScore() : 0}}/>
                    <div className={styles.totalScoreText}>{ totalRatingScore() }</div>
                </div>
            </div>
            {isLoggedIn && !alreadyRatedByUser &&
                <>
                    <div className={styles.inputWrapper}>
                        <input className={`${styles.input} ${newRatingError && styles.error}`}
                            value={newRating} type="text"
                            onChange={(e) => { setNewRating(e.target.value); setNewRatingError(false) }}
                        />
                        <div>/ 100</div>
                    </div>
                    <div className='wecoButton' style={{height: 30}} onClick={() => { addRating() }}>Add</div>
                </>
            }
            {isLoggedIn && alreadyRatedByUser && <div className='wecoButton' style={{height: 30}} onClick={() => { removeRating() }}>Remove</div>}
        </div>
    )
}

export default PostCardRatingModal