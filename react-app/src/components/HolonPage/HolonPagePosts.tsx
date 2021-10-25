import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/HolonPagePosts.module.scss'
import PostCard from '@components/Cards/PostCard/PostCard'
import HolonPagePostsPlaceholder from '@components/HolonPage/HolonPagePostsPlaceholder'
import HolonPagePostsFilters from '@components/HolonPage/HolonPagePostsFilters'
import SearchBar from '@components/SearchBar'
import Toggle from '@components/Toggle'
import Button from '@components/Button'
import HolonPostMap from '@components/HolonPage/HolonPostMap'
import { onPageBottomReached } from '@src/Functions'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const HolonPagePosts = ({ match }: { match: { params: { spaceHandle: string } } }): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const {
        accountDataLoading,
        loggedIn,
        setCreatePostModalOpen,
        setAlertModalOpen,
        setAlertMessage,
    } = useContext(AccountContext)
    const {
        spaceData,
        getSpaceData,
        spaceDataLoading,
        spacePosts,
        getSpacePosts,
        resetSpacePosts,
        spacePostsLoading,
        setSelectedSpaceSubPage,
        spacePostsPaginationOffset,
        spacePostsPaginationLimit,
        spacePostsFilters,
        updateSpacePostsFilter,
        spacePostsFiltersOpen,
        setSpacePostsFiltersOpen,
        spacePostsPaginationHasMore,
    } = useContext(SpaceContext)
    const { view } = spacePostsFilters
    const [pageBottomReached, setPageBottomReached] = useState(false)

    function openCreatePostModal() {
        if (loggedIn) setCreatePostModalOpen(true)
        else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create a post')
        }
    }

    function toggleView() {
        updateSpacePostsFilter('view', view === 'List' ? 'Map' : 'List')
    }

    useEffect(() => {
        setSelectedSpaceSubPage('posts')
        const scrollHandler = () => onPageBottomReached(setPageBottomReached)
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    const location = useLocation()
    const getFirstPosts = (spaceId) => getSpacePosts(spaceId, 0, spacePostsPaginationLimit)
    useEffect(() => {
        if (!accountDataLoading) {
            if (spaceHandle !== spaceData.handle) {
                getSpaceData(spaceHandle, view === 'List' ? getFirstPosts : null)
            } else if (view === 'List') {
                getFirstPosts(spaceData.id)
            }
        }
    }, [accountDataLoading, location, spacePostsFilters])

    useEffect(() => {
        if (pageBottomReached && spacePostsPaginationHasMore && view === 'List') {
            getSpacePosts(spaceData.id, spacePostsPaginationOffset, spacePostsPaginationLimit)
        }
    }, [pageBottomReached])

    useEffect(() => () => resetSpacePosts(), [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div>
                        <SearchBar
                            setSearchFilter={(payload) =>
                                updateSpacePostsFilter('searchQuery', payload)
                            }
                            placeholder='Search posts...'
                        />
                        <Button
                            icon={<SlidersIconSVG />}
                            colour='grey'
                            size='medium'
                            margin='0 10px 0 0'
                            onClick={() => setSpacePostsFiltersOpen(!spacePostsFiltersOpen)}
                        />
                        <Button
                            text='New post'
                            colour='grey'
                            size='medium'
                            onClick={() => openCreatePostModal()}
                        />
                    </div>
                    <Toggle
                        leftText='List'
                        rightText='Map'
                        onClickFunction={toggleView}
                        positionLeft={view === 'List'}
                    />
                </div>
                {spacePostsFiltersOpen && <HolonPagePostsFilters />}
            </div>
            {view === 'List' ? (
                <div className={styles.posts}>
                    {accountDataLoading || spaceDataLoading || spacePostsLoading ? (
                        <HolonPagePostsPlaceholder />
                    ) : (
                        <>
                            {spacePosts.length ? (
                                spacePosts.map((post, index) => (
                                    <PostCard
                                        postData={post}
                                        key={post.id}
                                        index={index}
                                        location='holon-posts'
                                    />
                                ))
                            ) : (
                                <div className='wecoNoContentPlaceholder'>
                                    No posts yet that match those settings...
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <HolonPostMap />
            )}
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
