import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { HolonContext } from '../contexts/HolonContext'

function Post(props) {
    const { updateHolonContext, holonData } = useContext(HolonContext)
    const [likes, setLikes] = useState(0)
    const [reactionsModalOpen, setReactionsModalOpen] = useState(false)

    useEffect(() => {
        setLikes(props.post.Labels.filter((label) => label.type === 'like').length)
    }, [props])

    const { id, user, title, description, comments, pins, createdAt, Labels } = props.post
      
    function addLike() {
        const newLikes = likes + 1
        const holonId = holonData.id
        setLikes(newLikes)
        axios({ method: 'put', url: config.environmentURL + '/addLike', data: { id, holonId } })
            .catch(error => { console.log(error) })
    }

    function toggleReactionsModal() { 
        setReactionsModalOpen(!reactionsModalOpen)
    }

    function deletePost() {
        axios({ method: 'delete', url: config.environmentURL, data: { id } })
            //.then(setTimeout(() => { updatePosts() }, 100))
            .catch(error => { console.log(error) })
    }

    function pinPost() {
        axios({ method: 'put', url: config.environmentURL + '/pinpost', data: { id } })
            //.then(setTimeout(() => { updatePosts() }, 100))
            .catch(error => { console.log(error) })
    }

    function unpinPost() {
        axios({ method: 'put', url: config.environmentURL + '/unpinpost', data: { id } })
            //.then(setTimeout(() => { updatePosts() }, 100))
            .catch(error => { console.log(error) })
    }

    function formatDate() {
        const a = createdAt.split(/[-.T :]/)
        const formattedDate = a[3]+':'+a[4]+' on '+a[2]+'-'+a[1]+'-'+a[0]
        return formattedDate
    }

    // TODO: Check is isLoading conditionals required any more (on both walls and post pages)
    return (
        <>
            <div className={"post " + (pins ? 'pinned-post' : '')}>
                {pins && <div className="pin-flag" onClick={ unpinPost }></div>}
                {!pins && !props.isPostPage && <div className="post-id">{ props.index + 1 }</div>}
                <div className="post-body">
                    <div className="post-tags">
                        <span className="user-thumbnail mr-10"></span>
                        <span className="sub-text mr-10">{ user || 'Anonymous' }</span>
                        <span className="sub-text mr-10">to</span>
                        {!props.isLoading &&  /* Wait until the post has finished loading before displaying the holons to prevent errors */
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
                        {!props.isLoading && /* Wait until the post has finished loading before formatting the date to prevent errors */
                            <span className="sub-text">{ formatDate() || 'no date' }</span>
                        }
                    </div>
                    <div className="post-content">
                        <Link to={ `/p/${id}` } className="post-title">{ title }</Link>
                        <div className="post-description">{ description }</div>    
                        <div className="post-interact">
                            <div className="post-interact-item" onClick={() => toggleReactionsModal()}> {/* onClick={ addLike } */}
                                <div className="like-icon"/>
                                <span>{ likes } Reactions</span>
                            </div>



                            {reactionsModalOpen && 
                                <div className="post-reactions-modal">
                                    <div className="post-reactions-modal-close-button"/>
                                    <div className="">Post reactions...</div>
                                </div>
                            }



                            {!props.isPostPage && /* Link removed from PostPage to prevent loading issue with Labels */
                                <Link className="post-interact-item" 
                                    to={ `/p/${id}` }>
                                    <div className="comment-icon"/>
                                    <span>{ comments } Comments</span>
                                </Link>
                            }
                            {props.isPostPage && /* Replaced with unclickable div */
                                <div className="post-interact-item">
                                    <div className="comment-icon"/>
                                    <span>{ comments } Comments</span>
                                </div>
                            }
                            <div className="post-interact-item" onClick={ deletePost }>
                                <div className="delete-icon"/>
                                <span>Delete</span>
                            </div>
                            {!pins && <div className="post-interact-item" onClick={ pinPost }>
                                <div className="pin-icon"/>
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
                    transition-duration: 2s;
                    position: relative;
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
                    margin-right: 10px;
                    color: #888;
                }
                .post-interact-item:hover {
                    cursor: pointer;
                }
                .post-reactions-modal {
                    width: 300px;
                    height: 100px;
                    background-color: white;
                    border-radius: 10px;
                    position: absolute;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.15);
                    z-index: 5;
                }
                .like-icon {
                    background-image: url(/icons/heart-solid.svg);
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
                }
                .comment-icon {
                    background-image: url(/icons/comment-02.svg);
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
                }
                .delete-icon {
                    background-image: url(/icons/delete-01.png);
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
                }
                .pin-icon {
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
                }
            `}</style>
        </>
    )
}

export default Post