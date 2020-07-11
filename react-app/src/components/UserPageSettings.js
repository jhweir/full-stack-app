import React, { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageSettings.module.scss'
// import Post from './Post'
// import HolonPagePostsHeader from './HolonPagePostsHeader'
// import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'

function UserPageSettings() {
    const { userData, setSelectedSubPage } = useContext(UserContext)

    useEffect(() => {
        setSelectedSubPage('settings')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                Settings
            </div>
            <div className={styles.body}>
                Change settings here...
            </div>
        </div>
    )
}

export default UserPageSettings