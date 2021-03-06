import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/UserPageSideBarLeft.module.scss'
import LargeFlagImage from '../LargeFlagImage'
import SideBarButton from '../SideBarButton'
// import HolonPageSideBarLeftPlaceholder from '../components/HolonPageSideBarLeftPlaceholder'

const UserPageSideBarLeft = (): JSX.Element => {
    const { accountData } = useContext(AccountContext)
    const { userData, isOwnAccount, selectedUserSubPage } = useContext(UserContext)

    return (
        <div className={styles.sideBarLeft}>
            <LargeFlagImage
                size={180}
                imagePath={userData.flagImagePath}
                type='user'
                canEdit={isOwnAccount}
                yOffset={-110}
            />
            <div className={styles.userName}>{userData.name}</div>
            <div className={styles.navButtons}>
                {/* TODO: replace SideBarButton with actual content */}
                {isOwnAccount && (
                    <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedUserSubPage === 'settings'}
                        marginBottom={5}
                        onClickFunction={() => null}
                        total={null}
                    />
                )}
                <SideBarButton
                    icon='book-open-solid.svg'
                    text='About'
                    url='about'
                    selected={selectedUserSubPage === 'about'}
                    marginBottom={5}
                    onClickFunction={() => null}
                    total={null}
                />
                {isOwnAccount && (
                    <>
                        <Link
                            to='notifications'
                            className={`${styles.button} ${
                                selectedUserSubPage === 'notifications' && styles.selected
                            }`}
                            style={{ marginBottom: 5 }}
                        >
                            <img
                                className={styles.icon}
                                src='/icons/bell-solid.svg'
                                aria-label='bell'
                            />
                            <span className={accountData.unseen_notifications && 'ml-10'}>
                                Notifications
                            </span>
                            {accountData.unseen_notifications > 0 && (
                                <div className={styles.notification}>
                                    {accountData.unseen_notifications}
                                </div>
                            )}
                        </Link>
                        <SideBarButton
                            icon='envelope-solid.svg'
                            text='Messages'
                            url='messages'
                            selected={selectedUserSubPage === 'messages'}
                            marginBottom={5}
                            onClickFunction={() => null}
                            total={null}
                        />
                    </>
                )}
                <SideBarButton
                    icon='edit-solid.svg'
                    text='Posts'
                    url='posts'
                    selected={selectedUserSubPage === 'posts'}
                    marginBottom={5}
                    onClickFunction={() => null}
                    total={null}
                />
                {/* <span className={styles.bio}>{userData.bio}</span> */}
            </div>
        </div>
    )
}

export default UserPageSideBarLeft
