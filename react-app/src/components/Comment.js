import React from 'react'

function Comment(props) {

    let { user, text, createdAt } = props.comment

    function formatDate() {
        const t = createdAt.split(/[-.T :]/)
        let formattedDate = t[3]+':'+t[4]+' on '+t[2]+'-'+t[1]+'-'+t[0]
        return formattedDate
    }

    return (
        <>
            <div className="comment">
                {/* <div className="comment-id">{ props.index + 1 || '' }</div> */}
                <div className="comment-body">

                    <div className="comment-tags">
                        <span className="user-thumbnail mr-10"></span>
                        <span className="sub-text mr-10">{ user || 'Anonymous' }</span>
                        <span className="sub-text mr-10">|</span>
                        {/* Wait until the post data has finished loading before formatting the date to prevent errors */}
                        <span className="sub-text">{ formatDate() || 'no date' }</span>
                    </div>

                    <div className="comment-content">
                        <div className="comment-text">{ text }</div>
                        
                        <div className="post-interact">
                            {/* <div className="post-interact-item" onClick={ addLike }>
                                <div className="like-icon"/>
                                <span>{ likes } Likes</span>
                            </div>
                            <div className="post-interact-item" onClick={ deletePost }>
                                <div className="delete-icon"/>
                                <span>Delete</span>
                            </div>
                            <div className="post-interact-item" onClick={ pins === null ? pinPost : unpinPost }>
                                <div className="pin-icon"/>
                                <span>{pins === null ? 'Pin post' : 'Unpin post'}</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .comment {
                    margin-bottom: 10px;
                    padding: 20px 20px 20px 30px;
                    width: 100%;
                    border-radius: 5px;
                    background-color: white;
                    //box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.08);
                    display: flex;
                    flex-direction: row;
                    transition-property: background-color;
                    transition-duration: 2s;
                    position: relative;
                }
                .comment-id {
                    width: 60px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    color: #aaa;
                }
                .comment-body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    overflow: hidden;
                }
                .comment-tags {
                    margin-bottom: 10px;
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
                .sub-text {
                    color: #888;
                }
                .comment-content {

                }
                .comment-text {
                    color: black;
                    font-size: 16px;
                    font-weight: 400;
                    text-decoration: none;
                    //padding-bottom: 10px;
                    transition-property: color;
                    transition-duration: 2s;
                }
                .comment-interact {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-shrink: 0;
                }
                .comment-interact-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-shrink: 0;
                    margin-right: 10px;
                    color: #888;
                }
                .comment-interact-item:hover {
                    cursor: pointer;
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
                .mr-10 {
                    margin-right: 10px;
                }
            `}</style>
        </>
    )
}

export default Comment
