import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPagePosts.module.scss'
import SearchBar from '@components/SearchBar'
import UserPagePostFilters from '@components/UserPage/UserPagePostFilters'
import PostCard from '@components/Cards/PostCard/PostCard'
import { onPageBottomReached } from '@src/Functions'
import Button from '@components/Button'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

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
            <div className={styles.headerRow}>
                <div>
                    <SearchBar
                        setSearchFilter={(payload) => updateUserPostsFilter('searchQuery', payload)}
                        placeholder='Search posts...'
                    />
                    <Button
                        icon={<SlidersIconSVG />}
                        colour='grey'
                        size='medium'
                        margin='0 10px 0 0'
                        onClick={() => setUserPostsFiltersOpen(!userPostsFiltersOpen)}
                    />
                </div>
            </div>
            {userPostsFiltersOpen && <UserPagePostFilters />}
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
