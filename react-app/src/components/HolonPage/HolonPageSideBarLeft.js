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
    const { isLoggedIn, accountData, getAccountData } = useContext(AccountContext)
    const { getHolonUsers, holonData, getHolonData, isFollowing, setIsFollowing, isModerator, selectedHolonSubPage, getHolonPosts } = useContext(HolonContext)

    function followSpace() {
        if (isFollowing) {
            axios.post(config.apiURL + `/unfollow-space`, { holonId: holonData.id, userId: accountData.id })
                .then(res => {
                    if (res.data === 'success') {
                        setTimeout(() => {
                            getAccountData()
                            getHolonData()
                            getHolonUsers()
                        }, 500)
                    }
                })
                .catch(error => { console.log(error) })} 
        else {
            axios
                .post(config.apiURL + `/follow-space`, { holonId: holonData.id, userId: accountData.id })
                .then(res => {
                    if (res.data === 'success') {
                        setTimeout(() => {
                            getAccountData()
                            getHolonData()
                            getHolonUsers()
                        }, 500)
                    }
                })
                .catch(error => { console.log(error) })
        }
    }

    if (holonData) {
        return (
            <div className={styles.sideBarLeft}>
                <LargeFlagImage
                    size={180}
                    imagePath={holonData.flagImagePath}
                    type='space'
                    canEdit={isModerator}
                    yOffset={-110}
                />
                <div className={styles.name}>{ holonData.name }</div>
                <div className={styles.navButtons}>
                    {/* TODO: replace side bar button component with actual content */}
                    {isLoggedIn && holonData.handle !== 'all' && <SideBarButton
                        icon={isFollowing ? 'eye-solid.svg' : 'eye-slash-solid.svg'}
                        text={isFollowing ? 'Following' : 'Not Following'}
                        onClickFunction={followSpace}
                        marginBottom={5}
                    />}
                    <SideBarButton
                        icon='book-open-solid.svg'
                        text='About'
                        url='about'
                        selected={selectedHolonSubPage === 'about'}
                        marginBottom={5}
                    />
                    <SideBarButton
                        icon='overlapping-circles-thick.svg'
                        text='Spaces'
                        url='spaces'
                        selected={selectedHolonSubPage === 'spaces'}
                        marginBottom={5}
                        total={holonData.total_spaces}
                    />
                    <SideBarButton
                        icon='edit-solid.svg'
                        text='Posts'
                        url='posts'
                        selected={selectedHolonSubPage === 'posts'}
                        marginBottom={5}
                        total={holonData.total_posts}
                        onClickFunction={() => getHolonPosts()}
                    />
                    {/* <SideBarButton
                        icon='overlapping-circles-thick.svg'
                        text='Spaces'
                        url='spaces'
                        selected={selectedHolonSubPage === 'spaces'}
                        marginBottom={5}
                        total={holonData.total_spaces}
                    /> */}
                    {holonData.handle !== 'coops' &&
                        <SideBarButton
                            icon='users-solid.svg'
                            text={holonData.handle === 'all' ? 'Users' : 'Followers'}
                            url='users'
                            selected={selectedHolonSubPage === 'users'}
                            marginBottom={5}
                            total={holonData.total_users}
                        />
                    }
                    {holonData.handle === 'coops' && <>
                        <SideBarButton
                            icon='users-solid.svg'
                            text='Cooperators'
                            url='users'
                            //selected={selectedHolonSubPage === 'users'}
                            marginBottom={5}
                            total={holonData.total_users}
                        />
                    </>}
                    {isModerator && <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedHolonSubPage === 'settings'}
                        marginBottom={5}
                    />}
                </div>
                {/* <div className={styles.description}>{holonData.description}</div> */}
            </div>
        )
    } else { return null } //add side bar placeholder here? {/* <HolonPageSideBarLeftPlaceholder/> */}
}

export default HolonPageSideBarLeft
