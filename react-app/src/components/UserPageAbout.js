import React, { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageAbout.module.scss'
// import Post from './Post'
// import WallHeader from './WallHeader'
// import WallPlaceholder from './WallPlaceholder'

function UserPageAbout() {
    const { userData, setSelectedSubPage } = useContext(UserContext)

    let d = new Date(userData.createdAt)
    let dateJoined = `${d.getHours()}:${d.getMinutes()} on ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

    useEffect(() => {
        setSelectedSubPage('about')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                About
            </div>
            <div className={styles.body}>
                <div><b>Name:</b> {userData.name}</div>
                <div><b>Bio:</b> {userData.bio}</div>
                <div><b>Joined:</b> {dateJoined}</div>
            </div>
        </div>
    )
}

export default UserPageAbout