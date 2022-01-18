import React, { useContext, useEffect, useState, useRef } from 'react'
import { OverlayScrollbarsComponent as OverlayScrollbars } from 'overlayscrollbars-react'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPagePosts.module.scss'
import SearchBar from '@components/SearchBar'
import UserPagePostsFilters from '@components/UserPage/UserPagePostsFilters'
import PostCard from '@components/Cards/PostCard/PostCard'
import SpacePagePostsPlaceholder from '@components/SpacePage/SpacePagePostsPlaceholder'
import { onPageBottomReached } from '@src/Functions'
import Button from '@components/Button'
import Row from '@components/Row'
import Column from '@components/Column'
import LoadingWheel from '@components/LoadingWheel'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const UserPagePosts = (): JSX.Element => {
    const {
        userData,
        userPosts,
        userPostsLoading,
        nextUserPostsLoading,
        userPostsFilters,
        userPostsFiltersOpen,
        userPostsPaginationOffset,
        userPostsPaginationHasMore,
        setSelectedUserSubPage,
        setUserPostsFiltersOpen,
        getUserPosts,
        updateUserPostsFilter,
    } = useContext(UserContext)

    const OSRef = useRef<OverlayScrollbars>(null)
    const OSOptions = {
        className: 'os-theme-none',
        callbacks: {
            onScroll: () => {
                // load next spaces when scroll bottom reached
                const instance = OSRef!.current!.osInstance()
                const scrollInfo = instance!.scroll()
                if (scrollInfo.ratio.y > 0.999 && userPostsPaginationHasMore) {
                    getUserPosts(userPostsPaginationOffset)
                }
            },
        },
    }

    useEffect(() => setSelectedUserSubPage('posts'), [])

    useEffect(() => {
        if (userData.id) getUserPosts(0)
    }, [userData.id, userPostsFilters])

    return (
        <Column className={styles.wrapper}>
            <Row centerY className={styles.header}>
                <SearchBar
                    setSearchFilter={(payload) => updateUserPostsFilter('searchQuery', payload)}
                    placeholder='Search posts...'
                    style={{ marginRight: 10 }}
                />
                <UserPagePostsFilters />
            </Row>
            <Row className={styles.content}>
                <OverlayScrollbars
                    className={`${styles.posts} os-host-flexbox scrollbar-theme`}
                    options={OSOptions}
                    ref={OSRef}
                >
                    {userPostsLoading ? (
                        <SpacePagePostsPlaceholder />
                    ) : (
                        <>
                            {userPosts.length ? (
                                <>
                                    {userPosts.map((post) => (
                                        <PostCard
                                            post={post}
                                            key={post.id}
                                            location='space-posts'
                                            style={{ marginBottom: 15 }}
                                        />
                                    ))}
                                    {nextUserPostsLoading && (
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
            </Row>
        </Column>
    )
}

export default UserPagePosts
