import React, { useContext, useEffect, useState } from 'react'
import { PostContext } from '../contexts/PostContext'
import Post from '../components/Post'
import WallHeader from '../components/WallHeader';

function Wall() {
    const { posts, searchFilter, sortBy, getPosts, isLoading } = useContext(PostContext)

    // Filter posts by search text
    let filteredPosts = posts.filter((post) => {
        return post.title.indexOf(searchFilter) !== -1 && post.pins == null
    })

    // Sort posts by Likes
    if (sortBy === 'likes') {
        filteredPosts = filteredPosts.sort((a, b) => b.likes - a.likes)
    }

    // Sort posts by Date
    if (sortBy === 'date') {
        filteredPosts = filteredPosts.sort((a, b) => b.date - a.date)
    }

    // Sort posts by Comments
    if (sortBy === 'comments') {
        filteredPosts = filteredPosts.sort((a, b) => b.comments - a.comments)
    }

    // Pinned posts
    let pinnedPosts = posts.filter((post) => {
        return post.pins === 'Global wall'
    })

    return (
        <div className="wall">
            <WallHeader />

            <ul className="pinned-posts">
                {pinnedPosts.map((post, index) => <Post key={post.id} index={index} post={post} getPosts={getPosts} isLoading={isLoading}/> )} 
            </ul>

            <ul className="posts">
                {filteredPosts.map((post, index) => <Post key={post.id} index={index} post={post} getPosts={getPosts} isLoading={isLoading}/> )} 
            </ul>

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
        </div>
    )
}

export default Wall