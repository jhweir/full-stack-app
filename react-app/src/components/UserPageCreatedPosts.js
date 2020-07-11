import React, { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/UserPageCreatedPosts.module.scss'
import Post from './Post'
// import HolonPagePostsHeader from './HolonPagePostsHeader'
// import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'

function UserPageCreatedPosts() {
    const { accountContextLoading, isLoggedIn, accountData } = useContext(AccountContext)
    const { userData, setSelectedSubPage, getCreatedPosts, createdPosts } = useContext(UserContext)

    useEffect(() => {
        if (!accountContextLoading) {
            setSelectedSubPage('created-posts')
            getCreatedPosts()
        }
    }, [accountContextLoading])

    const visiblePosts = createdPosts.filter(post => { return post.globalState === 'visible' })

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Created posts</div>
            <div className={styles.createdPostsHeader}>
                [search and filters go here...]
            </div>
            {visiblePosts.length 
                ? <ul className={styles.createdPosts}>
                    {visiblePosts.map((post, index) =>
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