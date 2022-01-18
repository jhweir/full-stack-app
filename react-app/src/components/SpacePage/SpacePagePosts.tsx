import React, { useContext, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { OverlayScrollbarsComponent as OverlayScrollbars } from 'overlayscrollbars-react'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/SpacePagePosts.module.scss'
import PostCard from '@components/Cards/PostCard/PostCard'
import SpacePagePostsPlaceholder from '@components/SpacePage/SpacePagePostsPlaceholder'
import SpacePagePostsFilters from '@components/SpacePage/SpacePagePostsFilters'
import SearchBar from '@components/SearchBar'
import Toggle from '@components/Toggle'
import Button from '@components/Button'
import Row from '@components/Row'
import Column from '@components/Column'
import SpacePagePostMap from '@components/SpacePage/SpacePagePostMap'
import LoadingWheel from '@components/LoadingWheel'
// import { onPageBottomReached, onElementBottomReached } from '@src/Functions'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const SpacePagePosts = ({ match }: { match: { params: { spaceHandle: string } } }): JSX.Element => {
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
        nextSpacePostsLoading,
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

    const OSRef = useRef<OverlayScrollbars>(null)
    const OSOptions = {
        className: 'os-theme-none',
        callbacks: {
            onScroll: () => {
                // load next spaces when scroll bottom reached
                const instance = OSRef!.current!.osInstance()
                const scrollInfo = instance!.scroll()
                if (scrollInfo.ratio.y > 0.999 && spacePostsPaginationHasMore) {
                    getSpacePosts(
                        spaceData.id,
                        spacePostsPaginationOffset,
                        spacePostsPaginationLimit
                    )
                }
            },
        },
    }

    function openCreatePostModal() {
        if (loggedIn) setCreatePostModalOpen(true)
        else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create a post')
        }
    }

    // function toggleView() {
    //     updateSpacePostsFilter('view', view === 'List' ? 'Map' : 'List')
    // }

    // todo: use url instead of variable in store?
    useEffect(() => setSelectedSpaceSubPage('posts'), [])

    useEffect(() => () => resetSpacePosts(), [])

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

    return (
        <Column className={styles.wrapper}>
            <Row centerY className={styles.header}>
                <Button
                    text='New post'
                    color='blue'
                    size='medium'
                    onClick={openCreatePostModal}
                    style={{ marginRight: 10 }}
                />
                <SearchBar
                    setSearchFilter={(payload) => updateSpacePostsFilter('searchQuery', payload)}
                    placeholder='Search posts...'
                    style={{ marginRight: 10 }}
                />
                <SpacePagePostsFilters />
            </Row>
            <Row className={styles.content}>
                <OverlayScrollbars
                    className={`${styles.posts} os-host-flexbox scrollbar-theme`}
                    options={OSOptions}
                    ref={OSRef}
                >
                    {accountDataLoading || spaceDataLoading || spacePostsLoading ? (
                        <SpacePagePostsPlaceholder />
                    ) : (
                        <>
                            {spacePosts.length ? (
                                <>
                                    {spacePosts.map((post) => (
                                        <PostCard
                                            post={post}
                                            key={post.id}
                                            location='space-posts'
                                            style={{ marginBottom: 15 }}
                                            // todo: add class to posts?
                                        />
                                    ))}
                                    {nextSpacePostsLoading && (
                                        <Row centerX>
                                            <LoadingWheel />
                                        </Row>
                                    )}
                                </>
                            ) : (
                                <div className='wecoNoContentPlaceholder'>
                                    No posts yet that match those settings...
                                </div>
                            )}
                        </>
                    )}
                </OverlayScrollbars>
                <Column className={styles.postMap}>
                    <SpacePagePostMap />
                </Column>
            </Row>
        </Column>
    )
}

export default SpacePagePosts

// import SpacePagePostsPlaceholder from './SpacePagePostsPlaceholder'
/* <SpacePagePostsPlaceholder/> */

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
