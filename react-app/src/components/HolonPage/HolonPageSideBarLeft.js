import React, { useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSideBarLeft.module.scss'
import HolonPageSideBarLeftPlaceholder from './HolonPageSideBarLeftPlaceholder'
import FlagImage from '../FlagImage'
import SideBarButton from '../SideBarButton'

function HolonPageSideBarLeft() {
    const { isLoggedIn, accountData } = useContext(AccountContext)
    const { getHolonUsers, holonData, isFollowing, setIsFollowing, isModerator } = useContext(HolonContext)

    function followSpace() {
        if (isFollowing) {
            setIsFollowing(false)
            axios.put(config.environmentURL + `/unfollowHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(setTimeout(() => { getHolonUsers() }, 200))
                .catch(error => { console.log(error) })} 
        else { setIsFollowing(true)
            axios.post(config.environmentURL + `/followHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(setTimeout(() => { getHolonUsers() }, 200))
                .catch(error => { console.log(error) })
        }
    }

    if (holonData) { return (
        <div className={styles.sideBarLeft}>
            <FlagImage
                flagImagePath={holonData.flagImagePath}
                imageUploadType='holon-flag-image'
                canEdit={isModerator}
            />
            <div className={styles.name}>{ holonData.name }</div>
            <div className={styles.navButtons}>
                {isModerator && <SideBarButton
                    text='Moderator'
                    icon='crown-solid.svg'
                    marginBottom={10}
                />}
                {isLoggedIn && holonData.handle !== 'all' && <SideBarButton
                    text={isFollowing ? 'Following' : 'Not Following'}
                    icon={isFollowing ? 'eye-solid.svg' : 'eye-slash-solid.svg'}
                    marginBottom={10}
                    onClickFunction={followSpace}
                />}
                <SideBarButton
                    text='About'
                    path='about'
                    icon='book-open-solid.svg'
                    type='holon-page-left'
                />
                <SideBarButton
                    text='Posts'
                    path='posts'
                    icon='edit-solid.svg'
                    type='holon-page-left'
                />
                <SideBarButton
                    text='Spaces'
                    path='spaces'
                    icon='overlapping-circles-thick.svg'
                    type='holon-page-left'
                />
                <SideBarButton
                    text={holonData.handle === 'all' ? 'Users' : 'Followers'}
                    path='users'
                    icon='users-solid.svg'
                    type='holon-page-left'
                />
            </div>
            <div className={styles.description}>{holonData.description}</div>
        </div>
    )} else { return null } //add side bar placeholder here? {/* <HolonPageSideBarLeftPlaceholder/> */}
}

export default HolonPageSideBarLeft
