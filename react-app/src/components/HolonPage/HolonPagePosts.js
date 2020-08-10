import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePosts.module.scss'
import PostCard from '../Cards/PostCard'
import HolonPagePostsFilters from './HolonPagePostsFilters'
import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'
import SearchBar from '../SearchBar'

function HolonPagePosts() {
    const { setCreatePostModalOpen, pageBottomReached, isLoggedIn, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)
    const {
        holonContextLoading, holonData,
        holonPosts, getHolonPosts, getNextHolonPosts,
        setSelectedHolonSubPage, holonPostPaginationOffset,
        holonPostSearchFilter,
        holonPostFiltersOpen, setHolonPostFiltersOpen,
        holonPostTimeRangeFilter,
        holonPostTypeFilter,
        holonPostSortByFilter,
        holonPostSortOrderFilter,
        holonPostScopeFilter
    } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('posts')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData.id) { getHolonPosts() }
    }, [holonContextLoading, holonPostSearchFilter, holonPostTimeRangeFilter, holonPostTypeFilter, holonPostSortByFilter, holonPostSortOrderFilter, holonPostScopeFilter])

    useEffect(() => {
        if (pageBottomReached && !holonContextLoading && holonData.id) { getNextHolonPosts() }
    }, [pageBottomReached])

    function openCreatePostModal() {
        if (!isLoggedIn) { setAlertModalOpen(true); setAlertMessage('Log in to create a post') }
        else { setCreatePostModalOpen(true) }
    }

    return (
        <div className={styles.wall}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar type='holon-posts'/>
                    <button className='wecoButton mr-10' onClick={() => setHolonPostFiltersOpen(!holonPostFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                    <button className='wecoButton mr-10' onClick={() => openCreatePostModal()}>
                        Create Post
                    </button>
                </div>
                <HolonPagePostsFilters/>
            </div>
            {/* <HolonPagePostsPlaceholder/> */}
            {holonPosts.length > 0 &&
                <ul className={`${styles.posts} ${holonContextLoading && styles.hidden}`}>
                    {holonPosts.map((post, index) =>
                        <PostCard post={post} key={index} index={index} location='holon-posts'/>
                    )}
                </ul>
            }
            {holonPostPaginationOffset > 0 && holonPosts.length < 1 &&
                <div className='wecoNoContentPlaceholder'>
                    No posts yet that match those settings...
                </div>
            }
        </div>
    )
}

export default HolonPagePosts

/* <InfiniteScroll
    dataLength={holonPostPaginationLimit} //This is important field to render the next data
    next={() => getHolonPosts()}
    hasMore={holonPostPaginationHasMore}
    loader={<h4>Loading...</h4>}
    endMessage={
        <p style={{textAlign: 'center'}}>
        <b>Yay! You have seen it all</b>
        </p>
    }>
    {holonPosts.map((post, index) =>
        <PostCard post={post} key={index} index={index}/>
    )}
</InfiniteScroll> */

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
//     return post.title.toUpperCase().includes(holonPostSearchFilter.toUpperCase()) && post.globalState === 'visible'
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