import React, { useState, useContext } from 'react'
import axios from 'axios'
import config from '../config'
import { PostContext } from '../contexts/PostContext'

function Post(props) {
    const context = useContext(PostContext);

    const [likes, setLikes] = useState(props.post.likes)

    let { id, title, description, creator, date, pinned } = props.post

    // Format date from SQL table
    const t = date.split(/[-.T :]/)
    const formattedDate = t[3]+':'+t[4]+' on '+t[2]+'-'+t[1]+'-'+t[0]
      
    function addLike() {
        let newLikes = likes + 1
        setLikes(newLikes)
        axios({ method: 'put', url: config.environmentURL, data: { id, newLikes } })
            .catch(error => { console.log(error) })
    }

    function deletePost() {
        axios({ method: 'delete', url: config.environmentURL, data: { id } })
            .then(setTimeout(() => {context.getPosts()}, 100))
            .catch(error => { console.log(error) })
    }

    function pinPost() {
        axios({ method: 'put', url: config.environmentURL + '/pinpost', data: { id } })
        .then(setTimeout(() => {context.getPosts()}, 100))
        .catch(error => { console.log(error) })
    }

    function unpinPost() {
        axios({ method: 'put', url: config.environmentURL + '/unpinpost', data: { id } })
        .then(setTimeout(() => {context.getPosts()}, 100))
        .catch(error => { console.log(error) })
    }

    return (
        <div className={"post " + (pinned != null ? 'pinned-post' : '')} >
            {pinned != null && <div className="pin-flag"></div>}
            <div className="post-id">{ props.index + 1 }</div>
            <div className="post-body">
                <div className="post-tags">
                    <a className="user-thumbnail mr-10"></a>
                    <a className="sub-text mr-10">{ creator || 'Anonymous' }</a>
                    <span className="sub-text mr-10">to</span>
                    <a className="sub-text mr-10">branch</a>
                    <span className="sub-text mr-10">|</span>
                    <span className="sub-text">{ formattedDate || 'no date' }</span>
                </div>
                <div className="post-content">
                    <div className="post-title">{ title }</div>
                    <div className="post-description">{ description }</div>
                    <div className="post-interact">
                        <div className="post-interact-item" onClick={ addLike }>
                            <div className="like-icon"/>
                            <span>{ likes } Likes</span>
                        </div>
                        <div className="post-interact-item" onClick={ deletePost }>
                            <div className="delete-icon"/>
                            <span>Delete</span>
                        </div>
                        <div className="post-interact-item" onClick={pinned === null ? pinPost : unpinPost}>
                            <div className="pin-icon"/>
                            <span>{pinned === null ? 'Pin post' : 'Unpin post'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .post {
                    margin-bottom: 10px;
                    padding: 20px 20px 20px 0;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.08);
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
                    background-image: url(./icons/pin-01.png);
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
                .post-id {
                    width: 60px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    color: #aaa;
                }
                .post-body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    overflow: hidden;
                }
                .post-tags {
                    height: 40px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                }
                .user-thumbnail {
                    background-image: url(./icons/user-image-00.jpg);
                    background-position: center;
                    background-size: cover;
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    flex-shrink: 0
                }
                .sub-text {
                    color: #888;
                }
                .post-content {

                }
                .post-title {
                    color: black;
                    font-size: 24px;
                    font-weight: 600;
                    text-decoration: none;
                    padding-bottom: 10px;
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
                .like-icon {
                    background-image: url(./icons/heart-solid.svg);
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
                    background-image: url(./icons/delete-01.png);
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
                    background-image: url(./icons/pin-01.png);
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
                .mr-10 {
                    margin-right: 10px;
                }
            `}</style>
        </div>
    )
}

export default Post