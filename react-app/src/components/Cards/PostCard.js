import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import { PostContext } from '../../contexts/PostContext'
import styles from '../../styles/components/PostCard.module.scss'
import PostCardReactionModal from './PostCardReactionModal'

function PostCard(props) {
    const { 
        id,
        creator,
        text,
        url,
        createdAt,
        total_comments,
        total_reactions,
        total_likes,
        total_hearts,
        total_ratings,
        total_rating_points,
        account_like,
        account_heart,
        account_rating,
        pins,
        spaces
    } = props.post

    const { isLoggedIn, accountData, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const { holonData, setHolonHandle, getHolonPosts } = useContext(HolonContext)
    const { postContextLoading } = useContext(PostContext)

    const [reactionModalOpen, setReactionModalOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)

    const [totalComments, setTotalComments] = useState(0)
    const [totalReactions, setTotalReactions] = useState(0)
    const [totalLikes, setTotalLikes] = useState(0)
    const [totalHearts, setTotalHearts] = useState(0)
    const [totalRatings, setTotalRatings] = useState(0)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)
    const [accountLike, setAccountLike] = useState(0)
    const [accountHeart, setAccountHeart] = useState(0)
    const [accountRating, setAccountRating] = useState(0)

    // TODO: Move the rating state below to the PostCardRatingModal component?
    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)

    useEffect(() => {
        setTotalComments(total_comments)
        setTotalReactions(total_reactions)
        setTotalLikes(total_likes)
        setTotalHearts(total_hearts)
        setTotalRatings(total_ratings)
        setTotalRatingPoints(total_rating_points)
        setAccountLike(account_like)
        setAccountHeart(account_heart)
        setAccountRating(account_rating)
    }, [creator])

    // create 'addRemoveReaction' function and pass in 'type', 'alertMessage', 'path' as properties

    function addLike() {
        // If user not logged in, request log in
        if (!isLoggedIn) { setAlertMessage('Log in to like post'); setAlertModalOpen(true) }
        else {
            // If post already liked by account, remove like
            if (accountLike !== 0) {
                setTotalLikes(totalLikes - 1)
                setTotalReactions(totalReactions - 1)
                setAccountLike(0)
                axios.put(config.environmentURL + '/removeLike', { postId: id, userId: accountData.id })
                    .catch(error => { console.log(error) })
            }
            else {
                // Add like
                setTotalLikes(totalLikes + 1)
                setTotalReactions(totalReactions + 1)
                setAccountLike(accountLike + 1)
                axios.put(config.environmentURL + '/addLike', { postId: id, holonId: holonData.id, userId: accountData.id })
                    .catch(error => { console.log(error) })
            }
        }
    }

    function addHeart() {
        if (!isLoggedIn) { setAlertMessage('Log in to heart post'); setAlertModalOpen(true) }
        else {
            if (accountHeart !== 0) {
                setTotalHearts(totalHearts - 1)
                setTotalReactions(totalReactions - 1)
                setAccountHeart(0)
                axios.put(config.environmentURL + '/removeHeart', { postId: id, userId: accountData.id })
                    .catch(error => { console.log(error) })
            }
            else {
                setTotalHearts(totalHearts + 1)
                setTotalReactions(totalReactions + 1)
                setAccountHeart(accountHeart + 1)
                axios.put(config.environmentURL + '/addHeart', { postId: id, holonId: holonData.id, userId: accountData.id })
                    .catch(error => { console.log(error) })
            }
        }
    }

    function addRating() {
        if (!isLoggedIn) { setAlertMessage('Log in to add rating'); setAlertModalOpen(true) }
        else {
            if (accountRating !== 0) {
                let n = newRating
                let invalidRating = isNaN(n) || n === '' || n > 100 || n < 0
                if (invalidRating) { setNewRatingError(true) }
                else {
                    axios.put(config.environmentURL + '/updateRating', { postId: id, holonId: holonData.id, userId: accountData.id, newRating })
                        .then(() => { setNewRating(''); getHolonPosts() })
                        .catch(error => { console.log(error) })
                }
            }
            else {
                // TODO: prevent decimal places
                let invalidRating = isNaN(newRating) || newRating === '' || newRating > 100 || newRating < 0
                if (invalidRating) { setNewRatingError(true) }
                else {
                    console.log('creating new rating')
                    setTotalRatings(totalRatings + 1)
                    setTotalReactions(totalReactions + 1)
                    setTotalRatingPoints(totalRatingPoints + parseInt(newRating, 10))
                    setAccountRating(accountRating + 1)
                    axios.put(config.environmentURL + '/addRating', { postId: id, holonId: holonData.id, userId: accountData.id, newRating })
                        .then(setNewRating(''))
                        .catch(error => { console.log(error) })
                }
            }
        }
    }

    function deletePost() {
        axios.delete(config.environmentURL  + '/deletePost', { data: { id } })
            .then(setTimeout(() => { getHolonPosts() }, 200))
            .catch(error => { console.log(error) })
    }

    // function pinPost() {
    //     axios({ method: 'put', url: config.environmentURL + '/pinpost', data: { id } })
    //         //.then(setTimeout(() => { updatePosts() }, 100))
    //         .catch(error => { console.log(error) })
    // }

    // function unpinPost() {
    //     axios({ method: 'put', url: config.environmentURL + '/unpinpost', data: { id } })
    //         //.then(setTimeout(() => { updatePosts() }, 100))
    //         .catch(error => { console.log(error) })
    // }

    function formatDate() {
        const a = createdAt.split(/[-.T :]/)
        const formattedDate = a[3]+':'+a[4]+' on '+a[2]+'-'+a[1]+'-'+a[0]
        return formattedDate
    }

    function totalRatingScore() { // TODO: Move to rating component
        if (totalRatings) { return (totalRatingPoints / totalRatings).toFixed(2) + '%' }
        else { return 'N/A' }
    }

    return ( 
        <div className={`${styles.post} ${(pins && styles.pinnedPost)}`}>
            {/* {pins && <div className={styles.pinFlag} onClick={ unpinPost }></div>} */}
            {!pins && !props.isPostPage && 
                <div className={styles.postId}>{ props.index + 1 }</div>
            }
            <div className={styles.postBody}>
                <div className={styles.postTags}>
                    {creator &&
                        <Link to={ `/u/${creator.handle}`} className={styles.postCreator}>
                            {creator.flagImagePath ?
                                <img className={styles.userImage} src={creator.flagImagePath} alt=''/> :
                                <div className={styles.userImageWrapper}>
                                    <img className={styles.userImagePlaceholder} src={'/icons/user-solid.svg'} alt=''/>
                                </div>
                            }
                            <span className={styles.postSubText}>{ creator && creator.name || 'Anonymous' }</span>
                        </Link>
                    }
                    <span className={styles.postSubText}>to</span>
                    <div className={styles.holonNames}>
                        {spaces && spaces.length > 0
                            ? spaces.map((holon, index) =>
                                <Link to={ `/h/${holon}` }
                                    onClick={ () => { setHolonHandle(holon) } }
                                    style={{marginRight: 10}}
                                    key={index}>
                                    {holon}
                                </Link>)
                            : <Link to={ `/h/root` }
                                onClick={ () => { setHolonHandle('root') } }
                                style={{marginRight: 10}}>
                                all
                            </Link>}
                    </div>
                    <span className={styles.postSubText}>|</span>
                    {!postContextLoading && /* Wait until the post has finished loading before formatting the date to prevent errors */
                        <span className={styles.postSubText}>{ formatDate() || 'no date' }</span>
                    }
                </div>
                <div className={styles.postContent}>
                    {url 
                        ? <a href={url} className={styles.postText}>{ text }</a>
                        : <Link to={ `/p/${id}` } className={styles.postText}>{ text }</Link>
                    }
                    <div className={styles.postInteract}>
                        <div className={styles.postInteractItem} onClick={() => setReactionModalOpen(true)}>
                            <img 
                                className={`${styles.postIcon} ${(accountLike || accountHeart || accountRating !== 0) && styles.selected}`}
                                src="/icons/fire-alt-solid.svg" alt=''
                            />
                            <span>{ totalReactions } Reactions</span>
                        </div>
                        <PostCardReactionModal
                            totalLikes={totalLikes}
                            totalHearts={totalHearts}
                            totalRatings={totalRatings}
                            reactionModalOpen={reactionModalOpen}
                            setReactionModalOpen={setReactionModalOpen}
                            addLike={addLike}
                            addHeart={addHeart}
                            // TODO: Move rating state to Rating Modal component?
                            ratingModalOpen={ratingModalOpen}
                            setRatingModalOpen={setRatingModalOpen}
                            totalRatingScore={totalRatingScore}
                            newRating={newRating}
                            setNewRating={setNewRating}
                            newRatingError={newRatingError}
                            setNewRatingError={setNewRatingError}
                            addRating={addRating}
                            accountLike={accountLike}
                            accountHeart={accountHeart}
                            accountRating={accountRating}
                        />
                        <Link className={styles.postInteractItem}
                            to={ `/p/${id}` }>
                            <img className={styles.postIcon} src="/icons/comment-solid.svg" alt=''/>
                            <span>{ totalComments } Comments</span>
                        </Link>
                        {accountData && creator && accountData.name === creator.name &&
                            <div className={styles.postInteractItem} onClick={ deletePost }>
                                <img className={styles.postIcon} src="/icons/trash-alt-solid.svg" alt=''/>
                                <span>Delete</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard

// {!pins && 
//     <div className={`${styles.postInteractItem} ${styles.opacity50}`}>{/* onClick={ pinPost } */}
//         <img className={styles.postIcon} src="/icons/thumbtack-solid.svg" alt=''/>
//         <span>Pin post</span>
//     </div>
// }

// {!props.postPageLoading &&  /* Wait until the post has finished loading before displaying the holons to prevent errors (possibly no longer needed) */
//     <div className={styles.holonNames}>
//         {props.post.Holons.length >= 1 ? 
//             props.post.Holons.map((holon, index) =>
//                 <Link to={ `/h/${holon.handle}` }
//                     onClick={ () => { updateHolonContext(holon.handle) } }
//                     style={{marginRight: 10}}
//                     key={index}>
//                     {holon.handle}
//                 </Link>
//             )
//             : <div style={{marginRight: 10}}>root</div>}
//     </div>
// }


// {!props.isPostPage && /* Link removed from PostPage to prevent loading issue with Labels */
//     <Link className={styles.postInteractItem} 
//         to={ `/p/${id}` }>
//         <img className={styles.postIcon} src="/icons/comment-solid.svg"/>
//         <span>{ Comments.length } Comments</span>
//     </Link>
// }
// {props.isPostPage && /* Replaced with unclickable div */
//     <div className={styles.postInteractItem}>
//         <img className={styles.postIcon} src="/icons/comment-solid.svg"/>
//         <span>{ Comments.length } Comments</span>
//     </div>
// }


// useEffect(() => {
//     // console.log('Use effect run in post component')
//     setTotalReactions(Labels.length)
//     function findNumberofLabels(labelType) { return Labels.filter((label) => label.type === labelType).length }
//     setTotalLikes(findNumberofLabels('like'))
//     setTotalHearts(findNumberofLabels('heart'))
//     setTotalRatings(findNumberofLabels('rating'))
//     setTotalRatingPoints(Labels
//         .filter((label) => label.type === 'rating') // find all the posts totalRatings
//         .map((rating) => parseInt(rating.value, 10)) // convert rating values to numbers (stored as strings in DB)
//         .reduce((a, b) => a + b, 0)) // add up all rating values
// }, [props])