import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageAbout.module.scss'
// import PostCard from './PostCard'
// import HolonPagePostsHeader from './HolonPagePostsHeader'
// import HolonPagePostsPlaceholder from './HolonPagePostsPlaceholder'

function UserPageAbout() {
    const { userData, setSelectedUserSubPage } = useContext(UserContext)

    function formatMinutes(number) {
        if (number < 10) return `0${number}`
        else return number
    }

    let d = new Date(userData.createdAt)
    let dateJoined = `${d.getHours()}:${formatMinutes(d.getMinutes())} on ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

    useEffect(() => {
        setSelectedUserSubPage('about')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                About
            </div>
            <div className={styles.content}>
                <div className={styles.name}>{userData.name}</div>
                <div className={styles.handle}>u/{userData.handle}</div>
                <div className={styles.created}>
                    <div className={`${styles.text} mr-10`}>Joined at {dateJoined}</div>
                </div>
                <div className={styles.text}>{userData.bio}</div>
            </div>
        </div>
    )
}

export default UserPageAbout