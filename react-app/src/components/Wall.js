import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Wall.module.scss'
import Post from './Post'
import WallHeader from './WallHeader'
import WallPlaceholder from './WallPlaceholder'

function Wall() {
    const { holonData, postSearchFilter, postSortByFilter, isLoading, setIsLoading } = useContext(HolonContext)
    const { wall, posts, hidden, pinnedPosts } = styles

    // Apply search filter to posts
    const filteredPosts = holonData.Posts.filter(post => {
        return post.title.includes(postSearchFilter) && post.globalState === 'visible'
        //&& post.pins == null
    })

    // TODO: Move these filters below into a switch/case format?
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
        <div className={wall}>
            <WallHeader/>
            <WallPlaceholder/>
            <ul className={`${posts}` + (isLoading ? `${hidden}` : '')}>
                {filteredPosts.map((post, index) =>
                    // <CSSTransition key={index}  in={!isLoading} timeout={500} classNames="contentFade" appear>
                        <Post post={post} key={post.id} index={index} isLoading={isLoading}/>
                    // </CSSTransition>
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