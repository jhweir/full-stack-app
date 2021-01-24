import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardReactions.module.scss'
import PostCardReactionItem from './PostCardReactionItem'
import PostCardLikeModal from './PostCardLikeModal'
import PostCardRepostModal from './PostCardRepostModal'
import PostCardRatingModal from './PostCardRatingModal'
import PostCardLinkModal from './PostCardLinkModal'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'

function PostCardReactions(props) {
    const {
        postData,
        totalReactions, setTotalReactions,
        totalLikes, setTotalLikes,
        totalReposts, setTotalReposts,
        totalRatings, setTotalRatings,
        totalRatingPoints, setTotalRatingPoints,
        totalLinks, setTotalLinks,
        accountLike, setAccountLike,
        accountRepost, setAccountRepost,
        accountRating, setAccountRating,
        accountLink, setAccountLink,
        blockedSpaces, setBlockedSpaces,
        commentsOpen
    } = props

    const { isLoggedIn, accountData, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)

    const [reactionData, setReactionData] = useState({ Reactions: [] })
    const [likePreviewOpen, setLikePreviewOpen] = useState(false)
    const [likeModalOpen, setLikeModalOpen] = useState(false)
    const [repostPreviewOpen, setRepostPreviewOpen] = useState(false)
    const [repostModalOpen, setRepostModalOpen] = useState(false)
    const [ratingPreviewOpen, setRatingPreviewOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [linkPreviewOpen, setLinkPreviewOpen] = useState(false)
    const [linkModalOpen, setLinkModalOpen] = useState(false)

    function getReactionData() {
        console.log('PostCardReactions: getReactionData')
        axios
            .get(config.apiURL + `/post-reaction-data?postId=${postData.id}`)
            .then(res => res.data !== null && setReactionData(res.data))
    }

    useEffect(() => {
        getReactionData()
    }, [])

    return (
        <div className={styles.postCardReactions}>
            <PostCardReactionItem
                text='Likes'
                reactions={reactionData && reactionData.Reactions.filter(label => label.type === 'like')}
                previewOpen={likePreviewOpen}
                setPreviewOpen={setLikePreviewOpen}
                accountReaction={accountLike}
                totalReactions={totalLikes}
                iconPath='thumbs-up-solid.svg'
                onClick={() => { 
                    if (isLoggedIn) { setLikeModalOpen(true) }
                    else { setAlertMessage('Log in to like post'); setAlertModalOpen(true) }
                }}
            />
            <PostCardReactionItem
                text='Reposts'
                reactions={reactionData && reactionData.Reactions.filter(label => label.type === 'repost')}
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
            <PostCardReactionItem
                text='Ratings'
                reactions={reactionData && reactionData.Reactions.filter(label => label.type === 'rating')}
                //mainModalOpen={ratingModalOpen} setMainModalOpen={setRatingModalOpen}
                previewOpen={ratingPreviewOpen} setPreviewOpen={setRatingPreviewOpen}
                accountReaction={accountRating}
                totalReactions={totalRatings}
                totalReactionPoints={totalRatingPoints}
                iconPath='star-solid.svg'
                onClick={() => { 
                    if (isLoggedIn) { setRatingModalOpen(true) }
                    else { setAlertMessage('Log in to rate post'); setAlertModalOpen(true) }
                }}
            />
            <PostCardReactionItem
                text='Links'
                reactions={reactionData && reactionData.Reactions.filter(label => label.type === 'link')}
                previewOpen={linkPreviewOpen} setPreviewOpen={setLinkPreviewOpen}
                accountReaction={accountLink}
                totalReactions={totalLinks}
                iconPath='link-solid.svg'
                onClick={() => { 
                    if (isLoggedIn) { setLinkModalOpen(true) }
                    else { setAlertMessage('Log in to link post'); setAlertModalOpen(true) }
                }}
            />
            {/* TODO: Move modals into PostCardReactionItems? */}
            {likeModalOpen &&
                <PostCardLikeModal
                    postData={postData}
                    likes={reactionData && reactionData.Reactions.filter(label => label.type === 'like')}
                    setLikeModalOpen={setLikeModalOpen}
                    totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                    totalLikes={totalLikes} setTotalLikes={setTotalLikes}
                    accountLike={accountLike} setAccountLike={setAccountLike}
                    getReactionData={getReactionData}
                    blockedSpaces={blockedSpaces} setBlockedSpaces={setBlockedSpaces}
                />
            }
            {repostModalOpen &&
                <PostCardRepostModal
                    postData={postData}
                    reposts={reactionData && reactionData.Reactions.filter(label => label.type === 'repost')}
                    setRepostModalOpen={setRepostModalOpen}
                    totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                    totalReposts={totalReposts} setTotalReposts={setTotalReposts}
                    accountRepost={accountRepost} setAccountRepost={setAccountRepost}
                    getReactionData={getReactionData}
                    blockedSpaces={blockedSpaces} setBlockedSpaces={setBlockedSpaces}
                />
            }
            {ratingModalOpen &&
                <PostCardRatingModal //TODO: update like repost modal (use postData)?
                    postData={postData}
                    ratings={reactionData && reactionData.Reactions.filter(label => label.type === 'rating')}
                    setRatingModalOpen={setRatingModalOpen}
                    totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                    totalRatings={totalRatings} setTotalRatings={setTotalRatings}
                    totalRatingPoints={totalRatingPoints} setTotalRatingPoints={setTotalRatingPoints}
                    accountRating={accountRating} setAccountRating={setAccountRating}
                    getReactionData={getReactionData}
                />
            }
            {linkModalOpen &&
                <PostCardLinkModal
                    postData={postData}
                    //linkReactions={reactionData && reactionData.Reactions.filter(label => label.type === 'link')}
                    setLinkModalOpen={setLinkModalOpen}
                    getReactionData={getReactionData}
                    totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                    totalLinks={totalLinks} setTotalLinks={setTotalLinks}
                    accountLink={accountLink} setAccountLink={setAccountLink}
                />
            }
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
//             axios.put(config.apiURL + '/remove-heart', { accountId: accountData.id, postId: id })
//                 .catch(error => { console.log(error) })
//         }
//         else {
//             setTotalHearts(totalHearts + 1)
//             setTotalReactions(totalReactions + 1)
//             setAccountHeart(accountHeart + 1)
//             axios.put(config.apiURL + '/add-heart', { accountId: accountData.id, postId: id, holonId: holonData.id })
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
    //                 axios.put(config.apiURL + '/update-rating', { accountId: accountData.id, postId: id, holonId: holonData.id, newRating })
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
    //                 axios.put(config.apiURL + '/add-rating', { accountId: accountData.id, postId: id, holonId: holonData.id, newRating })
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