import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageNotifications.module.scss'
import NotificationCard from '../Cards/NotificationCard'
import axios from 'axios'
import config from '../../Config'

function UserPageNotifications() {
    const { accountData, getAccountData, getNotifications, getNextNotifications, notifications, accountContextLoading } = useContext(AccountContext)
    const { userData, userContextLoading, setSelectedUserSubPage, isOwnAccount } = useContext(UserContext)

    const [renderKey, setRenderKey] = useState(0)

    useEffect(() => {
        setSelectedUserSubPage('notifications')
        if (!userContextLoading && userData.id && isOwnAccount) { getNotifications() }
    }, [userContextLoading]) // add search and filters when set up

    useEffect(() => {
        setRenderKey(renderKey + 1)
    }, [notifications])

    function markAllNotificationsSeen() {
        axios.post(config.apiURL + '/mark-all-notifications-seen', { accountId: accountData.id })
            .then(res => {
                if (res.data === 'success') {
                    setTimeout(() => { getAccountData(); getNotifications() }, 500)
                }
            })
    }

    return (
        <div className={styles.wrapper}>
            <span className={styles.header}>Notifications</span>
            <img
                className={styles.seenIcon}
                title='Mark all notifications seen'
                src='/icons/eye-solid.svg'
                onClick={() => markAllNotificationsSeen()}
            />
            <ul className={styles.notifications} key={renderKey}>
                {notifications.map((notification, index) =>
                    <NotificationCard notification={notification} index={index} key={index}/>
                )}
            </ul>
        </div>
    )
}

export default UserPageNotifications