import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageUsers.module.scss'
import UserCard from '../Cards/UserCard'

function HolonPageUsers() {
    const { holonContextLoading, holonData, holonFollowers, getHolonFollowers, setSelectedHolonSubPage } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('users')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData.id) { getHolonFollowers() }
    }, [holonContextLoading])

    return (
        <div className={styles.usersWrapper}>
            Search and filters go here...
            {/* <HolonPageSpacesPlaceholder/> */}
            <ul className={styles.users}>
                {holonFollowers.length > 0 && holonFollowers.map((user, index) =>
                    <UserCard
                        key={index} 
                        index={index}
                        user={user}
                    />
                )} 
            </ul>
        </div>
    )
}

export default HolonPageUsers
