import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageMessages.module.scss'
// import PostCard from './PostCard'
// import SpacePagePostsHeader from './SpacePagePostsHeader'
// import SpacePagePostsPlaceholder from './SpacePagePostsPlaceholder'

const UserPageMessages = (): JSX.Element => {
    const { setSelectedUserSubPage } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('messages')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Messages</div>
            <div className={styles.body}>[Coming soon...]</div>
        </div>
    )
}

export default UserPageMessages
