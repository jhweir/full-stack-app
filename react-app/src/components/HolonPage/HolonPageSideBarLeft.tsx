import React, { useContext } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPageSideBarLeft.module.scss'
// import HolonPageSideBarLeftPlaceholder from './HolonPageSideBarLeftPlaceholder'
import FlagImage from '../FlagImage'
import SideBarButton from '../SideBarButton'

const HolonPageSideBarLeft = (): JSX.Element => {
    const { loggedIn, accountData, updateAccountData, accountDataLoading } = useContext(
        AccountContext
    )
    const {
        spaceData,
        isFollowing,
        spaceDataLoading,
        setIsFollowing,
        isModerator,
        selectedSpaceSubPage,
    } = useContext(SpaceContext)

    const loading = accountDataLoading || spaceDataLoading

    function followSpace() {
        // todo: merge into single request
        if (isFollowing) {
            axios
                .post(`${config.apiURL}/unfollow-space`, {
                    holonId: spaceData.id,
                    userId: accountData.id,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setIsFollowing(false)
                        updateAccountData(
                            'FollowedHolons',
                            accountData.FollowedHolons.filter((h) => h.handle !== spaceData.handle)
                        )
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
                        setIsFollowing(true)
                        const newFollowedSpaces = [...accountData.FollowedHolons]
                        newFollowedSpaces.push({
                            handle: spaceData.handle,
                            name: spaceData.name,
                            flagImagePath: spaceData.flagImagePath,
                        })
                        updateAccountData('FollowedHolons', newFollowedSpaces)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    // if (loading) return <HolonPageSideBarLeftPlaceholder />
    return (
        <div className={styles.sideBarLeft}>
            <div className={styles.flagImageWrapper}>
                <FlagImage
                    size={180}
                    type='space'
                    imagePath={spaceData.flagImagePath}
                    canEdit={loading ? false : isModerator}
                    outline
                    shadow
                    fade
                />
            </div>
            <div className={styles.name}>{spaceData.name}</div>
            <div className={styles.navButtons}>
                {/* TODO: replace side bar button component with actual content */}
                {loggedIn && spaceData.handle !== 'all' && (
                    <SideBarButton
                        icon={isFollowing ? 'eye-solid.svg' : 'eye-slash-solid.svg'}
                        text={isFollowing ? 'Following' : 'Not Following'}
                        onClickFunction={followSpace}
                        marginBottom={5}
                    />
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
                <SideBarButton
                    icon='book-open-solid.svg'
                    text='About'
                    url='about'
                    selected={selectedSpaceSubPage === 'about'}
                    marginBottom={5}
                />
                <SideBarButton
                    icon='edit-solid.svg'
                    text='Posts'
                    url='posts'
                    selected={selectedSpaceSubPage === 'posts'}
                    marginBottom={5}
                    total={spaceData.total_posts}
                />
                <SideBarButton
                    icon='overlapping-circles-thick.svg'
                    text='Spaces'
                    url='spaces'
                    selected={selectedSpaceSubPage === 'spaces'}
                    marginBottom={5}
                    total={spaceData.total_spaces}
                />
                {/* <SideBarButton
                        icon='overlapping-circles-thick.svg'
                        text='Spaces'
                        url='spaces'
                        selected={selectedSpaceSubPage === 'spaces'}
                        marginBottom={5}
                        total={spaceData.total_spaces}
                    /> */}
                <SideBarButton
                    icon='users-solid.svg'
                    text='Users'
                    url='users'
                    selected={selectedSpaceSubPage === 'users'}
                    marginBottom={5}
                    total={spaceData.total_users}
                />
                {/* {spaceData.handle === 'coops' && (
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
                )} */}
                {/* {isModerator && (
                    <SideBarButton
                        icon='cog-solid.svg'
                        text='Settings'
                        url='settings'
                        selected={selectedSpaceSubPage === 'settings'}
                        marginBottom={5}
                    />
                )} */}
            </div>
            {/* <div className={styles.description}>{spaceData.description}</div> */}
        </div>
    )
    // }
    // return null // add side bar placeholder here? {/* <HolonPageSideBarLeftPlaceholder/> */}
}

export default HolonPageSideBarLeft
