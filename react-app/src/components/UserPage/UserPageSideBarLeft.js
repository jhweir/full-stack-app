import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageSideBarLeft.module.scss'
import LargeFlagImage from '../LargeFlagImage'
import SideBarButton from '../SideBarButton'
//import HolonPageSideBarLeftPlaceholder from '../components/HolonPageSideBarLeftPlaceholder'

function UserPageSideBarLeft() {
    const { userData, isOwnAccount, selectedUserSubPage } = useContext(UserContext)

    return (
        <div className={styles.sideBarLeft}>
            <LargeFlagImage
                size={150}
                imagePath={userData.flagImagePath}
                imageUploadType='user-flag-image'
                canEdit={isOwnAccount}
            />
            <div className={styles.userName}>{ userData.name }</div>
            <div className={styles.navButtons}>
                {isOwnAccount && <>
                    <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedUserSubPage === 'settings'}
                        marginBottom={5}
                    />
                    <SideBarButton
                        icon='bell-solid.svg'
                        text='Notifications'
                        url='notifications'
                        selected={selectedUserSubPage === 'notifications'}
                        marginBottom={5}
                    />
                    <SideBarButton
                        icon='envelope-solid.svg'
                        text='Messages'
                        url='messages'
                        selected={selectedUserSubPage === 'messages'}
                        marginBottom={5}
                    />
                </>}
                <SideBarButton
                    icon='book-open-solid.svg'
                    text='About'
                    url='about'
                    selected={selectedUserSubPage === 'about'}
                    marginBottom={5}
                />
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