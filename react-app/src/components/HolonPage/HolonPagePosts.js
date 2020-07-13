import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePosts.module.scss'
import PostCard from '../Cards/PostCard'
import HolonPagePostsFilters from './HolonPagePostsFilters'
import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'
import PageHeader from '../PageHeader'
import SearchBar from '../SearchBar'

function HolonPagePosts() {
    const { setCreatePostModalOpen } = useContext(AccountContext)
    const {
        holonContextLoading,
        holonData,
        getHolonPosts,
        holonPosts,
        holonPostsSearchFilter,
        holonPostSortByFilter,
        setSelectedHolonSubPage
    } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('posts')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData.id) { getHolonPosts() }
    }, [holonContextLoading])

    // Apply search filter to posts
    const filteredPosts = holonPosts.filter(post => {
        return post.title.toUpperCase().includes(holonPostsSearchFilter.toUpperCase()) && post.globalState === 'visible'
        //&& post.pins == null
    })

    // TODO: Move the filters below into switch statement or better format?
    // Sort by Reactions
    if (holonPostSortByFilter === 'reactions') {
        filteredPosts.sort((a, b) => b.total_reactions - a.total_reactions)
    }

    // Sort by Likes
    if (holonPostSortByFilter === 'likes') {
        filteredPosts.sort((a, b) => b.total_likes - a.total_likes)
    }

    // Sort by Hearts
    if (holonPostSortByFilter === 'hearts') {
        filteredPosts.sort((a, b) => b.total_hearts - a.total_hearts)
    }

    // Sort by Date
    if (holonPostSortByFilter === 'date') {
        function formatDate(post) { return new Date(post.createdAt) }
        filteredPosts.sort((a, b) => formatDate(b) - formatDate(a))
    }

    // Sort by Comments
    if (holonPostSortByFilter === 'comments') {
        filteredPosts.sort((a, b) => b.total_comments - a.total_comments)
    }

    return (
        <div className={styles.wall}>
            <PageHeader>
                <SearchBar type='holon-posts'/>
                <button className="wecoButton mr-10" onClick={() => setCreatePostModalOpen(true)}>
                    Create Post
                </button>
                <HolonPagePostsFilters/>
            </PageHeader>
            <HolonPagePostsPlaceholder/>
            <ul className={`${styles.posts} ${holonContextLoading && styles.hidden}`}>
                {filteredPosts.map((post, index) =>
                    <PostCard post={post} key={index} index={index}/>
                )}
            </ul>
        </div>
    )
}

export default HolonPagePosts

// // Pinned posts
// let pinnedPosts = posts.filter((post) => {
//     return post.pins === 'Global wall' && post.visible === true
// })

/* <ul className={pinnedPosts}>
    {holonData && pinnedPosts.map((post, index) => 
        <Post
            post={post}
            index={index}
            key={post.id}
            holonContextLoading={holonContextLoading}
        /> 
    )}
</ul> */
