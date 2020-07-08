import React from 'react'
import styles from '../styles/components/PostReactionModal.module.scss'
import PostRatingModal from './PostRatingModal'

function PostReactionModal(props) {
    const {
        totalLikes,
        totalHearts,
        totalRatings,
        reactionModalOpen,
        toggleReactionModal,
        addLike,
        addHeart,
        ratingModalOpen,
        toggleRatingModal,
        totalRatingScore,
        newRating,
        newRatingError,
        setNewRating,
        setNewRatingError,
        addRating,
        accountLike,
        accountHeart,
        accountRating
    } = props

    return (
        <div className={`${styles.postReactionModal} ${(reactionModalOpen && styles.visible)}`}>

            <img className={styles.postReactionModalCloseButton}
                src="/icons/close-01.svg" alt=''
                onClick={() => toggleReactionModal()}
            />

            <div className={styles.postReactionModalItem} onClick={() => addLike()}>
                <img
                    className={`${styles.postIcon} ${accountLike !== 0 && styles.selectedOrange}`}
                    src="/icons/thumbs-up-solid.svg" alt=''
                />
                <div>{ totalLikes } Likes</div>
            </div>

            <div className={styles.postReactionModalItem} onClick={() => addHeart()}>
                <img
                    className={`${styles.postIcon} ${accountHeart !== 0 && styles.selectedOrange}`}
                    src="/icons/heart-solid.svg" alt=''
                />
                <div>{ totalHearts } Hearts</div>
            </div>

            <div className={styles.postReactionModalItem} onClick={() => toggleRatingModal()}>
                <img
                    className={`${styles.postIcon} ${accountRating !== 0 && styles.selectedOrange}`}
                    src="/icons/star-solid.svg" alt=''
                />
                <div>{ totalRatings } Ratings</div>
            </div>

            <PostRatingModal
                ratingModalOpen={ratingModalOpen}
                newRating={newRating}
                newRatingError={newRatingError}
                totalRatingScore={totalRatingScore}
                setNewRating={setNewRating}
                setNewRatingError={setNewRatingError}
                addRating={addRating}
            />
        </div>
    )
}

export default PostReactionModal