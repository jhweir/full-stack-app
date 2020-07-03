import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/User.module.scss'

function User(props) {
    const { user } = props

    let d = new Date(user.createdAt)
    let dateJoined = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

    return (
        <div className={styles.user}>
            <Link className={styles.userImage} to={ `/u/${user.name}` }>
                <img className={styles.userImage} src={user.profileImagePath ? user.profileImagePath : "/icons/holon-flag-image-03.svg"} alt=''/>
            </Link>
            <div className={styles.userInfo}>
                <Link className={styles.userName} to={ `/u/${user.name}` }>
                    {user.name}
                </Link>
                <span className={styles.userBio}>{user.bio}</span>
                <span className={styles.userBio}>Date joined: {dateJoined}</span>
            </div>
        </div>
    )
}

export default User