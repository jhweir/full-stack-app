import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/UserPageSideBarRight.module.scss'
// import SideBarRightPlaceholder from '../components/SideBarRightPlaceholder'

function UserPageSideBarRight() {
    const { userData, getUserData, selectedUserSubPage, setSelectedUserSubPage } = useContext(UserContext)
    const { setHolonHandle } = useContext(HolonContext)

    return (
        <div className={styles.sideBarRight}>
            {/* <SideBarRightPlaceholder/> */}
            {userData.ModeratedHolons.length > 0 &&
                <div className={`${styles.sideBarRightContent} ${styles.visible}`}>
                    <span className={styles.sideBarRightText}>Moderated spaces:</span>
                    <ul className={styles.sideBarRightHolons}>
                        {userData.ModeratedHolons.map((holon, index) => 
                            <Link className={styles.sideBarRightHolon}
                                to={ `/h/${holon.handle}` }
                                key={index}
                                onClick={ () => { setHolonHandle(holon.handle) } }>
                                <div className={styles.sideBarRightHolonImageWrapper}>
                                    <img className={styles.sideBarRightHolonImage} src="/icons/users-solid.svg"/>
                                </div>
                                { holon.name }
                            </Link>
                        )} 
                    </ul>
                </div>
            }
            {userData.FollowedHolons.length > 0 &&
                <div className={`${styles.sideBarRightContent} ${(styles.visible)}`}>
                    <span className={styles.sideBarRightText}>Followed spaces:</span>
                    <ul className={styles.sideBarRightHolons}>
                        {userData.FollowedHolons.map((holon, index) => 
                            <Link className={styles.sideBarRightHolon}
                                to={ `/h/${holon.handle}` }
                                key={index}
                                onClick={ () => { setHolonHandle(holon.handle) } }>
                                <div className={styles.sideBarRightHolonImageWrapper}>
                                    <img className={styles.sideBarRightHolonImage} src="/icons/users-solid.svg"/>
                                </div>
                                { holon.name }
                            </Link>
                        )} 
                    </ul>
                </div>
            }
        </div>
    )
}

export default UserPageSideBarRight