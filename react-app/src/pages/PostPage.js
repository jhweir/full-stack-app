import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Post from '../components/Post'
import Comment from '../components/Comment'

function PostPage({ match }) {
    const postId = match.params.postId

    const [post, setPost] = useState([])
    // const [username, setUsername] = useState('')
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [commentError, setCommentError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    function getPost() {
        axios({ method: 'get', url: config.environmentURL + `/post?id=${postId}` })
            .then(res => { 
                console.log(res.data.Comments)
                setPost(res.data)
                setComments(res.data.Comments)
                setIsLoading(false)
             })
    }

    function submitComment(e) {
        e.preventDefault();
        if (comment !== '') {
            let text = comment
            let comments = post.comments + 1
            axios({ method: 'post', url: config.environmentURL + '/addcomment', data: { text, postId, comments } })
                .then(res => { 
                    console.log(res)
                    setComment('')
                    setTimeout(() => { getPost() }, 100)
                })
                // .then(setTimeout(() => {context.getPosts()}, 100))
        } else if (comment === '') {
            setCommentError(true);
        }
    }

    useEffect(() => {
        getPost()
        // setTimeout(() => {console.log(post)}, 3000)
    }, [])

    return (
        <div className="wall">
            <Post post={post} isLoading={isLoading} />

            <form  className="create-comment-form" onSubmit={submitComment}> 
                <textarea className={"input-wrapper modal mb-10 " + (commentError ? 'error' : '')}
                    style={{ height:'auto', paddingTop:10 }}
                    rows="5"
                    type="text"
                    placeholder="Leave a comment..."
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="button-container">
                    <button className="button">Post comment</button>
                </div>
            </form>

            <div className="comments">
                {comments.map((comment, index) => <Comment key={comment.id} index={index} comment={comment} /> )}
            </div>

            {/* List comments */}
            
            <style jsx="true">{`
                .wall {
                    width: 600px;
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
                    //justify-content: center;
                    //align-items: center;
                }
                .comments {
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.1);
                    width: 100%;
                    border-radius: 5px;
                    transition-property: background-color;
                    transition-duration: 2s;
                }
            `}</style>
        </div>
    )
}

export default PostPage