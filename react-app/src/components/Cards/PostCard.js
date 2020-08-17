import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import { UserContext } from '../../contexts/UserContext'
import { PostContext } from '../../contexts/PostContext'
import styles from '../../styles/components/PostCard.module.scss'
import PostCardReactionModal from './PostCardReactionModal'
import PostCardUrlPreview from './../Cards/PostCardUrlPreview'

function PostCard(props) {
    const { postData, index, location } = props
    const { accountData } = useContext(AccountContext)
    const { setHolonHandle, getHolonPosts } = useContext(HolonContext)
    const { getCreatedPosts } = useContext(UserContext)
    const { postContextLoading } = useContext(PostContext)
    const history = useHistory()

    // remote post state
    const { 
        id, creator, text, url, urlImage, urlDomain, urlTitle, urlDescription, createdAt, spaces,
        total_comments, total_reactions, total_likes, total_hearts, total_ratings, total_rating_points,
        account_like, account_heart, account_rating
    } = postData

    // local post state
    const [totalComments, setTotalComments] = useState(0)
    const [totalReactions, setTotalReactions] = useState(0)
    const [totalLikes, setTotalLikes] = useState(0)
    const [totalHearts, setTotalHearts] = useState(0)
    const [totalRatings, setTotalRatings] = useState(0)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)
    const [accountLike, setAccountLike] = useState(0)
    const [accountHeart, setAccountHeart] = useState(0)
    const [accountRating, setAccountRating] = useState(0)

    const [reactionModalOpen, setReactionModalOpen] = useState(false)
    const finishedLoading = location !== 'post-page' || !postContextLoading
    const isOwnPost = finishedLoading && accountData.name === creator.name
    const showLinkPreview = (urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null)

    function syncPostState() {
        setTotalComments(total_comments)
        setTotalReactions(total_reactions)
        setTotalLikes(total_likes)
        setTotalHearts(total_hearts)
        setTotalRatings(total_ratings)
        setTotalRatingPoints(total_rating_points)
        setAccountLike(account_like)
        setAccountHeart(account_heart)
        setAccountRating(account_rating)
    }

    function deletePost() {
        axios.delete(config.environmentURL  + '/delete-post', { data: { postId: id } })
            .then(setTimeout(() => { 
                if (location === 'holon-posts') { getHolonPosts() }
                if (location === 'user-created-posts') { getCreatedPosts() }
                if (location === 'post-page') { history.push('/s/all') }
            }, 200))
            .catch(error => { console.log(error) })
    }

    function formatDate() {
        let a = createdAt.split(/[-.T :]/)
        let formattedDate = a[3]+':'+a[4]+' on '+a[2]+'-'+a[1]+'-'+a[0]
        return formattedDate
    }

    useEffect(() => {
        syncPostState()
    }, [postData])

    if (finishedLoading) {
        return ( 
            <div className={styles.post}>
                {location !== 'post-page' && <div className={styles.index}>{index + 1}</div>}
                <div className={styles.body}>
                    <div className={styles.tags}>
                        <Link to={ `/u/${creator.handle}`} className={styles.creator}>
                            {creator.flagImagePath
                                ? <img className={styles.creatorImage} src={creator.flagImagePath} alt=''/>
                                : <div className={styles.placeholderWrapper}>
                                    <img className={styles.placeholder} src={'/icons/user-solid.svg'} alt=''/>
                                </div>
                            }
                            <span className={styles.subText}>{creator.name || 'Anonymous'}</span>
                        </Link>
                        <span className={styles.subText}>to</span>
                        <div className={styles.holonNames}>
                            {spaces.length > 0
                                ? spaces.map((holon, index) =>
                                    <Link to={`/s/${holon}`}
                                        onClick={ () => {setHolonHandle(holon)} }
                                        style={{marginRight: 10}}
                                        key={index}>
                                        {holon}
                                    </Link>)
                                : <Link to={`/s/all`}
                                    onClick={ () => {setHolonHandle('all')} }
                                    style={{marginRight: 10}}>
                                    all
                                </Link>}
                        </div>
                        <span className={styles.subText}>|</span>
                        <span className={styles.subText}>{formatDate() || 'no date'}</span>
                    </div>
                    <div className={styles.content}>
                        {text !== null && <div className={styles.text}>{text}</div>}
                        {showLinkPreview &&
                            <PostCardUrlPreview
                                url={url}
                                urlImage={urlImage}
                                urlDomain={urlDomain}
                                urlTitle={urlTitle}
                                urlDescription={urlDescription}
                            />
                        }
                        <div className={styles.interact}>
                            <div className={styles.interactItem} onClick={() => setReactionModalOpen(!reactionModalOpen)}>
                                <img 
                                    className={`${styles.icon} ${(accountLike || accountHeart || accountRating !== 0) && styles.selected}`}
                                    src="/icons/fire-alt-solid.svg" alt=''
                                />
                                <span>{totalReactions} Reactions</span>
                            </div>
                            <Link className={styles.interactItem}
                                to={`/p/${id}`}>
                                <img className={styles.icon} src="/icons/comment-solid.svg" alt=''/>
                                <span>{ totalComments } Comments</span>
                            </Link>
                            {isOwnPost &&
                                <div className={styles.interactItem} onClick={deletePost}>
                                    <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                    <span>Delete</span>
                                </div>
                            }
                        </div>
                        {reactionModalOpen &&
                            <PostCardReactionModal
                                id={id}
                                totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                                totalLikes={totalLikes} setTotalLikes={setTotalLikes}
                                totalHearts={totalHearts} setTotalHearts={setTotalHearts}
                                totalRatings={totalRatings} setTotalRatings={setTotalRatings}
                                totalRatingPoints={totalRatingPoints} setTotalRatingPoints={setTotalRatingPoints}
                                accountLike={accountLike} setAccountLike={setAccountLike}
                                accountHeart={accountHeart} setAccountHeart={setAccountHeart}
                                accountRating={accountRating} setAccountRating={setAccountRating}
                                setReactionModalOpen={setReactionModalOpen}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    } else { return null }
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
//                 <Link to={ `/s/${holon.handle}` }
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

{/* {pins && <div className={styles.pinFlag} onClick={ unpinPost }></div>} */}