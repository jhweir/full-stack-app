import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import Post from '../components/Post'

function PostPage({ match, location }) {
    const [post, setPost] = useState([])
    const postId = match.params.postId

    function getPost() {
        axios({ method: 'post', url: config.environmentURL + '/getpost', data: { postId } })
            .then(res => { setPost(res.data) })
    }

    useEffect(() => {
        getPost()
        setTimeout(() => {console.log(post)}, 3000)
    }, [])

    return (
        <div className="wall">
            <Post post={post} />
            
            <style jsx="true">{`
                .wall {
                    width: 600px;
                    padding: 0 10px;
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
            `}</style>
        </div>
    )
}

export default PostPage