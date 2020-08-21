import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/PostCardReactionModal.module.scss'
import PostCardRatingModal from './PostCardRatingModal'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'

function PostCardReactionModal(props) {
    const {
        postId,
        totalReactions, setTotalReactions,
        totalLikes, setTotalLikes,
        // totalHearts, setTotalHearts,
        totalRatings, setTotalRatings,
        totalRatingPoints, setTotalRatingPoints,
        accountLike, setAccountLike,
        // accountHeart, setAccountHeart,
        accountRating, setAccountRating,
        //setReactionModalOpen
    } = props

    console.log('accountRating', accountRating)

    const { isLoggedIn, accountData, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const { holonData, getHolonPosts } = useContext(HolonContext)

    const [reactionData, setReactionData] = useState({})
    const [likesModalOpen, setLikesModalOpen] = useState(false)

    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)

    //let likes = reactionData && reactionData.Labels.filter(label => label.type === 'like')

    function getReactionData() {
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
                    .catch(error => { console.log(error) })
            }
            else {
                // otherwise add like
                setTotalLikes(totalLikes + 1)
                setTotalReactions(totalReactions + 1)
                setAccountLike(accountLike + 1)
                axios.put(config.environmentURL + '/add-like', { accountId: accountData.id, postId: postId, holonId: holonData.id })
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
        <div className={styles.postReactionModal}>
            <div className={styles.item} onMouseOver={() => setLikesModalOpen(true)} onMouseOut={() => setLikesModalOpen(false)}>
            {/* onClick={() => addLike()} */}
                <img
                    className={`${styles.postIcon} ${accountLike !== 0 && styles.selected}`}
                    src="/icons/thumbs-up-solid.svg" alt=''
                />
                <div>{totalLikes} Likes</div>
                {likesModalOpen && reactionData &&
                    <div className={styles.modal}>
                        {reactionData.Labels.filter(label => label.type === 'like').map((like, index) =>
                            <div className={styles.modalItem} key={index}>
                                {like.creator.flagImagePath
                                    ? <img className={styles.modalItemImage} src={like.creator.flagImagePath}/>
                                    : <div className={styles.placeholderWrapper}>
                                        <img className={styles.placeholder} src={'/icons/user-solid.svg'} alt=''/>
                                    </div>
                                }
                                <div className={styles.modalItemText}>{like.creator.name}</div>
                            </div>
                        )}
                    </div>
            }
            </div>
            <div className={styles.item} onClick={() => setRatingModalOpen(!ratingModalOpen)}>
                <img
                    className={`${styles.postIcon} ${accountRating !== 0 && styles.selected}`}
                    src="/icons/star-solid.svg" alt=''
                />
                <div>{totalRatings} Ratings</div>
            </div>
            {ratingModalOpen &&
                <PostCardRatingModal
                    isLoggedIn={isLoggedIn}
                    totalRatings={totalRatings}
                    totalRatingPoints={totalRatingPoints}
                    newRating={newRating}
                    newRatingError={newRatingError}
                    setNewRating={setNewRating}
                    setNewRatingError={setNewRatingError}
                    addRating={addRating}
                    removeRating={removeRating}
                    accountRating={accountRating}
                />
            }
            <div className={styles.item} onClick={() => setRatingModalOpen(!ratingModalOpen)}>
                <img
                    className={`${styles.postIcon} ${styles.large} ${accountRating !== 0 && styles.selected}`}
                    src="/icons/retweet-solid.svg" alt='' // src="/icons/sync-alt-solid.svg"
                />
                <div>2 Reposts</div>
            </div>

        </div>
    )
}

export default PostCardReactionModal

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