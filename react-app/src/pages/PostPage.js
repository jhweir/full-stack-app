import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Post from '../components/Post'
import Comment from '../components/Comment'

function PostPage({ match }) {
    const postId = match.params.postId

    const [post, setPost] = useState({
        Holons: [],
        Labels: [],
        Comments: []
    })
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [postPageLoading, setPostPageLoading] = useState(true)

    function getPost() {
        axios.get(config.environmentURL + `/getPost?id=${postId}`).then(res => { 
            setPost(res.data)
            setPostPageLoading(false)
        })
    }

    function submitComment(e) {
        e.preventDefault()
        if (newComment !== '') {
            //let text = newComment
            let comments = post.comments + 1
            axios({ method: 'post', url: config.environmentURL + '/addComment', data: { newComment, postId } })
                .then(res => { 
                    setNewComment('')
                    setTimeout(() => { getPost() }, 100)
                })
        } else if (newComment === '') {
            setCommentError(true);
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    return (
        <>
            <div className="post-page">
                <Post 
                    post={post}
                    postPageLoading={postPageLoading}
                    isPostPage={true}
                />
                <form  className="create-comment-form" onSubmit={submitComment}> 
                    <textarea className={"create-comment-form-text-area " + (commentError ? 'error' : '')}
                        //style={{ height:'auto', paddingTop:10 }}
                        rows="1"
                        type="text"
                        placeholder="Leave a comment..."
                        name="newComment"
                        value={newComment}
                        onChange={(e) => {
                            setNewComment(e.target.value)
                            setCommentError(false)
                        }}
                    />
                    <div className="button-container">
                        <button className="create-comment-form-button">Post comment</button>
                    </div>
                </form>
                <div className="comments">
                    {post.Comments.map((comment, index) => 
                        <Comment 
                            key={comment.id}
                            index={index}
                            comment={comment} /> 
                    )}
                </div>
            </div>
            
            <style jsx="true">{`
                .post-page {
                    margin-top: 60px;
                    width: 700px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
                .create-comment-form {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    //flex-wrap: wrap;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .create-comment-form-text-area {
                    display: flex;
                    width: 100%;
                    margin-right: 10px;
                    outline: none;
                    border: 1px solid rgba(0,0,0,0.1);
                    padding: 10px;
                    border-radius: 5px;
                }
                .create-comment-form-button {
                    background-color: #3a88f0;
                    width: 150px;
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
                .comments {
                    //background-color: white;
                    //box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.05);
                    width: 100%;
                    //border-radius: 10px;
                    transition-property: background-color;
                    transition-duration: 2s;
                }
                .error {
                    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.6);
                }
            `}</style>
        </>
    )
}

export default PostPage