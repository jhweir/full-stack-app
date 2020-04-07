import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Wall.module.scss'
import Post from './Post'
import WallHeader from './WallHeader'
import WallPlaceholder from './WallPlaceholder'

function Wall() {
    const { holonData, postSearchFilter, postSortByFilter, isLoading, setIsLoading } = useContext(HolonContext)

    // Apply search filter to posts
    const filteredPosts = holonData.Posts.filter(post => {
        return post.title.toUpperCase().includes(postSearchFilter.toUpperCase()) && post.globalState === 'visible'
        //&& post.pins == null
    })

    // TODO: Move the filters below into switch statement?
    // Sort posts by Reactions
    if (postSortByFilter === 'reactions') {
        filteredPosts.sort((a, b) => b.Labels.length - a.Labels.length)
    }

    // Sort posts by Likes
    if (postSortByFilter === 'likes') {
        function findNumberOfLikes(post) { return post.Labels.filter((label) => label.type === 'like').length  }
        filteredPosts.sort((a, b) => findNumberOfLikes(b) - findNumberOfLikes(a))
    }

    // Sort posts by Date
    if (postSortByFilter === 'date') {
        function formatDate(post) { return new Date(post.createdAt) }
        filteredPosts.sort((a, b) => formatDate(b) - formatDate(a))
    }

    // Sort posts by Comments
    if (postSortByFilter === 'comments') {
        filteredPosts.sort((a, b) => b.Comments.length - a.Comments.length)
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
                        key={post.id}
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