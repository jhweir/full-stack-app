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
    // TODO: Move the rating state below to the PostRatingModal component
    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)

    const { 
        id,
        user,
        title,
        description,
        url,
        pins,
        createdAt,
        Labels,
        Comments,
        Holons
    } = props.post

    useEffect(() => {
        // console.log('Use effect run in post component')
        setReactions(Labels.length)
        function findNumberofLabels(labelType) { return Labels.filter((label) => label.type === labelType).length }
        setLikes(findNumberofLabels('like'))
        setHearts(findNumberofLabels('heart'))
        setRatings(findNumberofLabels('rating'))
        setTotalRatingPoints(Labels
            .filter((label) => label.type === 'rating') // find all the posts ratings
            .map((rating) => parseInt(rating.value, 10)) // convert rating values to numbers (stored as strings in DB)
            .reduce((a, b) => a + b, 0)) // add up all rating values
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

    function totalRatingScore() { // TODO: Move to rating component
        if (ratings) { return (totalRatingPoints / ratings).toFixed(2) + '%' }
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
                    <div className={styles.userImageWrapper}>
                        <img className={styles.userImagePlaceholder} src='/icons/user-solid.svg'/>
                    </div>
                    <span className={styles.postSubText}>{ user || 'Anonymous' }</span>
                    <span className={styles.postSubText}>to</span>
                    <div className={styles.holonNames}>
                        {Holons.length >= 1 ? 
                            Holons.map((holon, index) =>
                                <Link to={ `/h/${holon.handle}/wall` }
                                    onClick={ () => { updateHolonContext(holon.handle) } }
                                    style={{marginRight: 10}}
                                    key={index}>
                                    {holon.handle}
                                </Link>
                            )
                            : <div style={{marginRight: 10}}>root</div>}
                    </div>
                    <span className={styles.postSubText}>|</span>
                    {!props.postPageLoading && /* Wait until the post has finished loading before formatting the date to prevent errors */
                        <span className={styles.postSubText}>{ formatDate() || 'no date' }</span>
                    }
                </div>
                <div className={styles.postContent}>
                    {url 
                        ? <a href={url} className={styles.postTitle}>{ title }</a>
                        : <Link to={ `/p/${id}` } className={styles.postTitle}>{ title }</Link>
                    }
                    <div className={styles.postDescription}>{ description }</div>    
                    <div className={styles.postInteract}>
                        <div className={styles.postInteractItem} onClick={() => toggleReactionModal()}>
                            <img className={styles.postIcon} src="/icons/fire-alt-solid.svg"/>
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
                            // TODO: Move rating state to Rating Modal component
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
                        <Link className={styles.postInteractItem} 
                            to={ `/p/${id}` }>
                            <img className={styles.postIcon} src="/icons/comment-solid.svg"/>
                            <span>{ Comments.length } Comments</span>
                        </Link>
                        <div className={styles.postInteractItem} onClick={ deletePost }>
                            <img className={styles.postIcon} src="/icons/trash-alt-solid.svg"/>
                            <span>Delete</span>
                        </div>
                        {!pins && <div className={`${styles.postInteractItem} ${styles.opacity50}`}>{/* onClick={ pinPost } */}
                            <img className={styles.postIcon} src="/icons/thumbtack-solid.svg"/>
                            <span>Pin post</span>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post


// {!props.postPageLoading &&  /* Wait until the post has finished loading before displaying the holons to prevent errors (possibly no longer needed) */
//     <div className={styles.holonNames}>
//         {props.post.Holons.length >= 1 ? 
//             props.post.Holons.map((holon, index) =>
//                 <Link to={ `/h/${holon.handle}/wall` }
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