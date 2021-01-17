import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/UserPageSideBarLeft.module.scss'
import LargeFlagImage from '../LargeFlagImage'
import SideBarButton from '../SideBarButton'
//import HolonPageSideBarLeftPlaceholder from '../components/HolonPageSideBarLeftPlaceholder'

function UserPageSideBarLeft() {
    const { accountData } = useContext(AccountContext)
    const { userData, isOwnAccount, selectedUserSubPage } = useContext(UserContext)

    return (
        <div className={styles.sideBarLeft}>
            <LargeFlagImage
                size={180}
                imagePath={userData.flagImagePath}
                type='user'
                canEdit={isOwnAccount}
            />
            <div className={styles.userName}>{ userData.name }</div>
            <div className={styles.navButtons}>
                {/* TODO: replace SideBarButton with actual content */}
                <SideBarButton
                    icon='book-open-solid.svg'
                    text='About'
                    url='about'
                    selected={selectedUserSubPage === 'about'}
                    marginBottom={5}
                />
                {isOwnAccount &&
                    <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedUserSubPage === 'settings'}
                        marginBottom={5}
                    />
                }
                {isOwnAccount && <>
                    <Link to={'notifications'}
                        className={`${styles.button} ${selectedUserSubPage === 'notifications' && styles.selected}`}
                        style={{marginBottom: 5}}>
                        <img className={styles.icon} src={`/icons/bell-solid.svg`}/>
                        <span className={accountData.unseen_notifications && 'ml-10'}>Notifications</span>
                        {accountData.unseen_notifications > 0 &&
                            <div className={styles.notification}>{ accountData.unseen_notifications }</div>
                        }
                    </Link>
                    <SideBarButton
                        icon='envelope-solid.svg'
                        text='Messages'
                        url='messages'
                        selected={selectedUserSubPage === 'messages'}
                        marginBottom={5}
                    />
                </>}
                <SideBarButton
                    icon='edit-solid.svg'
                    text='Posts'
                    url='posts'
                    selected={selectedUserSubPage === 'posts'}
                    marginBottom={5}
                />
                <span className={styles.bio}>{userData.bio}</span>
            </div>
        </div>
    )
}

export default UserPageSideBarLeft

{/* <HolonPageSideBarLeftPlaceholder/> */}