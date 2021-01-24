import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPagePosts.module.scss'
import SearchBar from '../SearchBar'
import UserPagePostFilters from './UserPagePostFilters'
import PostCard from '../Cards/PostCard/PostCard'

function UserPagePosts() {
    const { pageBottomReached } = useContext(AccountContext)
    const {
        userContextLoading, userData,
        setSelectedUserSubPage, createdPostPaginationOffset,
        getCreatedPosts, getNextCreatedPosts, createdPosts,
        createdPostFiltersOpen, setCreatedPostFiltersOpen,
        createdPostSearchFilter,
        createdPostTimeRangeFilter,
        createdPostTypeFilter,
        createdPostSortByFilter,
        createdPostSortOrderFilter,
        setCreatedPostSearchFilter
    } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('posts')
    }, [])

    useEffect(() => {
        if (!userContextLoading && userData.id) { getCreatedPosts() }
    }, [userContextLoading, createdPostSearchFilter, createdPostTimeRangeFilter, createdPostTypeFilter, createdPostSortByFilter, createdPostSortOrderFilter])

    useEffect(() => {
        if (pageBottomReached && !userContextLoading && userData.id) { getNextCreatedPosts() }
    }, [pageBottomReached])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created</div>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar setSearchFilter={setCreatedPostSearchFilter} placeholder='Search posts...'/>
                    <div className={styles.filterButton} onClick={() => setCreatedPostFiltersOpen(!createdPostFiltersOpen)}>
                        <img className={styles.filterButtonIcon} src='/icons/sliders-h-solid.svg'/>
                    </div>
                </div>
                {createdPostFiltersOpen && <UserPagePostFilters/>}
            </div>
            {createdPosts.length > 0 &&
                <ul className={styles.createdPosts}>
                    {createdPosts.map((post, index) =>
                        <PostCard postData={post} key={index} index={index} location='user-created-posts'/>
                    )}
                </ul>
            }
            {createdPostPaginationOffset > 0 && createdPosts.length < 1 &&
                <div className='wecoNoContentPlaceholder'>
                    No posts yet that match those settings...
                </div>
            }
        </div>
    )
}

export default UserPagePosts