import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Users.module.scss'
import User from './User'

function Users() {
    const { holonUsers } = useContext(HolonContext)
    return (
        <div className={styles.usersWrapper}>
            users List
            {/* <ChildHolonsHeader/>
            <ChildHolonsPlaceholder/> */}
            <ul className={styles.users}>
                {holonUsers.map((user, index) =>
                    <User
                        key={index} 
                        index={index}
                        user={user}
                    />
                )} 
            </ul>
        </div>
    )
}

export default Users
