import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '@contexts/AccountContext'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPageNotifications.module.scss'
import NotificationCard from '@components/Cards/NotificationCard'
import config from '@src/Config'

const UserPageNotifications = (): JSX.Element => {
    const {
        // getAccountData,
        updateAccountData,
        getNotifications,
        setNotifications,
        // getNextNotifications,
        notifications,
    } = useContext(AccountContext)
    const { userData, setSelectedUserSubPage, isOwnAccount } = useContext(UserContext)
    const [renderKey, setRenderKey] = useState(0)
    const cookies = new Cookies()

    useEffect(() => setSelectedUserSubPage('notifications'), [])

    useEffect(() => {
        if (userData.id && isOwnAccount) getNotifications()
    }, [userData.id])

    // todo: add search and filters when set up

    function markAllNotificationsSeen() {
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        if (accessToken) {
            axios
                .post(`${config.apiURL}/mark-all-notifications-seen`, null, authHeader)
                .then((res) => {
                    if (res.data === 'success') {
                        updateAccountData('unseen_notifications', 0)
                        setNotifications(
                            notifications.map((n) => {
                                return { ...n, seen: true }
                            })
                        )
                        setRenderKey(renderKey + 1)
                    }
                })
        } else {
            // todo: open alert modal, tell user to log in
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
                {notifications ? (
                    notifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            location='account'
                        />
                    ))
                ) : (
                    <p>No notifications yet</p>
                )}
            </ul>
        </div>
    )
}

export default UserPageNotifications
