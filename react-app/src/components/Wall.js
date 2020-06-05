import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Wall.module.scss'
import Post from './Post'
import WallHeader from './WallHeader'
import WallPlaceholder from './WallPlaceholder'

function Wall() {
    const { holonPosts, postSearchFilter, postSortByFilter, isLoading } = useContext(HolonContext)

    // Apply search filter to posts
    const filteredPosts = holonPosts.filter(post => {
        return post.title.toUpperCase().includes(postSearchFilter.toUpperCase()) && post.globalState === 'visible'
        //&& post.pins == null
    })

    // TODO: Move the filters below into switch statement?
    // Sort by Reactions
    if (postSortByFilter === 'reactions') {
        filteredPosts.sort((a, b) => b.total_reactions - a.total_reactions)
    }

    // Sort by Likes
    if (postSortByFilter === 'likes') {
        filteredPosts.sort((a, b) => b.total_likes - a.total_likes)
    }

    // Sort by Hearts
    if (postSortByFilter === 'hearts') {
        filteredPosts.sort((a, b) => b.total_hearts - a.total_hearts)
    }

    // Sort by Date
    if (postSortByFilter === 'date') {
        function formatDate(post) { return new Date(post.createdAt) }
        filteredPosts.sort((a, b) => formatDate(b) - formatDate(a))
    }

    // Sort by Comments
    if (postSortByFilter === 'comments') {
        filteredPosts.sort((a, b) => b.total_comments - a.total_comments)
    }

    // // Pinned posts
    // let pinnedPosts = posts.filter((post) => {
    //     return post.pins === 'Global wall' && post.visible === true
    // })

    return (
        <div className={styles.wall}>
            <WallHeader/>
            <WallPlaceholder/>
            <ul className={`${styles.posts} ${(isLoading && styles.hidden)}`}>
                {filteredPosts.map((post, index) =>
                    <Post
                        post={post}
                        key={index}
                        index={index}
                        isLoading={isLoading}
                    />
                )} 
            </ul>
        </div>
    )
}

export default Wall

{/* <ul className={pinnedPosts}>
    {holonData && pinnedPosts.map((post, index) => 
        <Post
            post={post}
            index={index}
            key={post.id}
            isLoading={isLoading}
        /> 
    )}
</ul> */}