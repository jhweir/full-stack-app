import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardReactions.module.scss'
import PostCardReactionItem from './PostCardReactionItem'
import PostCardRatingModal from './PostCardRatingModal'
import PostCardRepostModal from './PostCardRepostModal'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'

function PostCardReactions(props) {
    const {
        postId, postCreator,
        totalReactions, setTotalReactions,
        totalLikes, setTotalLikes,
        totalRatings, setTotalRatings,
        totalReposts, setTotalReposts,
        totalRatingPoints, setTotalRatingPoints,
        accountLike, setAccountLike,
        accountRating, setAccountRating,
        accountRepost, setAccountRepost
    } = props

    const { isLoggedIn, accountData, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const { holonData, getHolonPosts } = useContext(HolonContext)

    const [reactionData, setReactionData] = useState({ Labels: [] })
    const [likePreviewOpen, setLikePreviewOpen] = useState(false)
    // const [likeModalOpen, setLikeModalOpen] = useState(false)
    const [ratingPreviewOpen, setRatingPreviewOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [repostPreviewOpen, setRepostPreviewOpen] = useState(false)
    const [repostModalOpen, setRepostModalOpen] = useState(false)

    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)

    function getReactionData() {
        console.log('PostCardReactions: getReactionData')
        axios
            .get(config.environmentURL + `/post-reaction-data?postId=${postId}`)
            .then(res => { setReactionData(res.data) })
    }

    function addLike() {
        if (!isLoggedIn) { setAlertMessage('Log in to like post'); setAlertModalOpen(true) }
        else {
            // if post already liked by account, remove like
            if (accountLike !== 0) {
                setTotalLikes(totalLikes - 1)
                setTotalReactions(totalReactions - 1)
                setAccountLike(0)
                axios.put(config.environmentURL + '/remove-like', { accountId: accountData.id, postId: postId })
                    .then(res => { if (res.data === 'success') { setTimeout(() => { getReactionData() }, 200) }})
                    .catch(error => { console.log(error) })
            }
            else {
                // otherwise add like
                setTotalLikes(totalLikes + 1)
                setTotalReactions(totalReactions + 1)
                setAccountLike(accountLike + 1)
                axios.put(config.environmentURL + '/add-like', { accountId: accountData.id, postId: postId, holonId: holonData.id })
                    .then(res => { if (res.data === 'success') { setTimeout(() => { getReactionData() }, 200) }})
                    .catch(error => { console.log(error) })
            }
        }
    }

    function addRating() {
        console.log('addRating')
        if (!isLoggedIn) { setAlertMessage('Log in to add rating'); setAlertModalOpen(true) }
        else {
            const invalidRating = isNaN(newRating) || newRating === '' || newRating > 100 || newRating < 0
            if (invalidRating) { setNewRatingError(true) }
            else {
                setTotalRatings(totalRatings + 1)
                setTotalReactions(totalReactions + 1)
                setTotalRatingPoints(totalRatingPoints + parseInt(newRating, 10))
                setAccountRating(accountRating + 1)
                axios.put(config.environmentURL + '/add-rating', { accountId: accountData.id, postId: postId, holonId: holonData.id, newRating })
                    .then(setNewRating(''))
                    .catch(error => { console.log(error) })
            }
        }
    }

    function removeRating() {
        console.log('removeRating')
        if (!isLoggedIn) { setAlertMessage('Log in to add rating'); setAlertModalOpen(true) }
        else {
            setTotalRatings(totalRatings - 1)
            setTotalReactions(totalReactions - 1)
            setAccountRating(0)
            axios.put(config.environmentURL + '/remove-rating', { accountId: accountData.id, postId: postId, holonId: holonData.id })
                .then(() => { getHolonPosts() })
                .catch(error => { console.log(error) })
        }
    }

    useEffect(() => {
        getReactionData()
    }, [])

    return (
        <div className={styles.postCardReactions}>
            <PostCardReactionItem
                reactions={reactionData.Labels.filter(label => label.type === 'like')}
                text='Likes'
                previewOpen={likePreviewOpen}
                setPreviewOpen={setLikePreviewOpen}
                accountReaction={accountLike}
                totalReactions={totalLikes}
                iconPath='thumbs-up-solid.svg'
                onClick={addLike}
            />
            <PostCardReactionItem
                reactions={reactionData.Labels.filter(label => label.type === 'rating')}
                text='Ratings'
                previewOpen={ratingPreviewOpen}
                setPreviewOpen={setRatingPreviewOpen}
                accountReaction={accountRating}
                totalReactions={totalRatings}
                iconPath='star-solid.svg'
                onClick={() => setRatingModalOpen(!ratingModalOpen)}
            />
            <PostCardReactionItem
                reactions={reactionData.Labels.filter(label => label.type === 'repost')}
                text='Reposts'
                previewOpen={repostPreviewOpen}
                setPreviewOpen={setRepostPreviewOpen}
                accountReaction={accountRepost}
                totalReactions={totalReposts}
                iconPath='retweet-solid.svg'
                onClick={() => { 
                    if (isLoggedIn) { setRepostModalOpen(true) }
                    else { setAlertMessage('Log in to repost post'); setAlertModalOpen(true) }
                }}
            />
            {ratingModalOpen && <PostCardRatingModal
                isLoggedIn={isLoggedIn}
                totalRatings={totalRatings}
                totalRatingPoints={totalRatingPoints}
                newRating={newRating} setNewRating={setNewRating}
                newRatingError={newRatingError} setNewRatingError={setNewRatingError}
                addRating={addRating}
                removeRating={removeRating}
                accountRating={accountRating}
            />}
            {repostModalOpen && <PostCardRepostModal
                setRepostModalOpen={setRepostModalOpen}
                postCreator={postCreator}
                totalRepost={totalReposts}
                accountRepost={accountRepost}
            />}
        </div>
    )
}

export default PostCardReactions

// function addHeart() {
//     if (!isLoggedIn) { setAlertMessage('Log in to heart post'); setAlertModalOpen(true) }
//     else {
//         if (accountHeart !== 0) {
//             setTotalHearts(totalHearts - 1)
//             setTotalReactions(totalReactions - 1)
//             setAccountHeart(0)
//             axios.put(config.environmentURL + '/remove-heart', { accountId: accountData.id, postId: id })
//                 .catch(error => { console.log(error) })
//         }
//         else {
//             setTotalHearts(totalHearts + 1)
//             setTotalReactions(totalReactions + 1)
//             setAccountHeart(accountHeart + 1)
//             axios.put(config.environmentURL + '/add-heart', { accountId: accountData.id, postId: id, holonId: holonData.id })
//                 .catch(error => { console.log(error) })
//         }
//     }
// }

    // function addRating() {
    //     if (!isLoggedIn) { setAlertMessage('Log in to add rating'); setAlertModalOpen(true) }
    //     else {
    //         if (accountRating !== 0) { // If already rated by user
    //             let n = newRating
    //             let invalidRating = isNaN(n) || n === '' || n > 100 || n < 0
    //             if (invalidRating) { setNewRatingError(true) }
    //             else {
    //                 axios.put(config.environmentURL + '/update-rating', { accountId: accountData.id, postId: id, holonId: holonData.id, newRating })
    //                     .then(() => { setNewRating(''); getHolonPosts() })
    //                     .catch(error => { console.log(error) })
    //             }
    //         }
    //         else { // if not already rated by user
    //             const invalidRating = isNaN(newRating) || newRating === '' || newRating > 100 || newRating < 0
    //             if (invalidRating) { setNewRatingError(true) }
    //             else {
    //                 setTotalRatings(totalRatings + 1)
    //                 setTotalReactions(totalReactions + 1)
    //                 setTotalRatingPoints(totalRatingPoints + parseInt(newRating, 10))
    //                 setAccountRating(accountRating + 1)
    //                 axios.put(config.environmentURL + '/add-rating', { accountId: accountData.id, postId: id, holonId: holonData.id, newRating })
    //                     .then(setNewRating(''))
    //                     .catch(error => { console.log(error) })
    //             }
    //         }
    //     }
    // }

    // const ref = useRef()
    // function handleClickOutside(e) { if (!ref.current.contains(e.target)) { setReactionModalOpen(false) } }
    // useEffect(() => {
    //     document.addEventListener("mousedown", handleClickOutside)
    //     return () => document.removeEventListener("mousedown", handleClickOutside)
    // }) ref={ref}

    {/* <div className={styles.item} onClick={() => addHeart()}>
    <img
        className={`${styles.postIcon} ${accountHeart !== 0 && styles.selected}`}
        src="/icons/heart-solid.svg" alt=''
    />
    <div>{totalHearts} Hearts</div>
</div> */}

            {/* <img className={styles.closeButton}
    src="/icons/close-01.svg" alt=''
    onClick={() => setReactionModalOpen(false)}
/> */}