import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'
import { UserContext } from '../../../contexts/UserContext'
import { PostContext } from '../../../contexts/PostContext'
import styles from '../../../styles/components/PostCard.module.scss'
import PostCardReactions from './PostCardReactions'
import PostCardUrlPreview from './PostCardUrlPreview'

function PostCard(props) {
    const { postData, index, location } = props
    const { accountData } = useContext(AccountContext)
    const { setHolonHandle, getHolonPosts } = useContext(HolonContext)
    const { getCreatedPosts } = useContext(UserContext)
    const { postContextLoading } = useContext(PostContext)
    const history = useHistory()

    // remote post state
    const { 
        id, creator, text, url, urlImage, urlDomain, urlTitle, urlDescription, createdAt,
        total_comments, total_reactions, total_likes, total_ratings, total_rating_points, total_reposts,
        account_like, account_rating, account_repost,
        DirectSpaces, IndirectSpaces
    } = postData

    // local post state
    const [totalComments, setTotalComments] = useState(0)
    const [totalReactions, setTotalReactions] = useState(0)
    const [totalLikes, setTotalLikes] = useState(0)
    const [totalRatings, setTotalRatings] = useState(0)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)
    const [totalReposts, setTotalReposts] = useState(0)
    // TODO: change account state below to true/false booleans
    const [accountLike, setAccountLike] = useState(0)
    const [accountRating, setAccountRating] = useState(0)
    const [accountRepost, setAccountRepost] = useState(0)

    const [blockedSpaces, setBlockedSpaces] = useState([])
    const [reactionsOpen, setReactionsOpen] = useState(false)
    const finishedLoading = location !== 'post-page' || !postContextLoading
    const isOwnPost = finishedLoading && accountData.name === creator.name
    const showLinkPreview = (urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null)
    const postSpaces = DirectSpaces && DirectSpaces.filter(space => space.type === 'post')

    function syncPostState() {
        setTotalComments(total_comments)
        setTotalReactions(total_reactions)
        setTotalLikes(total_likes)
        setTotalRatings(total_ratings)
        setTotalRatingPoints(total_rating_points)
        setTotalReposts(total_reposts)
        setAccountLike(account_like)
        setAccountRating(account_rating)
        setAccountRepost(account_repost)
        setBlockedSpaces([...DirectSpaces.map(s => s.handle), ...IndirectSpaces.map(s => s.handle)])
    }

    function deletePost() {
        console.log('PostCard: deletePost')
        axios.delete(config.environmentURL + '/delete-post', { data: { postId: id } })
            .then(setTimeout(() => { 
                if (location === 'holon-posts') { getHolonPosts() }
                if (location === 'user-created-posts') { getCreatedPosts() }
                if (location === 'post-page') { history.push('/s/all') }
            }, 200))
            .catch(error => { console.log(error) })
    }

    function formattedDate() {
        let a = createdAt.split(/[-.T :]/)
        let formattedDate = a[3]+':'+a[4]+' on '+a[2]+'-'+a[1]+'-'+a[0]
        return formattedDate
    }

    useEffect(() => {
        if (postData.id) { syncPostState() }
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
                            <span className='mr-5'>{creator.name || 'Anonymous'}</span>
                        </Link>
                        <span className={styles.subText}>to</span>
                        <div className={styles.postSpaces}>
                            {postSpaces.length > 0
                                ? postSpaces.map((space, index) =>
                                    <Link to={`/s/${space.handle}`}
                                        onClick={ () => {setHolonHandle(space.handle)} }
                                        style={{marginRight: 10}}
                                        key={index}>
                                        {space.handle}
                                    </Link>)
                                : <Link to={`/s/all`}
                                    onClick={() => {setHolonHandle('all')}}
                                    style={{marginRight: 10}}>
                                    all
                                </Link>
                            }
                        </div>
                        <span className={styles.subText}>|</span>
                        <Link to={`/p/${id}`} className={styles.link}>
                            <img className={styles.linkIcon} src={'/icons/link-solid.svg'} alt=''/>
                            <span className={styles.subText}>{formattedDate() || 'no date'}</span>
                        </Link>
                    </div>
                    <div className={styles.content}>
                        {text && <div className={styles.text}>{text}</div>}
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
                            <div className={styles.interactItem} onClick={() => setReactionsOpen(!reactionsOpen)}>
                                <img 
                                    className={`${styles.icon} ${(accountLike || accountRating || accountRepost > 0) && styles.selected}`}
                                    src="/icons/fire-alt-solid.svg" alt=''
                                />
                                <span className={'greyText'}>{totalReactions} Reactions</span>
                            </div>
                            <Link className={styles.interactItem}
                                to={`/p/${id}`}>
                                <img className={styles.icon} src="/icons/comment-solid.svg" alt=''/>
                                <span className='greyText'>{ totalComments } Comments</span>
                            </Link>
                            {isOwnPost &&
                                <div className={styles.interactItem} onClick={deletePost}>
                                    <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                    <span className='greyText'>Delete</span>
                                </div>
                            }
                        </div>
                        {reactionsOpen &&
                            <PostCardReactions
                                postData={postData}
                                totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                                totalLikes={totalLikes} setTotalLikes={setTotalLikes}
                                totalRatings={totalRatings} setTotalRatings={setTotalRatings}
                                totalRatingPoints={totalRatingPoints} setTotalRatingPoints={setTotalRatingPoints}
                                totalReposts={totalReposts} setTotalReposts={setTotalReposts}
                                accountLike={accountLike} setAccountLike={setAccountLike}
                                accountRating={accountRating} setAccountRating={setAccountRating}
                                accountRepost={accountRepost} setAccountRepost={setAccountRepost}
                                blockedSpaces={blockedSpaces} setBlockedSpaces={setBlockedSpaces}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default PostCard

// const [totalHearts, setTotalHearts] = useState(0)

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


// {!props.isPostPage && /* Link removed from PostPage to prevent loading issue with Reactions */
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
//     setTotalReactions(Reactions.length)
//     function findNumberofLabels(labelType) { return Reactions.filter((label) => label.type === labelType).length }
//     setTotalLikes(findNumberofLabels('like'))
//     setTotalHearts(findNumberofLabels('heart'))
//     setTotalRatings(findNumberofLabels('rating'))
//     setTotalRatingPoints(Reactions
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