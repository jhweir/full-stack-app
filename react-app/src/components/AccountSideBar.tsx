import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/AccountSideBar.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import FlagImage from './FlagImage'

const AccountSideBar = (): JSX.Element | null => {
    const {
        accountData,
        isLoggedIn,
        // accountSideBarDisplay,
        // setAccountSideBarDisplay
    } = useContext(AccountContext)

    // console.log('accountData: ', accountData)

    if (isLoggedIn && accountData.FollowedHolons.length) {
        return (
            <div className={styles.wrapper}>
                <p>FOLLOWED SPACES</p>
                <div className={styles.section}>
                    {accountData.id &&
                        accountData.FollowedHolons.map((space) => (
                            <Link to={`/s/${space.handle}`}>
                                <FlagImage type='space' size={50} imagePath={space.flagImagePath} />
                            </Link>
                        ))}
                </div>
            </div>
        )
    }
    return null
}

export default AccountSideBar
