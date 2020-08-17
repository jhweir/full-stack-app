import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageSideBarLeft.module.scss'
import FlagImage from '../FlagImage'
import SideBarButton from '../SideBarButton'
//import HolonPageSideBarLeftPlaceholder from '../components/HolonPageSideBarLeftPlaceholder'

function UserPageSideBarLeft() {
    const { userData, isOwnAccount, selectedUserSubPage } = useContext(UserContext)

    return (
        <div className={styles.sideBarLeft}>
            <FlagImage
                flagImagePath={userData.flagImagePath}
                imageUploadType='user-flag-image'
                canEdit={isOwnAccount}
            />
            <div className={styles.userName}>{ userData.name }</div>
            <div className={styles.navButtons}>
                {isOwnAccount && <SideBarButton
                    icon='cog-solid.svg'
                    text='Settings'
                    url='settings'
                    selected={selectedUserSubPage === 'settings'}
                    marginBottom={10}
                />}
                <SideBarButton
                    icon='book-open-solid.svg'
                    text='About'
                    url='about'
                    selected={selectedUserSubPage === 'about'}
                />
                <SideBarButton
                    icon='edit-solid.svg'
                    text='Posts'
                    url='posts'
                    selected={selectedUserSubPage === 'posts'}
                />
                <span className={styles.bio}>{userData.bio}</span>
            </div>
        </div>
    )
}

export default UserPageSideBarLeft

{/* <HolonPageSideBarLeftPlaceholder/> */}