import React, { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageCreatedPosts.module.scss'
import Post from './Post'
// import WallHeader from './WallHeader'
// import WallPlaceholder from './WallPlaceholder'

function UserPageCreatedPosts() {
    const { userData, setSelectedSubPage, getCreatedPosts, createdPosts } = useContext(UserContext)

    useEffect(() => {
        setSelectedSubPage('created-posts')
        getCreatedPosts()
    }, [userData])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created posts</div>
            <div className={styles.createdPostsHeader}>
                search and filters go here...
            </div>
            <ul className={styles.createdPosts}>
                {createdPosts.map((post, index) =>
                    <Post
                        post={post}
                        key={index}
                        index={index}
                    />
                )} 
            </ul>
        </div>
    )
}

export default UserPageCreatedPosts