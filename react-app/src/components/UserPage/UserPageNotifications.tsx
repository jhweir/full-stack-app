import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '@contexts/AccountContext'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPageNotifications.module.scss'
import NotificationCard from '@components/Cards/NotificationCard'
import Column from '@components/Column'
import config from '@src/Config'

const UserPageNotifications = (): JSX.Element => {
    const {
        // getAccountData,
        accountDataLoading,
        updateAccountData,
        // getNotifications,
        // setNotifications,
        // // getNextNotifications,
        // notifications,
    } = useContext(AccountContext)
    const { userData, setSelectedUserSubPage, isOwnAccount } = useContext(UserContext)
    const cookies = new Cookies()

    const [notifications, setNotifications] = useState<any[]>([])
    const [notificationsLoading, setNotificationsLoading] = useState(true)

    // todo: add pagination, search, filters, loading state etc

    function getNotifications() {
        console.log('AccountContext: getNotifications')
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        if (!accessToken) setNotificationsLoading(false)
        else {
            axios
                .get(`${config.apiURL}/account-notifications`, authHeader)
                .then((res) => {
                    setNotifications(res.data)
                    setNotificationsLoading(false)
                    // mark notifications seen in db
                    const ids = res.data.map((notification) => notification.id)
                    axios.post(`${config.apiURL}/mark-notifications-seen`, ids, authHeader)
                })
                .catch((error) => console.log('GET account-notifications error: ', error))
        }
    }

    function updateNotification(id, key, payload) {
        const newNotifications = [...notifications]
        const notification = newNotifications.find((n) => n.id === id)
        notification[key] = payload
        setNotifications(newNotifications)
    }

    const history = useHistory()

    useEffect(() => setSelectedUserSubPage('notifications'), [])

    useEffect(() => {
        if (!accountDataLoading && userData.id) {
            if (!isOwnAccount) history.push(`/u/${userData.handle}/about`)
            else {
                updateAccountData('unseen_notifications', 0)
                getNotifications()
            }
        }
    }, [accountDataLoading, userData.id])

    return (
        <Column className={styles.wrapper}>
            <Column className={styles.notifications}>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            location='account'
                            updateNotification={updateNotification}
                        />
                    ))
                ) : (
                    <p>No notifications yet</p>
                )}
            </Column>
        </Column>
    )
}

export default UserPageNotifications

/* <div
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
</div> */

// function markAllNotificationsSeen() {
//     const accessToken = cookies.get('accessToken')
//     const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
//     if (accessToken) {
//         axios
//             .post(`${config.apiURL}/mark-all-notifications-seen`, null, authHeader)
//             .then((res) => {
//                 if (res.data === 'success') {
//                     updateAccountData('unseen_notifications', 0)
//                     setNotifications(
//                         notifications.map((n) => {
//                             return { ...n, seen: true }
//                         })
//                     )
//                     setRenderKey(renderKey + 1)
//                 }
//             })
//     } else {
//         // todo: open alert modal, tell user to log in
//     }
// }
