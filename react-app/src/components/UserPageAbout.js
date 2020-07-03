import React, { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageAbout.module.scss'
// import Post from './Post'
// import WallHeader from './WallHeader'
// import WallPlaceholder from './WallPlaceholder'

function UserPageAbout() {
    const { userData } = useContext(UserContext)

    let d = new Date(userData.createdAt)
    let dateJoined = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}`

    return (
        <div className={styles.wrapper}>
            About section...
            <div>Name: {userData.name}</div>
            <div>Bio: {userData.bio}</div>
            <div>Date joined: {dateJoined}</div>
        </div>
    )
}

export default UserPageAbout