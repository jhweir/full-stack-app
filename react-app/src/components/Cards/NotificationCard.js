import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import styles from '../../styles/components/NotificationCard.module.scss'
import SmallFlagImage from '../SmallFlagImage'
import axios from 'axios'
import config from '../../Config'

function NotificationCard(props) {
    const {
        notification,
        index
    } = props

    // const { setHolonHandle } = useContext(HolonContext)
    const { accountData, getAccountData, getNotifications } = useContext(AccountContext)
    const { setPostId } = useContext(PostContext)

    const [seen, setSeen] = useState(false)

    useEffect(() => {
        if (notification.id) { setSeen(notification.seen) }
    }, [notification.id])

    function formatDate(date) {
        if (date) {
            let a = date.split(/[-.T :]/)
            let formattedDate = a[3]+':'+a[4]+' on '+a[2]+'-'+a[1]+'-'+a[0]
            return formattedDate
        }
    }

    function toggleSeen() {
        setSeen(!seen)
        axios.post(config.apiURL + '/toggle-notification-seen', { notificationId: notification.id, seen: seen ? false : true  })
            .then(res => {
                if (res.data === 'success') {
                    setTimeout(() => {
                        getAccountData()
                        //getNotifications()
                    }, 300)
                }
            })
    }

    return (
        <div className={`${styles.wrapper} ${seen && styles.seen}`}>
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
                        <div className={`greyText mr-10`}>in</div>
                        <Link className={styles.imageTextLink} to={`/s/${notification.triggerSpace.handle}`}>
                            <SmallFlagImage type='space' size={30} imagePath={notification.triggerSpace.flagImagePath}/>
                            <span>{notification.triggerSpace.name}</span>
                        </Link>
                        <div className={`greyText`}>| {formatDate(notification.createdAt)}</div>
                    </div>
                    <img
                        className={styles.seenIcon}
                        src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                        onClick={() => toggleSeen()}
                    />
                </div>
            }

            {notification.type === 'post-comment' &&
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/comment-solid.svg' alt=''/>
                    </div>
                    <div className={styles.info}>
                        <Link className={styles.imageTextLink} to={`/u/${notification.triggerUser.handle}`}>
                            <SmallFlagImage type='user' size={30} imagePath={notification.triggerUser.flagImagePath}/>
                            <span>{accountData.id === notification.triggerUser.id ? 'You' : notification.triggerUser.name}</span>
                        </Link>
                        <div className={`greyText`}>commented on your</div>
                        <Link className={styles.imageTextLink} to={`/p/${notification.postId}`} onClick={() => setPostId(notification.postId)}>
                            <span className={`blueText`}>post</span>
                        </Link>
                        {/* <div className={`greyText mr-10`}>in</div>
                        <Link className={styles.imageTextLink} to={`/s/${notification.triggerSpace.handle}`}>
                            <SmallFlagImage type='space' size={30} imagePath={notification.triggerSpace.flagImagePath}/>
                            <span>{notification.triggerSpace.name}</span>
                        </Link> */}
                        <div className={`greyText`}>| {formatDate(notification.createdAt)}</div>
                    </div>
                    <img
                        className={styles.seenIcon}
                        src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                        onClick={() => toggleSeen()}
                    />
                </div>
            }

        </div>
    )
}

export default NotificationCard