import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/UserCard.module.scss'

function UserCard(props) {
    const {
        id,
        handle,
        name,
        bio,
        flagImagePath,
        total_posts,
        total_comments,
        createdAt
    } = props.user

    let d = new Date(createdAt)
    let dateJoined = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

    return (
        <div className={styles.userCard}>
            <div className={styles.index}>{ props.index + 1 }</div>
            <Link to={ `/u/${handle}` }>
                {flagImagePath === null
                    ? <div className={styles.flagImagePlaceholderWrapper}>
                        <img className={styles.flagImagePlaceholder} src='/icons/user-solid.svg' alt=''/>
                    </div>
                    : <img className={styles.flagImage} src={flagImagePath} alt=''/>
                }
            </Link>
            <div className={styles.content}>
                <Link className={styles.title} to={ `/u/${handle}` }>
                    { name }
                </Link>
                <span className={`${styles.text} ${styles.grey}`}>u/{ handle }</span>
                <span className={styles.text}>Joined: { dateJoined }</span>
                <span className={styles.text}>{ bio }</span>
                {/* <div className={styles.stat}>
                    <img className={styles.statIcon} src="/icons/users-solid.svg" alt=''/>
                    <span>{ total_followers } Followers</span>
                </div> */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/edit-solid.svg" alt=''/>
                        <span>{ total_posts } Posts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/comment-solid.svg" alt=''/>
                        <span>{ total_comments } Comments</span>
                    </div>
                    {/* <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/fire-alt-solid.svg" alt=''/>
                        <span>{ total_reactions } Reactions</span>
                    </div> */}
                    {/* <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/thumbs-up-solid.svg" alt=''/>
                        <span>{ total_likes } Likes</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/heart-solid.svg" alt=''/>
                        <span>{ total_hearts } Hearts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/star-solid.svg" alt=''/>
                        <span>{ total_ratings } Ratings</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default UserCard

// import React, { useContext } from 'react'
// import { Link } from 'react-router-dom'
// import styles from '../../styles/components/UserCard.module.scss'

// function UserCard(props) {
//     const { user } = props

//     let d = new Date(user.createdAt)
//     let dateJoined = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

//     return (
//         <div className={styles.user}>
//             <Link className={styles.userImage} to={ `/u/${user.name}` }>
//                 <img className={styles.userImage} src={user.flagImagePath ? user.flagImagePath : "/icons/holon-flag-image-03.svg"} alt=''/>
//             </Link>
//             <div className={styles.userInfo}>
//                 <Link className={styles.userName} to={ `/u/${user.name}` }>
//                     {user.name}
//                 </Link>
//                 <span className={styles.userBio}>{user.bio}</span>
//                 <span className={styles.userBio}>Date joined: {dateJoined}</span>
//             </div>
//         </div>
//     )
// }

// export default UserCard