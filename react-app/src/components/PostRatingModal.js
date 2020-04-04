import React from 'react'
import styles from '../styles/components/PostRatingModal.module.scss'

function PostRatingModal(props) {
    const {
        ratingModalOpen,
        newRating,
        newRatingError,
        totalRatingScore,
        setNewRating,
        setNewRatingError,
        addRating
    } = props

    const {
        postRatingModal,
        visible,
        postRatingModalTotalScore,
        postRatingModalTotalScoreBar,
        postRatingModalTotalScorePercentage,
        postRatingModalTotalScoreText,
        postRatingModalInputWrapper,
        postRatingModalInput,
        error,
        postRatingModalButton,
    } = styles

    return (
        <div className={`${postRatingModal}` + (ratingModalOpen ? ` ${visible}` : '') }>
            <div className={postRatingModalTotalScore}>
                <div className={postRatingModalTotalScoreBar}>
                    <div className={postRatingModalTotalScorePercentage} style={{width: totalRatingScore()}}/>
                    <div className={postRatingModalTotalScoreText}>{totalRatingScore()}</div>
                </div>
            </div>
            <div className={postRatingModalInputWrapper}>
                <input className={`${postRatingModalInput}` + (newRatingError ? ` ${error}` : '')}
                    type="text"
                    value={ newRating }
                    onChange={(e) => {setNewRating(e.target.value); setNewRatingError(false)}}/>
                <div className="">/ 100</div>
            </div>
            <div className={postRatingModalButton}
                onClick={() => addRating()}>
                Add rating
            </div>
        </div>
    )
}

export default PostRatingModal