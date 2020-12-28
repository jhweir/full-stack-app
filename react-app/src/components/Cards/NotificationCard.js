import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import styles from '../../styles/components/NotificationCard.module.scss'
import SmallFlagImage from '../SmallFlagImage'

function NotificationCard(props) {
    const {
        notification,
        index
    } = props

    // const { setHolonHandle } = useContext(HolonContext)
    const { accountData } = useContext(AccountContext)
    const { setPostId } = useContext(PostContext)

    function formatDate(date) {
        if (date) {
            let a = date.split(/[-.T :]/)
            let formattedDate = a[3]+':'+a[4]+' on '+a[2]+'-'+a[1]+'-'+a[0]
            return formattedDate
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.index}>{ index + 1 }</div>
            
            {notification.type === 'post-liked' &&
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/thumbs-up-solid.svg' alt=''/>
                    </div>
                    <div className={styles.info}>
                        <Link className={styles.imageTextLink} to={`/u/${notification.triggerUser.handle}`}>
                            <SmallFlagImage type='user' size={30} imagePath={notification.triggerUser.flagImagePath}/>
                            <span>{accountData.id === notification.triggerUser.id ? 'You' : notification.triggerUser.name}</span>
                        </Link>
                        <div className={`greyText`}>liked your</div>
                        <Link className={styles.imageTextLink} to={`/p/${notification.postId}`} onClick={() => setPostId(notification.postId)}>
                            <span className={`blueText`}>post</span>
                        </Link>
                        <div className={`greyText`}>| {formatDate(notification.createdAt)}</div>

                    </div>
                </div>
            }


            {/*<Link className={styles.flagImage}
                to={ `/s/${handle}` }
                onClick={ () => { setHolonHandle(handle) } }>
                    {flagImagePath === null
                        ? <div className={styles.flagImagePlaceholderWrapper}>
                            <img className={styles.flagImagePlaceholder} src='/icons/users-solid.svg' alt=''/>
                        </div>
                        : <img className={styles.flagImage} src={flagImagePath} alt=''/>
                    }
            </Link>
            <div className={styles.info}>
                <Link className={styles.title}
                    to={ `/s/${handle}` }
                    onClick={ () => { setHolonHandle(handle) } }>
                    { name }
                </Link>
                <span className={styles.description}>{description}</span>
                <div className={styles.stat}>
                    <img className={styles.statIcon} src="/icons/users-solid.svg" alt=''/>
                    <span>{ total_followers } Followers</span>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/edit-solid.svg" alt=''/>
                        <span>{ total_posts } Posts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/comment-solid.svg" alt=''/>
                        <span>{ total_comments } Comments</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/fire-alt-solid.svg" alt=''/>
                        <span>{ total_reactions } Reactions</span>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default NotificationCard