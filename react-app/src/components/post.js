import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Post.module.scss'
import PostReactionModal from './PostReactionModal'

function Post(props) {
    const { updateHolonContext, holonData } = useContext(HolonContext)
    const [reactionModalOpen, setReactionModalOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [reactions, setReactions] = useState(0)
    const [likes, setLikes] = useState(0)
    const [hearts, setHearts] = useState(0)
    const [ratings, setRatings] = useState(0)
    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)

    const { 
        id,
        user,
        title,
        description,
        pins,
        createdAt,
        Labels,
        Comments
    } = props.post

    const {
        post,
        pinnedPost,
        pinFlag,
        postId,
        postBody,
        postTags,
        userThumbnail,
        holonNames,
        postSubText,
        postContent,
        postTitle,
        postDescription,
        postInteract,
        postInteractItem,
        postIcon,
        opacity50,
    } = styles

    useEffect(() => {
        setReactions(Labels.length)
        function findNumberofLabels(labelType) { 
            return Labels.filter((label) => label.type === labelType).length
        }
        setLikes(findNumberofLabels('like'))
        setHearts(findNumberofLabels('heart'))
        setRatings(findNumberofLabels('rating'))
        setTotalRatingPoints(Labels
            .filter((label) => label.type === 'rating') // find all the posts ratings
            .map((rating) => parseInt(rating.value, 10)) // convert rating values to numbers (stored as strings in DB)
            .reduce((a, b) => a + b, 0)) // add all ratings values together
    }, [props])
    
    const holonId = holonData.id // Re-named to match the column name in the database

    function addLike() {
        setLikes(likes + 1)
        setReactions(reactions + 1)
        axios.put(config.environmentURL + '/addLike', { id, holonId })
            .catch(error => { console.log(error) })
    }

    function addHeart() {
        setHearts(hearts + 1)
        setReactions(reactions + 1)
        axios.put(config.environmentURL + '/addHeart', { id, holonId })
            .catch(error => { console.log(error) })
    }

    function addRating() {
        if (!isNaN(newRating) && newRating !== '' && newRating <= 100) {
            setRatings(ratings + 1)
            setReactions(reactions + 1)
            setTotalRatingPoints(totalRatingPoints + parseInt(newRating, 10))
            axios.put(config.environmentURL + '/addRating', { id, holonId, newRating })
                .then(setNewRating(''))
                .catch(error => { console.log(error) })
        } else { setNewRatingError(true) }
    }

    function toggleReactionModal() { //change 'reactions' to 'reaction'
        setReactionModalOpen(!reactionModalOpen)
    }

    function toggleRatingModal() {
        setRatingModalOpen(!ratingModalOpen)
    }

    function deletePost() {
        axios.delete(config.environmentURL  + '/deletePost', { data: { id } })
            //.then(setTimeout(() => { updatePosts() }, 100))
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

    function totalRatingScore() {
        if (ratings) { return (totalRatingPoints / ratings).toFixed(2) + '%'
        } else { return 'N/A' }
    }

    // TODO: Check if isLoading conditionals required any more (on both walls and post pages)
    return (
        <div className={`${post}` + (pins ? ` ${pinnedPost}` : '')}>
            {/* {pins && <div className={pinFlag} onClick={ unpinPost }></div>} */}
            {!pins && !props.isPostPage && <div className={postId}>{ props.index + 1 }</div>}
            <div className={postBody}>
                <div className={postTags}>
                    <span className={userThumbnail}></span>
                    <span className={postSubText}>{ user || 'Anonymous' }</span>
                    <span className={postSubText}>to</span>
                    {!props.postPageLoading &&  /* Wait until the post has finished loading before displaying the holons to prevent errors */
                        <div className={holonNames}>
                            {props.post.Holons.length >= 1 ? 
                                props.post.Holons.map((holon, index) =>
                                    <Link to={ `/h/${holon.handle}/wall` }
                                        onClick={ () => { updateHolonContext(holon.handle) } }
                                        style={{marginRight: 10}}
                                        key={index}>
                                        {holon.handle}
                                    </Link>
                                )
                                : <div style={{marginRight: 10}}>root</div>}
                        </div>
                    }
                    <span className={postSubText}>|</span>
                    {!props.postPageLoading && /* Wait until the post has finished loading before formatting the date to prevent errors */
                        <span className={postSubText}>{ formatDate() || 'no date' }</span>
                    }
                </div>
                <div className={postContent}>
                    <Link to={ `/p/${id}` } className={postTitle}>{ title }</Link>
                    <div className={postDescription}>{ description }</div>    
                    <div className={postInteract}>
                        <div className={postInteractItem} onClick={() => toggleReactionModal()}> {/* onClick={ addLike } */}
                            <img className={postIcon} src="/icons/fire-alt-solid.svg"/>
                            <span>{ reactions } Reactions</span>
                        </div>
                        <PostReactionModal
                            likes={likes}
                            hearts={hearts}
                            ratings={ratings}
                            reactionModalOpen={reactionModalOpen}
                            toggleReactionModal={toggleReactionModal}
                            addLike={addLike}
                            addHeart={addHeart}
                            ratingModalOpen={ratingModalOpen}
                            toggleRatingModal={toggleRatingModal}
                            totalRatingScore={totalRatingScore}
                            newRating={newRating}
                            setNewRating={setNewRating}
                            newRatingError={newRatingError}
                            setNewRatingError={setNewRatingError}
                            addRating={addRating}
                            Labels={Labels}
                        />
                        {!props.isPostPage && /* Link removed from PostPage to prevent loading issue with Labels */
                            <Link className={postInteractItem} 
                                to={ `/p/${id}` }>
                                <img className={postIcon} src="/icons/comment-solid.svg"/>
                                <span>{ Comments.length } Comments</span>
                            </Link>
                        }
                        {props.isPostPage && /* Replaced with unclickable div */
                            <div className={postInteractItem}>
                                <img className={postIcon} src="/icons/comment-solid.svg"/>
                                <span>{ Comments.length } Comments</span>
                            </div>
                        }
                        <div className={postInteractItem} onClick={ deletePost }>
                            <img className={postIcon} src="/icons/trash-alt-solid.svg"/>
                            <span>Delete</span>
                        </div>
                        {!pins && <div className={`${postInteractItem} ${opacity50}`}>{/* onClick={ pinPost } */}
                            <img className={postIcon} src="/icons/thumbtack-solid.svg"/>
                            <span>Pin post</span>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post