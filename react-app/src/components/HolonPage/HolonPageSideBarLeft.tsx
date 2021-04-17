import React, { useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPageSideBarLeft.module.scss'
// import HolonPageSideBarLeftPlaceholder from './HolonPageSideBarLeftPlaceholder'
import LargeFlagImage from '../LargeFlagImage'
import SideBarButton from '../SideBarButton'

const HolonPageSideBarLeft = (): JSX.Element => {
    const { isLoggedIn, accountData, getAccountData } = useContext(AccountContext)
    const {
        getSpaceUsers,
        spaceData,
        getSpaceData,
        isFollowing,
        // setIsFollowing,
        isModerator,
        selectedSpaceSubPage,
        getSpacePosts,
    } = useContext(SpaceContext)

    function followSpace() {
        if (isFollowing) {
            axios
                .post(`${config.apiURL}/unfollow-space`, {
                    holonId: spaceData.id,
                    userId: accountData.id,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setTimeout(() => {
                            getAccountData()
                            getSpaceData()
                            getSpaceUsers()
                        }, 500)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            axios
                .post(`${config.apiURL}/follow-space`, {
                    holonId: spaceData.id,
                    userId: accountData.id,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setTimeout(() => {
                            getAccountData()
                            getSpaceData()
                            getSpaceUsers()
                        }, 500)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    // if (spaceData) {
    return (
        <div className={styles.sideBarLeft}>
            <LargeFlagImage
                size={180}
                imagePath={spaceData.flagImagePath}
                type='space'
                canEdit={isModerator}
                yOffset={-110}
            />
            <div className={styles.name}>{spaceData.name}</div>
            <div className={styles.navButtons}>
                {/* TODO: replace side bar button component with actual content */}
                {isLoggedIn && spaceData.handle !== 'all' && (
                    <SideBarButton
                        icon={isFollowing ? 'eye-solid.svg' : 'eye-slash-solid.svg'}
                        text={isFollowing ? 'Following' : 'Not Following'}
                        onClickFunction={followSpace}
                        marginBottom={5}
                    />
                )}
                <SideBarButton
                    icon='book-open-solid.svg'
                    text='About'
                    url='about'
                    selected={selectedSpaceSubPage === 'about'}
                    marginBottom={5}
                />
                <SideBarButton
                    icon='overlapping-circles-thick.svg'
                    text='Spaces'
                    url='spaces'
                    selected={selectedSpaceSubPage === 'spaces'}
                    marginBottom={5}
                    total={spaceData.total_spaces}
                />
                <SideBarButton
                    icon='edit-solid.svg'
                    text='Posts'
                    url='posts'
                    selected={selectedSpaceSubPage === 'posts'}
                    marginBottom={5}
                    total={spaceData.total_posts}
                    onClickFunction={() => getSpacePosts()}
                />
                {/* <SideBarButton
                        icon='overlapping-circles-thick.svg'
                        text='Spaces'
                        url='spaces'
                        selected={selectedSpaceSubPage === 'spaces'}
                        marginBottom={5}
                        total={spaceData.total_spaces}
                    /> */}
                {spaceData.handle !== 'coops' && (
                    <SideBarButton
                        icon='users-solid.svg'
                        text={spaceData.handle === 'all' ? 'Users' : 'Followers'}
                        url='users'
                        selected={selectedSpaceSubPage === 'users'}
                        marginBottom={5}
                        total={spaceData.total_users}
                    />
                )}
                {spaceData.handle === 'coops' && (
                    <>
                        <SideBarButton
                            icon='users-solid.svg'
                            text='Cooperators'
                            url='users'
                            // selected={selectedSpaceSubPage === 'users'}
                            marginBottom={5}
                            total={spaceData.total_users}
                        />
                    </>
                )}
                {isModerator && (
                    <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedSpaceSubPage === 'settings'}
                        marginBottom={5}
                    />
                )}
            </div>
            {/* <div className={styles.description}>{spaceData.description}</div> */}
        </div>
    )
    // }
    // return null // add side bar placeholder here? {/* <HolonPageSideBarLeftPlaceholder/> */}
}

export default HolonPageSideBarLeft
