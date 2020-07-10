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

    const filteredPosts = createdPosts.filter(post => { return post.globalState === 'visible' })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created posts</div>
            <div className={styles.createdPostsHeader}>
                [search and filters go here...]
            </div>
            {filteredPosts.length
                ? <ul className={styles.createdPosts}>
                    {filteredPosts.map((post, index) =>
                        <Post
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