import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/UserCard.module.scss'
import { IUser } from '../../Interfaces'
import SmallFlagImage from '../SmallFlagImage'
import { timeSinceCreated } from '../../Functions'

const UserCard = (props: { index: number; user: IUser }): JSX.Element => {
    const { index, user } = props
    const {
        // id,
        handle,
        name,
        bio,
        flagImagePath,
        total_posts,
        total_comments,
        createdAt,
    } = user

    const { setSelectedNavBarItem } = useContext(AccountContext)

    // const d = new Date(createdAt)
    // const dateJoined = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`

    return (
        <div className={styles.userCard}>
            <div className={styles.index}>{index + 1}</div>
            <Link to={`/u/${handle}`} onClick={() => setSelectedNavBarItem('')}>
                {/* {flagImagePath === null ? (
                    <div className={styles.flagImagePlaceholderWrapper}>
                        <img
                            className={styles.flagImagePlaceholder}
                            src='/icons/user-solid.svg'
                            alt=''
                        />
                    </div>
                ) : (
                    <img className={styles.flagImage} src={flagImagePath} alt='' />
                )} */}
                <SmallFlagImage size={120} imagePath={flagImagePath} type='user' />
            </Link>
            <div className={styles.content}>
                <Link
                    className={styles.title}
                    to={`/u/${handle}`}
                    onClick={() => setSelectedNavBarItem('')}
                >
                    {name}
                </Link>
                <span className={`${styles.text} ${styles.grey}`}>u/{handle}</span>
                <span className={styles.text}>Joined {timeSinceCreated(createdAt)}</span>
                <span className={styles.text}>{bio}</span>
                {/* <div className={styles.stat}>
                    <img className={styles.statIcon} src="/icons/users-solid.svg" alt=''/>
                    <span>{ total_followers } Followers</span>
                </div> */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src='/icons/edit-solid.svg' alt='' />
                        <span>{total_posts} Posts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src='/icons/comment-solid.svg' alt='' />
                        <span>{total_comments} Comments</span>
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
                        <img className={styles.statIcon} src="/icons/star-solid.svg" alt=''/>
                        <span>{ total_ratings } Ratings</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default UserCard
