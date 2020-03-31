import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { HolonContext } from '../contexts/HolonContext'

function Post(props) {
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

    const { updateHolonContext, holonData } = useContext(HolonContext)
    const [reactionsModalOpen, setReactionsModalOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [reactions, setReactions] = useState(0)
    const [likes, setLikes] = useState(0)
    const [hearts, setHearts] = useState(0)
    const [ratings, setRatings] = useState(0)
    const [newRating, setNewRating] = useState('')
    const [newRatingError, setNewRatingError] = useState(false)
    const [totalRatingPoints, setTotalRatingPoints] = useState(0)

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
            setRatings(ratings + 1) //try +=
            setReactions(reactions + 1)
            setTotalRatingPoints(totalRatingPoints + parseInt(newRating, 10))
            axios.put(config.environmentURL + '/addRating', { id, holonId, newRating })
                .then(setNewRating(''))
                .catch(error => { console.log(error) })
        } else { setNewRatingError(true) }
    }

    function toggleReactionsModal() { //change 'reactions' to 'reaction'
        setReactionsModalOpen(!reactionsModalOpen)
    }

    function toggleRatingModal() {
        setRatingModalOpen(!ratingModalOpen)
    }

    function deletePost() {
        //console.log(id)
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

    // TODO: Check is isLoading conditionals required any more (on both walls and post pages)
    return (
        <>
            <div className={"post " + (pins ? 'pinned-post' : '')}>
                {/* {pins && <div className="pin-flag" onClick={ unpinPost }></div>} */}
                {!pins && !props.isPostPage && <div className="post-id">{ props.index + 1 }</div>}
                <div className="post-body">
                    <div className="post-tags">
                        <span className="user-thumbnail mr-10"></span>
                        <span className="sub-text mr-10">{ user || 'Anonymous' }</span>
                        <span className="sub-text mr-10">to</span>
                        {!props.postPageLoading &&  /* Wait until the post has finished loading before displaying the holons to prevent errors */
                            <div className="holon-names">
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
                        <span className="sub-text mr-10">|</span>
                        {!props.postPageLoading && /* Wait until the post has finished loading before formatting the date to prevent errors */
                            <span className="sub-text">{ formatDate() || 'no date' }</span>
                        }
                    </div>
                    <div className="post-content">
                        <Link to={ `/p/${id}` } className="post-title">{ title }</Link>
                        <div className="post-description">{ description }</div>    
                        <div className="post-interact">
                            <div className="post-interact-item" onClick={() => toggleReactionsModal()}> {/* onClick={ addLike } */}
                                <img className="post-icon" src="/icons/fire-alt-solid.svg"/>
                                <span>{ reactions } Reactions</span>
                            </div>

                            <div className={"post-reactions-modal " + (reactionsModalOpen ? 'visible' : '') }>

                                <img className="post-reactions-modal-close-button"
                                    src="/icons/close-01.svg"
                                    onClick={() => toggleReactionsModal()}/>

                                <div className="post-reactions-modal-item" onClick={() => addLike()}>
                                    <img className="post-icon" src="/icons/thumbs-up-solid.svg"/>
                                    <div className="">{ likes } Likes</div>
                                </div>

                                <div className="post-reactions-modal-item" onClick={() => addHeart()}>
                                    <img className="post-icon" src="/icons/heart-solid.svg"/>
                                    <div className="">{ hearts } Hearts</div>
                                </div>

                                <div className="post-reactions-modal-item" onClick={() => toggleRatingModal()}>
                                    <img className="post-icon" src="/icons/star-solid.svg"/>
                                    <div className="">{ ratings } Ratings</div>
                                </div>

                                <div className={"post-rating-modal " + (ratingModalOpen && 'visible') }>
                                    <div className="post-rating-modal-total-score">
                                        <div className="post-rating-modal-total-score-bar">
                                            <div className="post-rating-modal-total-score-percentage" style={{width: totalRatingScore()}}/>
                                            <div className="post-rating-modal-total-score-text">{totalRatingScore()}</div>
                                        </div>
                                    </div>
                                    <div className="post-rating-modal-input-wrapper">
                                        <input className={"post-rating-modal-input " + (newRatingError ? 'error' : '')}
                                            type="text"
                                            value={ newRating }
                                            onChange={(e) => {setNewRating(e.target.value); setNewRatingError(false)}}/>
                                        <div className="">/ 100</div>
                                    </div>
                                    <div className="post-rating-modal-button"
                                        onClick={() => addRating()}>
                                        Add rating
                                    </div>
                                </div>

                                <div className="post-reactions-modal-item opacity-50">
                                    <img className="post-icon" src="/icons/hashtag-solid.svg"/>
                                    <div className="">{ Labels.filter((label)=> label.type === 'tag').length } Tags</div>
                                </div>

                                <div className="post-reactions-modal-item opacity-50">
                                    <img className="post-icon" src="/icons/tags-solid.svg"/>
                                    <div className="">{ Labels.filter((label)=> label.type === 'label').length } Labels</div>
                                </div>

                                <div className="post-reactions-modal-item opacity-50">
                                    <img className="post-icon" src="/icons/flag-solid.svg"/>
                                    <div className="">{ Labels.filter((label)=> label.type === 'flag').length } Flags</div>
                                </div>

                                <div className="post-reactions-modal-item opacity-50">
                                    <img className="post-icon" src="/icons/link-solid.svg"/>
                                    <div className="">{ Labels.filter((label)=> label.type === 'link').length } Links</div>
                                </div>
                            </div>

                            {!props.isPostPage && /* Link removed from PostPage to prevent loading issue with Labels */
                                <Link className="post-interact-item" 
                                    to={ `/p/${id}` }>
                                    <img className="post-icon" src="/icons/comment-solid.svg"/>
                                    <span>{ Comments.length } Comments</span>
                                </Link>
                            }
                            {props.isPostPage && /* Replaced with unclickable div */
                                <div className="post-interact-item">
                                    <img className="post-icon" src="/icons/comment-solid.svg"/>
                                    <span>{ Comments.length } Comments</span>
                                </div>
                            }
                            <div className="post-interact-item" onClick={ deletePost }>
                                <img className="post-icon" src="/icons/trash-alt-solid.svg"/>
                                <span>Delete</span>
                            </div>
                            {!pins && <div className="post-interact-item opacity-50">{/* onClick={ pinPost } */}
                                <img className="post-icon" src="/icons/thumbtack-solid.svg"/>
                                <span>Pin post</span>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .post {
                    margin-bottom: 10px;
                    padding: 20px 30px;
                    width: 100%;
                    border-radius: 10px;
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.05);
                    display: flex;
                    flex-direction: row;
                    transition-property: background-color;
                    //transition-duration: 2s;
                    position: relative;
                    //z-index: 1;
                    opacity: 1;
                }
                .pinned-post {
                    background-color: #f1f6ff;
                }
                .pin-flag {
                    background-image: url(/icons/pin-01.png);
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-color: transparent;
                    border: none;
                    height: 17px;
                    width: 17px;
                    padding: 0;
                    opacity: 0.4;
                    margin-right: 5px;
                    position: absolute;
                    right: 15px;
                }
                .pin-flag:hover {
                    cursor: pointer;
                }
                .post-id {
                    //width: 60px;
                    margin-right: 30px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    color: #aaa;
                }
                @media screen and (max-width: 700px) {
                    .post-id {
                        display: none;
                    }
                }
                .post-body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    overflow: hidden;
                }
                .post-tags {
                    //height: 40px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .user-thumbnail {
                    background-image: url(/icons/user-image-00.jpg);
                    background-position: center;
                    background-size: cover;
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    flex-shrink: 0
                }
                .holon-names {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    //margin-right: 10px;
                }
                .sub-text {
                    color: #888;
                }
                .post-content {
                    display: flex;
                    flex-direction: column;
                }
                .post-title {
                    color: black;
                    font-size: 24px;
                    font-weight: 600;
                    text-decoration: none;
                    margin-bottom: 10px;
                    transition-property: color;
                    transition-duration: 2s;
                }
                .post-description {
                    color: black;
                    font-size: 16px;
                    font-weight: 400;
                    text-decoration: none;
                    padding-bottom: 10px;
                    transition-property: color;
                    transition-duration: 2s;
                }
                .post-interact {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-shrink: 0;
                    flex-wrap: wrap;
                }
                .post-interact-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-shrink: 0;
                    margin-right: 15px;
                    color: #888;
                }
                .post-interact-item:hover {
                    cursor: pointer;
                }
                .post-reactions-modal {
                    width: 160px;
                    background-color: white;
                    border-radius: 10px;
                    padding: 10px 20px;
                    position: absolute;
                    top: 170px;
                    left: 50px;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.15);
                    z-index: -1;
                    opacity: 0;
                }
                .post-reactions-modal.visible {
                    opacity: 1;
                    z-index: 2;
                }
                .post-reactions-modal-close-button {
                    height: 17px;
                    width: 17px;
                    padding: 0;
                    opacity: 0.2;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
                .post-reactions-modal-close-button:hover {
                    cursor: pointer;
                    opacity: 0.4;
                }
                .post-reactions-modal-item {
                    height: 30px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .post-reactions-modal-item:hover {
                    cursor: pointer;
                }
                .post-icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                    opacity: 0.3;
                }
                .post-icon:hover {
                    opacity: 0.5;
                }
                .opacity-50 {
                    opacity: 0.5;
                }
                .post-rating-modal {
                    z-index: 0;
                    display: none;
                    flex-direction: column;
                    //align-items: center;
                    margin: 5px 0;
                }
                .post-rating-modal.visible {
                    display: flex;
                    z-index: 1;
                }
                .post-rating-modal-total-score {
                    width: 100%;
                    margin-bottom: 8px;
                }
                .post-rating-modal-total-score-bar {
                    width: 100%;
                    height: 30px;
                    background-color: #eaeaea;
                    position: relative;
                }
                .post-rating-modal-total-score-percentage {
                    height: 30px;
                    background-color: #9ed5ff;
                }
                .post-rating-modal-total-score-text {
                    position: absolute;
                    top: 3px;
                    width: 100%;
                    text-align: center;
                }
                .post-rating-modal-input-wrapper {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 30px;
                    margin-bottom: 7px;
                }
                .post-rating-modal-input {
                    width: 40px;
                    height: 30px;
                    outline: none;
                    border: 1px solid rgba(0,0,0,0.1);
                    margin-right: 10px;
                    padding: 0 3px;
                    font-size: 16px;
                    text-align: center;
                }
                .post-rating-modal-input.error {
                    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.6);
                }
                .post-rating-modal-button {
                    background-color: #3a88f0;
                    color: white;
                    height: 40px;
                    border-radius: 5px;
                    padding: 0px 15px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.1);
                    border: none;
                    font-size: 14px;
                    font-weight: 800;
                    transition-property: box-shadow, background-color;
                    transition-duration: 0.3s, 2s;
                }
            `}</style>
        </>
    )
}

export default Post