import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageSettings.module.scss'
// import Post from './Post'
// import WallHeader from './WallHeader'
// import WallPlaceholder from './WallPlaceholder'

function UserPageSettings() {
    const { userData } = useContext(UserContext)

    return (
        <div className={styles.wrapper}>
            Settings section...
        </div>
    )
}

export default UserPageSettings