import React from 'react'
import styles from '../styles/components/PostReactionModal.module.scss'
import PostRatingModal from './PostRatingModal'

function PostReactionModal(props) {
    const {
        likes,
        hearts,
        ratings,
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
        Labels
    } = props

    return (
        <div className={`${styles.postReactionModal} ${(reactionModalOpen && styles.visible)}`}>

            <img className={styles.postReactionModalCloseButton}
                src="/icons/close-01.svg"
                onClick={() => toggleReactionModal()}/>

            <div className={styles.postReactionModalItem} onClick={() => addLike()}>
                <img className={styles.postIcon} src="/icons/thumbs-up-solid.svg"/>
                <div>{ likes } Likes</div>
            </div>

            <div className={styles.postReactionModalItem} onClick={() => addHeart()}>
                <img className={styles.postIcon} src="/icons/heart-solid.svg"/>
                <div>{ hearts } Hearts</div>
            </div>

            <div className={styles.postReactionModalItem} onClick={() => toggleRatingModal()}>
                <img className={styles.postIcon} src="/icons/star-solid.svg"/>
                <div>{ ratings } Ratings</div>
            </div>

            <PostRatingModal
                ratingModalOpen={ratingModalOpen}
                newRating={newRating}
                newRatingError={newRatingError}
                totalRatingScore={totalRatingScore}
                setNewRating={setNewRating}
                setNewRatingError={setNewRatingError}
                addRating={addRating}/>

            <div className={`${styles.postReactionModalItem} ${styles.opacity50}`}>
                <img className={styles.postIcon} src="/icons/hashtag-solid.svg"/>
                <div>{ Labels.filter((label)=> label.type === 'tag').length } Tags</div>
            </div>

            <div className={`${styles.postReactionModalItem} ${styles.opacity50}`}>
                <img className={styles.postIcon} src="/icons/tags-solid.svg"/>
                <div>{ Labels.filter((label)=> label.type === 'label').length } Labels</div>
            </div>

            <div className={`${styles.postReactionModalItem} ${styles.opacity50}`}>
                <img className={styles.postIcon} src="/icons/flag-solid.svg"/>
                <div>{ Labels.filter((label)=> label.type === 'flag').length } Flags</div>
            </div>

            <div className={`${styles.postReactionModalItem} ${styles.opacity50}`}>
                <img className={styles.postIcon} src="/icons/link-solid.svg"/>
                <div>{ Labels.filter((label)=> label.type === 'link').length } Links</div>
            </div>

        </div>
    )
}

export default PostReactionModal