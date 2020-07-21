import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPagePosts.module.scss'
import SearchBar from '../SearchBar'
import UserPagePostFilters from './UserPagePostFilters'
import PostCard from '../Cards/PostCard'

function UserPagePosts() {
    const {
        userContextLoading, userData,
        setSelectedUserSubPage,
        getCreatedPosts, createdPosts,
        createdPostFiltersOpen, setCreatedPostFiltersOpen
    } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('posts')
    }, [])

    useEffect(() => {
        if (!userContextLoading && userData.id) { getCreatedPosts() }
    }, [userContextLoading])

    let visiblePosts = createdPosts.filter(post => { return post.globalState === 'visible' })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created posts</div>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar type='user-posts'/>
                    <button className='wecoButton mr-10' onClick={() => setCreatedPostFiltersOpen(!createdPostFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                </div>
                <UserPagePostFilters/>
            </div>
            {visiblePosts.length 
                ? <ul className={styles.createdPosts}>
                    {visiblePosts.map((post, index) =>
                        <PostCard
                            post={post}
                            key={index}
                            index={index}
                        />
                    )}
                </ul>
                : <div>No posts created yet</div>
            }
        </div>
    )
}

export default UserPagePosts