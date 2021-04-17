import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPagePosts.module.scss'
import PostCard from '../Cards/PostCard/PostCard'
import HolonPagePostsFilters from './HolonPagePostsFilters'
import SearchBar from '../SearchBar'
import Toggle from '../Toggle'
import HolonPostMap from './HolonPostMap'

const HolonPagePosts = (): JSX.Element => {
    const {
        setCreatePostModalOpen,
        pageBottomReached,
        isLoggedIn,
        setAlertModalOpen,
        setAlertMessage,
    } = useContext(AccountContext)

    const {
        spaceContextLoading,
        spaceData,
        spacePosts,
        getSpacePosts,
        getNextSpacePosts,
        setSelectedSpaceSubPage,
        spacePostsPaginationOffset,
        spacePostsSearchFilter,
        spacePostsFiltersOpen,
        setSpacePostsFiltersOpen,
        spacePostsView,
        setSpacePostsView,
        spacePostsTimeRangeFilter,
        spacePostsTypeFilter,
        spacePostsSortByFilter,
        spacePostsSortOrderFilter,
        spacePostsDepthFilter,
        setSpacePostsSearchFilter,
    } = useContext(SpaceContext)

    const [renderKey, setRenderKey] = useState(0)

    function openCreatePostModal() {
        if (isLoggedIn) {
            setCreatePostModalOpen(true)
        } else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create a post')
        }
    }

    function toggleView() {
        if (spacePostsView === 'List') {
            setSpacePostsView('Map')
        } else {
            setSpacePostsView('List')
        }
    }

    useEffect(() => {
        setSelectedSpaceSubPage('posts')
    }, [])

    useEffect(() => {
        if (!spaceContextLoading && spaceData) {
            getSpacePosts()
            setRenderKey(renderKey + 1)
        }
    }, [
        spaceContextLoading,
        spacePostsSearchFilter,
        spacePostsTimeRangeFilter,
        spacePostsTypeFilter,
        spacePostsSortByFilter,
        spacePostsSortOrderFilter,
        spacePostsDepthFilter,
    ])

    useEffect(() => {
        if (
            spacePostsView === 'List' &&
            pageBottomReached &&
            !spaceContextLoading &&
            spaceData.id
        ) {
            getNextSpacePosts()
        }
    }, [pageBottomReached])

    return (
        <div className={styles.wall}>
            <div className='wecoPageHeader'>
                <div className={styles.headerRow}>
                    <div className={styles.headerRowSection}>
                        <SearchBar
                            setSearchFilter={setSpacePostsSearchFilter}
                            placeholder='Search posts...'
                        />
                        <div
                            className={styles.filterButton}
                            role='button'
                            tabIndex={0}
                            onClick={() => setSpacePostsFiltersOpen(!spacePostsFiltersOpen)}
                            onKeyDown={() => setSpacePostsFiltersOpen(!spacePostsFiltersOpen)}
                        >
                            <img
                                className={styles.filterButtonIcon}
                                src='/icons/sliders-h-solid.svg'
                                aria-label='filters'
                            />
                        </div>
                        <div
                            className={styles.filterButton}
                            role='button'
                            tabIndex={0}
                            onClick={() => openCreatePostModal()}
                            onKeyDown={() => openCreatePostModal()}
                        >
                            New Post
                        </div>
                    </div>
                    <div className={styles.headerRowSection}>
                        <Toggle
                            leftText='List'
                            rightText='Map'
                            onClickFunction={toggleView}
                            positionLeft={spacePostsView === 'List'}
                        />
                    </div>
                </div>
                {spacePostsFiltersOpen && <HolonPagePostsFilters />}
            </div>
            {spacePostsView === 'List' && spacePosts.length > 0 && (
                <ul
                    className={`${styles.posts} ${spaceContextLoading && styles.hidden}`}
                    key={renderKey}
                >
                    {spacePosts.map((post, index) => (
                        <PostCard
                            postData={post}
                            key={post.id}
                            index={index}
                            location='holon-posts'
                        />
                    ))}
                </ul>
            )}
            {spacePostsView === 'List' &&
                spacePosts.length < 1 &&
                spacePostsPaginationOffset > 0 && (
                    <div className='wecoNoContentPlaceholder'>
                        No posts yet that match those settings...
                    </div>
                )}
            {spacePostsView === 'Map' && <HolonPostMap />}
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
    {spaceData && pinnedPosts.map((post, index) => 
        <Post
            post={post}
            index={index}
            key={post.id}
            spaceContextLoading={spaceContextLoading}
        /> 
    )}
</ul> */

// Apply search filter to posts
// const filteredPosts = spacePosts.filter(post => {
//     return post.title.toUpperCase().includes(spacePostsSearchFilter.toUpperCase()) && post.state === 'visible'
//     //&& post.pins == null
// })

// TODO: Move the filters below into switch statement or better format?
// Sort by Reactions
// if (spacePostsSortByFilter === 'reactions') {
//     filteredPosts.sort((a, b) => b.total_reactions - a.total_reactions)
// }

// // Sort by Likes
// if (spacePostsSortByFilter === 'likes') {
//     filteredPosts.sort((a, b) => b.total_likes - a.total_likes)
// }

// // Sort by Hearts
// if (spacePostsSortByFilter === 'hearts') {
//     filteredPosts.sort((a, b) => b.total_hearts - a.total_hearts)
// }

// // Sort by Date
// if (spacePostsSortByFilter === 'date') {
//     function formatDate(post) { return new Date(post.createdAt) }
//     filteredPosts.sort((a, b) => formatDate(b) - formatDate(a))
// }

// // Sort by Comments
// if (spacePostsSortByFilter === 'comments') {
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
