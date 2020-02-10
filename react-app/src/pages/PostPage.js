import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Post from '../components/Post'

function PostPage({ match, location }) {
    const postId = match.params.postId

    const [post, setPost] = useState([])
    // const [username, setUsername] = useState('')
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(false)

    function getPost() {
        axios({ method: 'get', url: config.environmentURL + `/post?id=${postId}` })
            .then(res => { setPost(res.data) })
    }

    function submitComment(e) {
        e.preventDefault();
    }

    useEffect(() => {
        getPost()
        // setTimeout(() => {console.log(post)}, 3000)
    }, [])

    return (
        <div className="wall">
            <Post post={post} postPage={'true'} />

            <form  className="create-comment-form" onSubmit={submitComment}> 
                {/* <input className="input-wrapper modal margin-bottom-20"
                    type="text"
                    placeholder="Username..."
                    name="creator"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /> */}
                <textarea className={"input-wrapper modal margin-bottom-20 " + (commentError ? 'error' : '')}
                    style={{ height:'auto', paddingTop:10 }}
                    rows="5"
                    type="text"
                    placeholder="Comment..."
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className="button-container">
                    <button className="button">Post comment</button>
                </div>
            </form>

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
            `}</style>
        </div>
    )
}

export default PostPage