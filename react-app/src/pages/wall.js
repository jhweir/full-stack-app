import React, { useContext } from 'react'
import { PostContext } from '../contexts/PostContext'
import Post from '../components/Post'
import WallHeader from '../components/WallHeader'

function Wall() {
    const { posts, searchFilter, sortBy, getAllPosts, isLoading } = useContext(PostContext)

    // Filter posts by search text, remove pinned posts, and remove hidden posts
    let filteredPosts = posts.filter((post) => {
        // return post.title.indexOf(searchFilter) !== -1 && post.pins == null && post.visible === true
        return post.title.includes(searchFilter) && post.pins == null && post.visible === true
    })

    // Sort posts by Likes
    if (sortBy === 'likes') {
        filteredPosts.sort((a, b) => b.likes - a.likes)
    }

    // Sort posts by Date
    if (sortBy === 'date') {
        filteredPosts.sort((a, b) => b.date - a.date)
    }

    // Sort posts by Comments
    if (sortBy === 'comments') {
        filteredPosts.sort((a, b) => b.comments - a.comments)
    }

    // Pinned posts
    let pinnedPosts = posts.filter((post) => {
        return post.pins === 'Global wall' && post.visible === true
    })

    return (
        <>
            <div className="wall">
                <WallHeader />
                <ul className="pinned-posts">
                    {pinnedPosts.map((post, index) => 
                        <Post
                            post={post}
                            index={index}
                            key={post.id}
                            getAllPosts={getAllPosts}
                            isLoading={isLoading}
                        /> 
                    )} 
                </ul>
                <ul className="posts">
                    {filteredPosts.map((post, index) => 
                        <Post
                            post={post}
                            index={index}
                            key={post.id}  
                            getAllPosts={getAllPosts} 
                            isLoading={isLoading}
                        />
                    )} 
                </ul>
            </div>

            <style jsx="true">{`
                .wall {
                    width: 600px;
                    padding: 0 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .posts {
                    padding: 0;
                    width: 100%;
                }
                .pinned-posts {
                    padding: 0;
                    width: 100%;
                }
                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    )
}

export default Wall