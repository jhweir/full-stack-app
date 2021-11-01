import React, { useContext, useEffect } from 'react'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPageAbout.module.scss'
import { timeSinceCreated, dateCreated } from '@src/Functions'
// import PostCard from './PostCard'
// import HolonPagePostsHeader from './HolonPagePostsHeader'
// import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'

const UserPageAbout = (): JSX.Element => {
    const { userData, setSelectedUserSubPage } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('about')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>About</div>
            <div className={styles.content}>
                <div className={styles.name}>{userData.name}</div>
                <div className={styles.handle}>u/{userData.handle}</div>
                <div className={styles.created}>
                    <p title={dateCreated(userData.createdAt)}>
                        Joined {timeSinceCreated(userData.createdAt)}
                    </p>
                </div>
                <div className={styles.text}>{userData.bio}</div>
            </div>
        </div>
    )
}

export default UserPageAbout
