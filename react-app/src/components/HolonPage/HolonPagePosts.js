import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePosts.module.scss'
import PostCard from '../Cards/PostCard/PostCard'
import HolonPagePostsFilters from './HolonPagePostsFilters'
import HolonPagePostViews from './HolonPagePostViews'
import SearchBar from '../SearchBar'
import HolonPostMap from './HolonPostMap'

function HolonPagePosts() {
    const { 
        setCreatePostModalOpen,
        pageBottomReached,
        isLoggedIn,
        setAlertModalOpen,
        setAlertMessage
    } = useContext(AccountContext)

    const {
        //holonHandle,
        holonContextLoading, holonData,
        holonPosts, getHolonPosts, getNextHolonPosts,
        setSelectedHolonSubPage, holonPostPaginationOffset,
        holonPostSearchFilter,
        holonPostFiltersOpen, setHolonPostFiltersOpen,
        // holonPostViewsOpen, setHolonPostViewsOpen,
        holonPostViewLayout, setHolonPostViewLayout,
        holonPostTimeRangeFilter,
        holonPostTypeFilter,
        holonPostSortByFilter,
        holonPostSortOrderFilter,
        holonPostDepthFilter,
        setHolonPostSearchFilter
    } = useContext(HolonContext)

    function openCreatePostModal() {
        if (isLoggedIn) { setCreatePostModalOpen(true) }
        else { setAlertModalOpen(true); setAlertMessage('Log in to create a post') }
    }

    useEffect(() => {
        setSelectedHolonSubPage('posts')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData) { getHolonPosts() }
    },[
        //holonHandle,
        holonContextLoading,
        holonPostSearchFilter,
        holonPostTimeRangeFilter,
        holonPostTypeFilter,
        holonPostSortByFilter,
        holonPostSortOrderFilter,
        holonPostDepthFilter
    ])

    useEffect(() => {
        if (pageBottomReached && !holonContextLoading && holonData) { getNextHolonPosts() }
    }, [pageBottomReached])

    return (
        <div className={styles.wall}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar setSearchFilter={setHolonPostSearchFilter} placeholder='Search posts...'/>
                    <button className='wecoButton mr-10' onClick={() => setHolonPostFiltersOpen(!holonPostFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                    <button
                        className='wecoButton mr-10'
                        onClick={() => {
                            if (holonPostViewLayout === 'List') setHolonPostViewLayout('Map')
                            else setHolonPostViewLayout('List')
                        }}>
                        View
                        {/* <img className='wecoButtonIcon' src='/icons/eye-solid.svg'/> */}
                    </button>
                    <button className='wecoButton mr-10' onClick={() => openCreatePostModal()}>
                        Create Post
                    </button>
                </div>
                {holonPostFiltersOpen && <HolonPagePostsFilters/>}
                {/* {holonPostViewsOpen && <HolonPagePostViews/>} */}
            </div>
            {holonPostViewLayout === 'List' && holonPosts.length > 0 &&
                <ul className={`${styles.posts} ${holonContextLoading && styles.hidden}`}>
                    {holonPosts.map((post, index) =>
                        <PostCard postData={post} key={index} index={index} location='holon-posts'/>
                    )}
                </ul>
            }
            {holonPostViewLayout === 'List' && holonPosts.length < 1 && holonPostPaginationOffset > 0 &&
                <div className='wecoNoContentPlaceholder'>
                    No posts yet that match those settings...
                </div>
            }
            {holonPostViewLayout === 'Map' &&
                <HolonPostMap/>
            }
        </div>
    )
}

export default HolonPagePosts

// import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'
/* <HolonPagePostsPlaceholder/> */

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

// Apply search filter to posts
// const filteredPosts = holonPosts.filter(post => {
//     return post.title.toUpperCase().includes(holonPostSearchFilter.toUpperCase()) && post.state === 'visible'
//     //&& post.pins == null
// })

// TODO: Move the filters below into switch statement or better format?
// Sort by Reactions
// if (holonPostSortByFilter === 'reactions') {
//     filteredPosts.sort((a, b) => b.total_reactions - a.total_reactions)
// }

// // Sort by Likes
// if (holonPostSortByFilter === 'likes') {
//     filteredPosts.sort((a, b) => b.total_likes - a.total_likes)
// }

// // Sort by Hearts
// if (holonPostSortByFilter === 'hearts') {
//     filteredPosts.sort((a, b) => b.total_hearts - a.total_hearts)
// }

// // Sort by Date
// if (holonPostSortByFilter === 'date') {
//     function formatDate(post) { return new Date(post.createdAt) }
//     filteredPosts.sort((a, b) => formatDate(b) - formatDate(a))
// }

// // Sort by Comments
// if (holonPostSortByFilter === 'comments') {
//     filteredPosts.sort((a, b) => b.total_comments - a.total_comments)
// }


// // below props only if you need pull down functionality
// refreshFunction={this.refresh}
// pullDownToRefresh
// pullDownToRefreshContent={
//     <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
// }
// releaseToRefreshContent={
//     <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
// }>