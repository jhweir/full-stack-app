import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageNotifications.module.scss'
import NotificationCard from '../Cards/NotificationCard'

function UserPageNotifications() {
    const { getNotifications, getNextNotifications, notifications} = useContext(AccountContext)
    const { userData, userContextLoading, setSelectedUserSubPage, isOwnAccount } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('notifications')
        if (!userContextLoading && userData.id && isOwnAccount) { getNotifications() }
    }, [userContextLoading]) // add search and filters when set up

    //console.log('notifications: ', notifications)

    return (
        <div className={styles.wrapper}>
            <span className={styles.header}>Notifications</span>
            {/* <div className={styles.body}>[Coming soon...]</div> */}
            {notifications.length > 0 &&
                <ul className={styles.notifications}>
                    {notifications.map((notification, index) =>
                        <NotificationCard notification={notification} index={index} key={index}/>
                    )}
                </ul>
            }
        </div>
    )
}

export default UserPageNotifications