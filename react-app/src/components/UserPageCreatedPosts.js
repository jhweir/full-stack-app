import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageCreatedPosts.module.scss'
// import Post from './Post'
// import WallHeader from './WallHeader'
// import WallPlaceholder from './WallPlaceholder'

function UserPageCreatedPosts() {
    const { userData } = useContext(UserContext)

    return (
        <div className={styles.wrapper}>
            Created Posts section...
        </div>
    )
}

export default UserPageCreatedPosts