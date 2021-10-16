import React, { useState, useContext, useEffect, useRef } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import { UserContext } from '@contexts/UserContext'
import { PostContext } from '@contexts/PostContext'
import styles from '@styles/components/PostCard.module.scss'
// import colors from '@styles/Colors.module.scss'
import PostCardReactions from '@components/Cards/PostCard/PostCardReactions'
import PostCardUrlPreview from '@components/Cards/PostCard/PostCardUrlPreview'
import PostCardComments from '@components/Cards/PostCard/PostCardComments'
import FlagImage from '@components/FlagImage'
import DeleteItemModal from '@components/Modals/DeleteItemModal'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import { timeSinceCreated, dateCreated } from '@src/Functions'
import { IPost } from '@src/Interfaces'

const PostCard = (props: {
    postData: Partial<IPost>
    index?: number
    location: string
}): JSX.Element => {
    const { postData, index, location } = props
    const {
        isLoggedIn,
        accountData,
        setAlertMessage,
        setAlertModalOpen,
        setCreatePostModalOpen,
        // setCreatePostFromTurn,
        // setCreatePostFromTurnData,
    } = useContext(AccountContext)
    // const { getSpaceData, getSpacePosts } = useContext(SpaceContext)
    // const { getUserPosts, getUserData } = useContext(UserContext)
    // const { setPostDataLoading } = useContext(PostContext)
    const history = useHistory()

    // console.log('postData: ', postData);

    // remote post state
    const {
        id,
        creator,
        type,
        text,
        url,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription,
        createdAt,
        total_comments,
        total_reactions,
        total_likes,
        total_ratings,
        total_rating_points,
        total_reposts,
        total_links,
        account_like,
        account_rating,
        account_repost,
        account_link,
        DirectSpaces,
        IndirectSpaces,
    } = postData

    // local post state
    const [totalComments, setTotalComments] = useState<number | undefined>(0)
    const [totalReactions, setTotalReactions] = useState<number | undefined>(0)
    const [totalLikes, setTotalLikes] = useState<number | undefined>(0)
    const [totalRatings, setTotalRatings] = useState<number | undefined>(0)
    const [totalRatingPoints, setTotalRatingPoints] = useState<number | undefined>(0)
    const [totalReposts, setTotalReposts] = useState<number | undefined>(0)
    const [totalLinks, setTotalLinks] = useState<number | undefined>(0)
    // TODO: change account state below to true/false booleans
    const [accountLike, setAccountLike] = useState<number | undefined>(0)
    const [accountRating, setAccountRating] = useState<number | undefined>(0)
    const [accountRepost, setAccountRepost] = useState<number | undefined>(0)
    const [accountLink, setAccountLink] = useState<number | undefined>(0)
    // let accountTurn // set up account turn

    const [blockedSpaces, setBlockedSpaces] = useState([]) as any[]
    const [reactionsOpen, setReactionsOpen] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [deletePostModalOpen, setDeletePostModalOpen] = useState(false)

    const isOwnPost = accountData && creator && accountData.id === creator.id
    const showLinkPreview =
        urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null
    // todo: look into why type: 'post' is used...
    const postSpaces = DirectSpaces && DirectSpaces.filter((space) => space.type === 'post')

    const postRef = useRef<HTMLDivElement>(null)

    function syncPostState() {
        setReactionsOpen(false)
        setCommentsOpen(false)
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
        if (DirectSpaces && IndirectSpaces) {
            setBlockedSpaces([
                ...DirectSpaces.map((s) => s.handle),
                ...IndirectSpaces.map((s) => s.handle),
            ])
        }
    }

    // function createPostFromTurn() {
    //     if (isLoggedIn && creator) {
    //         const data = {
    //             creatorName: creator.name,
    //             creatorHandle: creator.handle,
    //             creatorFlagImagePath: creator.flagImagePath,
    //             postId: id,
    //         }
    //         setCreatePostFromTurn(true)
    //         setCreatePostFromTurnData(data)
    //         setCreatePostModalOpen(true)
    //     } else {
    //         setAlertMessage('Log in to add a turn')
    //         setAlertModalOpen(true)
    //     }
    // }

    useEffect(() => {
        if (postData.id) {
            syncPostState()
        }
    }, [postData.id])

    let locationStyle
    if (location === 'post-page') locationStyle = styles.postPage
    if (location === 'holon-posts') locationStyle = styles.spacePosts

    return (
        <div className={`${styles.post} ${locationStyle}`} ref={postRef}>
            {/* {location !== 'post-page' && location !== 'holon-post-map' && location !== 'create-post-modal' &&
                <div className={styles.index}>{index + 1}</div>
            } */}
            <div className={styles.body}>
                <div className={styles.tags}>
                    <Link to={`/u/${creator && creator.handle}`} className={styles.creator}>
                        <FlagImage
                            size={35}
                            type='user'
                            imagePath={(creator && creator.flagImagePath) || null}
                        />
                        <span className={styles.creatorName}>{creator && creator.name}</span>
                    </Link>
                    <span className={styles.subText}>to</span>
                    <div className={styles.postSpaces}>
                        {postSpaces && postSpaces.length > 0 ? (
                            postSpaces.map((space) => (
                                <>
                                    {space.state === 'active' ? (
                                        <Link to={`/s/${space.handle}`} key={space.handle}>
                                            {space.handle}
                                        </Link>
                                    ) : (
                                        <p>{space.handle} (removed)</p>
                                    )}
                                </>
                            ))
                        ) : (
                            <Link to='/s/all'>all</Link>
                        )}
                    </div>
                    <span className={styles.subText}>•</span>
                    <Link to={`/p/${id}`} className={styles.link}>
                        <img className={styles.linkIcon} src='/icons/link-solid.svg' alt='' />
                        <span className={styles.subText} title={dateCreated(createdAt)}>
                            {timeSinceCreated(createdAt)}
                        </span>
                    </Link>
                    {/* <span className={styles.subText}>•</span> */}
                    {/* <div className={styles.postTypeFlag} style={{ backgroundColor }} title={type}/> */}
                    {isOwnPost && (
                        <>
                            <span className={styles.subText}>•</span>
                            <div
                                className={styles.delete}
                                role='button'
                                tabIndex={0}
                                onClick={() => setDeletePostModalOpen(true)}
                                onKeyDown={() => setDeletePostModalOpen(true)}
                            >
                                Delete
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.content}>
                    {text && (
                        <div className={styles.text}>
                            <ShowMoreLess height={150}>
                                <Markdown text={text} />
                            </ShowMoreLess>
                        </div>
                    )}
                    {showLinkPreview && (
                        <PostCardUrlPreview
                            url={url || null}
                            urlImage={urlImage || null}
                            urlDomain={urlDomain || null}
                            urlTitle={urlTitle || null}
                            urlDescription={urlDescription || null}
                        />
                    )}
                    <div className={styles.interact}>
                        <div
                            className={styles.interactItem}
                            role='button'
                            tabIndex={0}
                            onClick={() => setReactionsOpen(!reactionsOpen)}
                            onKeyDown={() => setReactionsOpen(!reactionsOpen)}
                        >
                            <img
                                className={`${styles.icon} ${
                                    (accountLike ||
                                        accountRating ||
                                        accountRepost ||
                                        (accountLink && accountLink > 0)) &&
                                    styles.selected
                                }`}
                                src='/icons/fire-alt-solid.svg'
                                alt=''
                            />
                            <span className='greyText'>{totalReactions} Reactions</span>
                        </div>
                        <div
                            className={styles.interactItem}
                            role='button'
                            tabIndex={0}
                            onClick={() => setCommentsOpen(!commentsOpen)}
                            onKeyDown={() => setCommentsOpen(!commentsOpen)}
                        >
                            <img className={styles.icon} src='/icons/comment-solid.svg' alt='' />
                            <span className='greyText'>{totalComments} Comments</span>
                        </div>
                        {/* {type === 'glass-bead' && (
                            <div
                                className={styles.interactItem}
                                role='button'
                                tabIndex={0}
                                onClick={() => createPostFromTurn()}
                                onKeyDown={() => createPostFromTurn()}
                            >
                                <img
                                    className={`${styles.icon} ${
                                        accountTurn > 0 && styles.selected
                                    }`}
                                    src='/icons/arrow-alt-circle-right-solid.svg'
                                    alt=''
                                />
                                <span className='greyText'>Add turn</span>
                            </div>
                        )} */}
                        {type === 'glass-bead-game' && (
                            <Link
                                to={`/p/${id}`}
                                className={styles.interactItem}
                                // onClick={() => {
                                //     setPostDataLoading(true)
                                // }}
                            >
                                <img
                                    className={styles.icon}
                                    src='/icons/arrow-alt-circle-right-solid.svg'
                                    alt=''
                                />
                                <span className='greyText'>Open game</span>
                            </Link>
                        )}
                        {type === 'prism' && (
                            <Link
                                to={`/p/${id}`}
                                className={styles.interactItem}
                                // onClick={() => {
                                //     // setPostDataLoading(true)
                                // }}
                            >
                                <img
                                    className={styles.icon}
                                    src='/icons/arrow-alt-circle-right-solid.svg'
                                    alt=''
                                />
                                <span className='greyText'>Open prism</span>
                            </Link>
                        )}
                        {type === 'decision-tree' && (
                            <Link
                                to={`/p/${id}`}
                                className={styles.interactItem}
                                // onClick={() => {
                                //     // setPostDataLoading(true)
                                // }}
                            >
                                <img
                                    className={styles.icon}
                                    src='/icons/arrow-alt-circle-right-solid.svg'
                                    alt=''
                                />
                                <span className='greyText'>Open decision tree</span>
                            </Link>
                        )}
                    </div>
                    {reactionsOpen && (
                        <PostCardReactions
                            postData={postData}
                            totalReactions={totalReactions}
                            totalLikes={totalLikes}
                            totalRatings={totalRatings}
                            totalRatingPoints={totalRatingPoints}
                            totalReposts={totalReposts}
                            totalLinks={totalLinks}
                            accountLike={accountLike}
                            accountRating={accountRating}
                            accountRepost={accountRepost}
                            accountLink={accountLink}
                            setTotalReactions={setTotalReactions}
                            setTotalLikes={setTotalLikes}
                            setTotalRatings={setTotalRatings}
                            setTotalRatingPoints={setTotalRatingPoints}
                            setTotalReposts={setTotalReposts}
                            setTotalLinks={setTotalLinks}
                            setAccountLike={setAccountLike}
                            setAccountRating={setAccountRating}
                            setAccountRepost={setAccountRepost}
                            setAccountLink={setAccountLink}
                            blockedSpaces={blockedSpaces}
                            setBlockedSpaces={setBlockedSpaces}
                        />
                    )}
                    {commentsOpen && (
                        <PostCardComments
                            postId={postData.id}
                            totalComments={totalComments}
                            setTotalComments={setTotalComments}
                        />
                    )}
                    {deletePostModalOpen && (
                        <DeleteItemModal
                            text='Are you sure you want to delete your post?'
                            endpoint='delete-post'
                            itemId={postData.id}
                            getItems1={() => {
                                // if (location === 'holon-posts') return getSpacePosts()
                                // if (location === 'user-created-posts') return getUserPosts(0)
                                // if (location === 'post-page') return history.push('/s/all')
                                // return null
                            }}
                            getItems2={() => {
                                // if (location === 'holon-posts') return getSpaceData()
                                // if (location === 'user-created-posts')
                                //     return getUserData(
                                //         (postData && postData.creator && postData.creator.handle) ||
                                //             ''
                                //     )
                                // if (location === 'post-page') return history.push('/s/all')
                                // return null
                            }}
                            setDeleteItemModalOpen={setDeletePostModalOpen}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

PostCard.defaultProps = {
    index: null,
}

export default PostCard

// {!pins &&
//     <div className={`${styles.postInteractItem} ${styles.opacity50}`}>{/* onClick={ pinPost } */}
//         <img className={styles.postIcon} src="/icons/thumbtack-solid.svg" alt=''/>
//         <span>Pin post</span>
//     </div>
// }

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

/* {pins && <div className={styles.pinFlag} onClick={ unpinPost }></div>} */
