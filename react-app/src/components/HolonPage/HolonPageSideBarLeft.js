import React, { useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSideBarLeft.module.scss'
import HolonPageSideBarLeftPlaceholder from './HolonPageSideBarLeftPlaceholder'
import LargeFlagImage from '../LargeFlagImage'
import SideBarButton from '../SideBarButton'

function HolonPageSideBarLeft() {
    const { isLoggedIn, accountData } = useContext(AccountContext)
    const { getHolonUsers, holonData, isFollowing, setIsFollowing, isModerator, selectedHolonSubPage } = useContext(HolonContext)

    function followSpace() {
        if (isFollowing) {
            setIsFollowing(false)
            axios.put(config.environmentURL + `/unfollowHolon`, { holonId: holonData.id, userId: accountData.id })
                // TODO: remove setTime out and wait for response
                .then(setTimeout(() => { getHolonUsers() }, 200))
                .catch(error => { console.log(error) })} 
        else {
            setIsFollowing(true)
            axios.post(config.environmentURL + `/followHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(setTimeout(() => { getHolonUsers() }, 200))
                .catch(error => { console.log(error) })
        }
    }

    if (holonData) {
        return (
            <div className={styles.sideBarLeft}>
                <LargeFlagImage
                    size={150}
                    imagePath={holonData.flagImagePath}
                    canEdit={isModerator}
                    imageUploadType='holon-flag-image'
                />
                <div className={styles.name}>{ holonData.name }</div>
                <div className={styles.navButtons}>
                    {isModerator && <SideBarButton
                        icon='crown-solid.svg'
                        text='Moderator'
                        marginBottom={10}
                    />}
                    {isLoggedIn && holonData.handle !== 'all' && <SideBarButton
                        icon={isFollowing ? 'eye-solid.svg' : 'eye-slash-solid.svg'}
                        text={isFollowing ? 'Following' : 'Not Following'}
                        onClickFunction={followSpace}
                        marginBottom={10}
                    />}
                    {isModerator && <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedHolonSubPage === 'settings'}
                        // marginBottom={10}
                    />}
                    <SideBarButton
                        icon='book-open-solid.svg'
                        text='About'
                        url='about'
                        selected={selectedHolonSubPage === 'about'}
                    />
                    <SideBarButton
                        icon='edit-solid.svg'
                        text='Posts'
                        url='posts'
                        selected={selectedHolonSubPage === 'posts'}
                    />
                    <SideBarButton
                        icon='overlapping-circles-thick.svg'
                        text='Spaces'
                        url='spaces'
                        selected={selectedHolonSubPage === 'spaces'}
                    />
                    <SideBarButton
                        icon='users-solid.svg'
                        text={holonData.handle === 'all' ? 'Users' : 'Followers'}
                        url='users'
                        selected={selectedHolonSubPage === 'users'}
                    />
                </div>
                <div className={styles.description}>{holonData.description}</div>
            </div>
        )
    } else { return null } //add side bar placeholder here? {/* <HolonPageSideBarLeftPlaceholder/> */}
}

export default HolonPageSideBarLeft
