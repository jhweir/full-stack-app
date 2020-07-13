import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageCreatedPosts.module.scss'
import PostCard from '../Cards/PostCard'

function UserPageCreatedPosts() {
    const { userContextLoading, userData, setSelectedUserSubPage, getCreatedPosts, createdPosts } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('created-posts')
    }, [])

    useEffect(() => {
        if (!userContextLoading && userData.id) { getCreatedPosts() }
    }, [userContextLoading])

    let visiblePosts = createdPosts.filter(post => { return post.globalState === 'visible' })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created posts</div>
            <div className={styles.createdPostsHeader}>
                [search and filters go here...]
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

export default UserPageCreatedPosts