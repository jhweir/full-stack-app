import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageSideBarLeft.module.scss'
import FlagImage from '../FlagImage'
import SideBarButton from '../SideBarButton'
//import HolonPageSideBarLeftPlaceholder from '../components/HolonPageSideBarLeftPlaceholder'

function UserPageSideBarLeft() {
    const { userData, isOwnAccount } = useContext(UserContext)

    return (
        <div className={styles.sideBarLeft}>
            {/* <FlagImage type='user'/> */}
            <FlagImage
                flagImagePath={userData.flagImagePath}
                imageUploadType='user-flag-image'
                canEdit={isOwnAccount}
            />
            <div className={styles.userName}>{ userData.name }</div>
            <div className={styles.navButtons}>
                {isOwnAccount && <SideBarButton
                    text='Settings'
                    path='settings'
                    icon='cog-solid.svg'
                    type='user-page-left'
                    marginBottom={10}
                />}
                <SideBarButton
                    text='About'
                    path='about'
                    icon='book-open-solid.svg'
                    type='user-page-left'
                />
                <SideBarButton
                    text='Created Posts'
                    path='posts'
                    icon='edit-solid.svg'
                    type='user-page-left'
                />
                <span className={styles.bio}>{userData.bio}</span>
            </div>
        </div>
    )
}

export default UserPageSideBarLeft

{/* <HolonPageSideBarLeftPlaceholder/> */}