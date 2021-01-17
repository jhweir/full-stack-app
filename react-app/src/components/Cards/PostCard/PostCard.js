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
import colors from '../../../styles/Colors.module.scss'
import PostCardReactions from './PostCardReactions'
import PostCardUrlPreview from './PostCardUrlPreview'
import PostCardComments from './PostCardComments'
import SmallFlagImage from '../../SmallFlagImage'
import DeleteItemModal from '../../../components/Modals/DeleteItemModal'
import { timeSinceCreated, dateCreated } from '../../../GlobalFunctions'

function PostCard(props) {
    const { postData, index, location } = props
    const { isLoggedIn, accountData, setAlertMessage, setAlertModalOpen, setCreatePostModalOpen, setCreatePostFromTurn, setCreatePostFromTurnData, setSelectedNavBarItem } = useContext(AccountContext)
    const { setHolonHandle, getHolonData, getHolonPosts } = useContext(HolonContext)
    const { getCreatedPosts, getUserData } = useContext(UserContext)
    const { postContextLoading, setPostId } = useContext(PostContext)
    const history = useHistory()

    // console.log('postData: ', postData);

    // remote post state
    const { 
        id, creator, type, text, url, urlImage, urlDomain, urlTitle, urlDescription, createdAt,
        total_comments, total_reactions, total_likes, total_ratings, total_rating_points, total_reposts, total_links,
        account_like, account_rating, account_repost, account_link,
        DirectSpaces, IndirectSpaces, Links
    } = postData

    // local post state
    const [totalComments, setTotalComments] = useState(0)
    const [totalReactions, setTotalReactions] = useState(0)
    const [totalLikes, setTotalLikes] = useState(0)
    const [totalRatings, setTotalRatings] = useState(0)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)
    const [totalReposts, setTotalReposts] = useState(0)
    const [totalLinks, setTotalLinks] = useState(0)
    // TODO: change account state below to true/false booleans
    const [accountLike, setAccountLike] = useState(0)
    const [accountRating, setAccountRating] = useState(0)
    const [accountRepost, setAccountRepost] = useState(0)
    const [accountLink, setAccountLink] = useState(0)
    let accountTurn // set up account turn

    const [blockedSpaces, setBlockedSpaces] = useState([])
    const [reactionsOpen, setReactionsOpen] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [deletePostModalOpen, setDeletePostModalOpen] = useState(false)


    const finishedLoading = location !== 'post-page' || !postContextLoading
    const isOwnPost = finishedLoading && accountData.id === creator.id
    const showLinkPreview = (urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null)
    const postSpaces = DirectSpaces && DirectSpaces.filter(space => space.type === 'post')

    let backgroundColor
    if (type === 'text') backgroundColor = colors.green
    if (type === 'url') backgroundColor = colors.yellow
    if (type === 'poll') backgroundColor = colors.red
    if (type === 'glass-bead') backgroundColor = colors.blue
    if (type === 'plot-graph') backgroundColor = colors.orange
    if (type === 'prism') backgroundColor = colors.purple

    function syncPostState() {
        setReactionsOpen(false)
        setTotalComments(total_comments)
        setTotalReactions(total_reactions)
        setTotalLikes(total_likes)
        setTotalRatings(total_ratings)
        setTotalRatingPoints(total_rating_points)
        setTotalReposts(total_reposts)
        setTotalLinks(total_links)
        setAccountLike(account_like)
        setAccountRating(account_rating)
        setAccountRepost(account_repost)
        setAccountLink(account_link)
        setBlockedSpaces([...DirectSpaces.map(s => s.handle), ...IndirectSpaces.map(s => s.handle)])
    }

    function deletePost() {
        console.log('PostCard: deletePost')
        axios.delete(config.apiURL + '/delete-post', { data: { postId: id } })
            .then(setTimeout(() => { 
                if (location === 'holon-posts') { getHolonPosts() }
                if (location === 'user-created-posts') { getCreatedPosts() }
                if (location === 'post-page') { history.push('/s/all') }
            }, 200))
            .catch(error => { console.log(error) })
    }

    function createPostFromTurn() {
        if (isLoggedIn) {
            let data = {
                creatorName: creator.name,
                creatorHandle: creator.handle,
                creatorFlagImagePath: creator.flagImagePath,
                postId: id
            }
            setCreatePostFromTurn(true)
            setCreatePostFromTurnData(data)
            setCreatePostModalOpen(true)
        } else {
            setAlertMessage('Log in to add a turn'); setAlertModalOpen(true)
        }
    }

    useEffect(() => {
        if (postData.id) { syncPostState() }
    }, [postData.id])

    if (finishedLoading) {
        return (
            <div className={styles.post}>
                {location !== 'post-page' && location !== 'holon-post-map' && <div className={styles.index}>{index + 1}</div>}
                <div className={styles.body}>
                    <div className={styles.tags}>
                        <Link to={ `/u/${creator.handle}`} className={styles.creator}>
                            <SmallFlagImage type='user' size={35} imagePath={creator.flagImagePath}/>
                            <span className='ml-10 mr-5'>{ creator.name }</span>
                        </Link>
                        <span className={styles.subText}>to</span>
                        <div className={styles.postSpaces}>
                            {postSpaces.length > 0
                                ? postSpaces.map((space, index) =>
                                    <Link to={`/s/${space.handle}`}
                                        onClick={ () => setHolonHandle(space.handle) }
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
                        <Link to={`/p/${id}`} className={styles.link} onClick={() => setSelectedNavBarItem('')}>
                            
                            
                            <img className={styles.linkIcon} src={'/icons/link-solid.svg'} alt=''/>
                            <span className={styles.subText} title={dateCreated(createdAt)}>
                                {timeSinceCreated(createdAt)}
                            </span>
                        </Link>
                        {/* <span className={styles.subText}>|</span> */}
                        <div className={styles.postTypeFlag} style={{ backgroundColor }} title={type}/>
                        {isOwnPost &&
                            <span className={styles.delete} onClick={() => setDeletePostModalOpen(true)}>Delete</span>
                            // <div className={styles.interactItem} onClick={deletePost}>
                            //     <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                            //     <span className='greyText'>Delete</span>
                            // </div>
                        }
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
                                    className={`${styles.icon} ${(accountLike || accountRating || accountRepost || accountLink > 0) && styles.selected}`}
                                    src="/icons/fire-alt-solid.svg" alt=''
                                />
                                <span className={'greyText'}>{totalReactions} Reactions</span>
                            </div>
                            <div className={styles.interactItem} onClick={() => setCommentsOpen(!commentsOpen)}>
                                {/* to={`/p/${id}`} */}
                                <img className={styles.icon} src="/icons/comment-solid.svg" alt=''/>
                                <span className='greyText'>{ totalComments } Comments</span>
                            </div>
                            {type === 'glass-bead' &&
                                <div className={styles.interactItem} onClick={() => createPostFromTurn() }>
                                    <img 
                                        className={`${styles.icon} ${(accountTurn > 0) && styles.selected}`}
                                        src="/icons/arrow-alt-circle-right-solid.svg" alt=''
                                    />
                                    <span className={'greyText'}>Add turn</span>
                                </div>
                            }
                            {/* {isOwnPost &&
                                <div className={styles.interactItem} onClick={deletePost}>
                                    <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                    <span className='greyText'>Delete</span>
                                </div>
                            } */}
                        </div>
                        {reactionsOpen &&
                            <PostCardReactions
                                postData={postData}
                                totalReactions={totalReactions} setTotalReactions={setTotalReactions}
                                totalLikes={totalLikes} setTotalLikes={setTotalLikes}
                                totalRatings={totalRatings} setTotalRatings={setTotalRatings}
                                totalRatingPoints={totalRatingPoints} setTotalRatingPoints={setTotalRatingPoints}
                                totalReposts={totalReposts} setTotalReposts={setTotalReposts}
                                totalLinks={totalLinks} setTotalLinks={setTotalLinks}
                                accountLike={accountLike} setAccountLike={setAccountLike}
                                accountRating={accountRating} setAccountRating={setAccountRating}
                                accountRepost={accountRepost} setAccountRepost={setAccountRepost}
                                accountLink={accountLink} setAccountLink={setAccountLink}
                                blockedSpaces={blockedSpaces} setBlockedSpaces={setBlockedSpaces}
                                commentsOpen={commentsOpen}
                            />
                        }
                        {commentsOpen &&
                            <PostCardComments
                                postId={postData.id}
                                totalComments={totalComments}
                                setTotalComments={setTotalComments}/>
                        }
                        {deletePostModalOpen &&
                            <DeleteItemModal
                                text='Are you sure you want to delete your post?'
                                endpoint='delete-post'
                                itemId={postData.id}
                                getItems1={() => {
                                    if (location === 'holon-posts') return getHolonPosts()
                                    if (location === 'user-created-posts') return getCreatedPosts()
                                    if (location === 'post-page') return history.push('/s/all')
                                }}
                                getItems2={() => {
                                    if (location === 'holon-posts') return getHolonData()
                                    if (location === 'user-created-posts') return getUserData()
                                    if (location === 'post-page') return history.push('/s/all')
                                }}
                                setDeleteItemModalOpen={setDeletePostModalOpen}
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
//     axios({ method: 'put', url: config.apiURL + '/pinpost', data: { id } })
//         //.then(setTimeout(() => { updatePosts() }, 100))
//         .catch(error => { console.log(error) })
// }

// function unpinPost() {
//     axios({ method: 'put', url: config.apiURL + '/unpinpost', data: { id } })
//         //.then(setTimeout(() => { updatePosts() }, 100))
//         .catch(error => { console.log(error) })
// }

{/* {pins && <div className={styles.pinFlag} onClick={ unpinPost }></div>} */}