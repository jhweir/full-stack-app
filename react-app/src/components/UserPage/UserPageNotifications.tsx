import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageNotifications.module.scss'
import NotificationCard from '../Cards/NotificationCard'
import config from '../../Config'

const UserPageNotifications = (): JSX.Element => {
    const {
        getAccountData,
        getNotifications,
        // getNextNotifications,
        notifications,
    } = useContext(AccountContext)
    const { userData, userContextLoading, setSelectedUserSubPage, isOwnAccount } = useContext(
        UserContext
    )

    const [renderKey, setRenderKey] = useState(0)

    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')

    useEffect(() => {
        setSelectedUserSubPage('notifications')
        if (!userContextLoading && userData.id && isOwnAccount) {
            getNotifications()
        }
    }, [userContextLoading]) // add search and filters when set up

    useEffect(() => {
        setRenderKey(renderKey + 1)
    }, [notifications])

    function markAllNotificationsSeen() {
        if (accessToken) {
            axios
                .post(`${config.apiURL}/mark-all-notifications-seen`, null, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setTimeout(() => {
                            getAccountData()
                            getNotifications()
                        }, 500)
                    }
                })
        }
    }

    return (
        <div className={styles.wrapper}>
            <span className={styles.header}>Notifications</span>
            <div
                role='button'
                tabIndex={0}
                onClick={() => markAllNotificationsSeen()}
                onKeyDown={() => markAllNotificationsSeen()}
            >
                <img
                    className={styles.seenIcon}
                    title='Mark all notifications seen'
                    src='/icons/eye-solid.svg'
                    aria-label='Mark all notifications seen'
                />
            </div>
            <ul className={styles.notifications} key={renderKey}>
                {notifications.map((notification) => (
                    <NotificationCard
                        notification={notification}
                        // index={index}
                        key={notification.id}
                    />
                ))}
            </ul>
        </div>
    )
}

export default UserPageNotifications
