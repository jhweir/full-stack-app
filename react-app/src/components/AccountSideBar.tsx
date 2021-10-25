import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/AccountSideBar.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import FlagImage from '@components/FlagImage'

const AccountSideBar = (): JSX.Element | null => {
    const { accountData, loggedIn } = useContext(AccountContext)
    const { selectedSpaceSubPage } = useContext(SpaceContext)

    if (loggedIn && accountData.FollowedHolons.length) {
        return (
            <div className={styles.wrapper}>
                <p>FOLLOWED SPACES</p>
                <div className={styles.section}>
                    {accountData.id &&
                        accountData.FollowedHolons.map((space) => (
                            // <div key={space.id}>
                            <Link to={`/s/${space.handle}/${selectedSpaceSubPage}`} key={space.id}>
                                <FlagImage type='space' size={50} imagePath={space.flagImagePath} />
                            </Link>
                            /* </div> */
                        ))}
                </div>
            </div>
        )
    }
    return null
}

export default AccountSideBar
