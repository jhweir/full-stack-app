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

    const {
        postReactionModal,
        postReactionModalCloseButton,
        postReactionModalItem,
        postIcon,
        opacity50,
        visible,
    } = styles

    return (
        <div className={`${postReactionModal}` + (reactionModalOpen ? ` ${visible}` : '') }>

            <img className={postReactionModalCloseButton}
                src="/icons/close-01.svg"
                onClick={() => toggleReactionModal()}/>

            <div className={postReactionModalItem} onClick={() => addLike()}>
                <img className={postIcon} src="/icons/thumbs-up-solid.svg"/>
                <div className="">{ likes } Likes</div>
            </div>

            <div className={postReactionModalItem} onClick={() => addHeart()}>
                <img className={postIcon} src="/icons/heart-solid.svg"/>
                <div className="">{ hearts } Hearts</div>
            </div>

            <div className={postReactionModalItem} onClick={() => toggleRatingModal()}>
                <img className={postIcon} src="/icons/star-solid.svg"/>
                <div className="">{ ratings } Ratings</div>
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

            <div className={`${postReactionModalItem} ${opacity50}`}>
                <img className={postIcon} src="/icons/hashtag-solid.svg"/>
                <div className="">{ Labels.filter((label)=> label.type === 'tag').length } Tags</div>
            </div>

            <div className={`${postReactionModalItem} ${opacity50}`}>
                <img className={postIcon} src="/icons/tags-solid.svg"/>
                <div className="">{ Labels.filter((label)=> label.type === 'label').length } Labels</div>
            </div>

            <div className={`${postReactionModalItem} ${opacity50}`}>
                <img className={postIcon} src="/icons/flag-solid.svg"/>
                <div className="">{ Labels.filter((label)=> label.type === 'flag').length } Flags</div>
            </div>

            <div className={`${postReactionModalItem} ${opacity50}`}>
                <img className={postIcon} src="/icons/link-solid.svg"/>
                <div className="">{ Labels.filter((label)=> label.type === 'link').length } Links</div>
            </div>

        </div>
    )
}

export default PostReactionModal