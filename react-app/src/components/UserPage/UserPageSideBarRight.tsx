import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/UserPageSideBarRight.module.scss'
// import SideBarRightPlaceholder from '../components/SideBarRightPlaceholder'

const UserPageSideBarRight = (): JSX.Element => {
    const { userData } = useContext(UserContext)
    const { setSpaceHandle } = useContext(SpaceContext)

    return (
        <div className={styles.sideBarRight}>
            {/* <SideBarRightPlaceholder/> */}
            {userData && userData.ModeratedHolons && userData.ModeratedHolons.length > 0 && (
                <div className={`${styles.sideBarRightContent} ${styles.visible}`}>
                    <span className={styles.sideBarRightText}>Moderated spaces:</span>
                    <ul className={styles.sideBarRightHolons}>
                        {userData.ModeratedHolons.map((holon) => (
                            <Link
                                className={styles.sideBarRightHolon}
                                to={`/s/${holon && holon.handle}`}
                                key={holon && holon.handle}
                                onClick={() => {
                                    if (holon) setSpaceHandle(holon.handle)
                                }}
                            >
                                {holon && holon.flagImagePath === null ? (
                                    <div className={styles.placeholderWrapper}>
                                        <img
                                            className={styles.placeholder}
                                            src='/icons/users-solid.svg'
                                            aria-label='users'
                                        />
                                    </div>
                                ) : (
                                    <img
                                        className={styles.image}
                                        src={holon && holon.flagImagePath}
                                        aria-label='users'
                                    />
                                )}
                                {/* <div className={styles.sideBarRightHolonImageWrapper}>
                                    <img className={styles.sideBarRightHolonImage} src="/icons/users-solid.svg"/>
                                </div> */}
                                {holon && holon.name}
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
            {userData && userData.FollowedHolons && userData.FollowedHolons.length > 0 && (
                <div className={`${styles.sideBarRightContent} ${styles.visible}`}>
                    <span className={styles.sideBarRightText}>Followed spaces:</span>
                    <ul className={styles.sideBarRightHolons}>
                        {userData.FollowedHolons.map((holon) => (
                            <Link
                                className={styles.sideBarRightHolon}
                                to={`/s/${holon && holon.handle}`}
                                key={holon && holon.handle}
                                onClick={() => {
                                    if (holon) setSpaceHandle(holon.handle)
                                }}
                            >
                                {holon && holon.flagImagePath === null ? (
                                    <div className={styles.placeholderWrapper}>
                                        <img
                                            className={styles.placeholder}
                                            src='/icons/users-solid.svg'
                                            aria-label='users'
                                        />
                                    </div>
                                ) : (
                                    <img
                                        className={styles.image}
                                        src={holon && holon.flagImagePath}
                                        aria-label='users'
                                    />
                                )}
                                {/* <div className={styles.sideBarRightHolonImageWrapper}>
                                    <img className={styles.sideBarRightHolonImage} src="/icons/users-solid.svg"/>
                                </div> */}
                                {holon && holon.name}
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default UserPageSideBarRight
