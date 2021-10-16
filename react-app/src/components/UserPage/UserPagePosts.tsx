import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPagePosts.module.scss'
import SearchBar from '@components/SearchBar'
import UserPagePostFilters from '@components/UserPage/UserPagePostFilters'
import PostCard from '@components/Cards/PostCard/PostCard'
import { onPageBottomReached } from '@src/Functions'

const UserPagePosts = (): JSX.Element => {
    const {
        userData,
        userPosts,
        userPostsLoading,
        userPostsFilters,
        userPostsFiltersOpen,
        userPostsPaginationOffset,
        userPostsPaginationHasMore,
        setSelectedUserSubPage,
        setUserPostsFiltersOpen,
        getUserPosts,
        updateUserPostsFilter,
    } = useContext(UserContext)

    const [pageBottomReached, setPageBottomReached] = useState(false)

    // set selected sub page and add scroll listener
    useEffect(() => {
        setSelectedUserSubPage('posts')
        const scrollHandler = () => onPageBottomReached(setPageBottomReached)
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    // get user posts
    useEffect(() => {
        if (userData.id) getUserPosts(0)
    }, [userData.id, userPostsFilters])

    // get next user posts
    useEffect(() => {
        if (pageBottomReached && userPostsPaginationHasMore) getUserPosts(userPostsPaginationOffset)
    }, [pageBottomReached])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created</div>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar
                        setSearchFilter={(payload) => updateUserPostsFilter('searchQuery', payload)}
                        placeholder='Search posts...'
                    />
                    <div
                        className={styles.filterButton}
                        role='button'
                        tabIndex={0}
                        onClick={() => setUserPostsFiltersOpen(!userPostsFiltersOpen)}
                        onKeyDown={() => setUserPostsFiltersOpen(!userPostsFiltersOpen)}
                    >
                        <img
                            className={styles.filterButtonIcon}
                            src='/icons/sliders-h-solid.svg'
                            aria-label='filters'
                        />
                    </div>
                </div>
                {userPostsFiltersOpen && <UserPagePostFilters />}
            </div>
            {userPostsLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className={styles.userPosts}>
                    {userPosts.length > 0 &&
                        userPosts.map((post, index) => (
                            <PostCard
                                postData={post}
                                key={post.id}
                                index={index}
                                location='user-created-posts'
                            />
                        ))}
                    {userPostsPaginationOffset > 0 && userPosts.length < 1 && (
                        <div className='wecoNoContentPlaceholder'>
                            No posts yet that match those settings...
                        </div>
                    )}
                </ul>
            )}
        </div>
    )
}

export default UserPagePosts
