import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { OverlayScrollbarsComponent as ScrollbarOverlay } from 'overlayscrollbars-react'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/SpacePageSidebar.module.scss'
import Column from '@components/Column'
import Row from '@components/Row'
import ImageTitle from '@components/ImageTitle'
import ImageFade from '@components/ImageFade'
// import SpacePageSideBarLeftPlaceholder from './SpacePageSideBarLeftPlaceholder'
import FlagImageHighlights from '@components/FlagImageHighlights'
import FlagImagePlaceholder from '@components/FlagImagePlaceholder'
// import SideBarButton from '@components/SideBarButton'
import { ReactComponent as ArrowUpIconSVG } from '@svgs/arrow-up-solid.svg' // chevron-up-solid.svg'
import { ReactComponent as ArrowDownIconSVG } from '@svgs/arrow-down-solid.svg' // chevron-down-solid.svg'
import { ReactComponent as EyeIconSVG } from '@svgs/eye-solid.svg'
import { ReactComponent as EyeSlashIconSVG } from '@svgs/eye-slash-solid.svg'
import { ReactComponent as PlusIconSVG } from '@svgs/plus.svg'
import { ReactComponent as MinusIconSVG } from '@svgs/minus-solid.svg'
import { isPlural, pluralise } from '@src/Functions'

const SpacePageSidebar = (): JSX.Element => {
    const {
        loggedIn,
        accountData,
        updateAccountData,
        accountDataLoading,
        setImageUploadType,
        setImageUploadModalOpen,
    } = useContext(AccountContext)
    const {
        spaceData,
        setSpaceData,
        isFollowing,
        spaceDataLoading,
        setIsFollowing,
        isModerator,
        selectedSpaceSubPage,
    } = useContext(SpaceContext)
    const {
        HolonUsers: users,
        DirectParentHolons: parentSpaces,
        DirectChildHolons: childSpaces,
        totalUsers,
    } = spaceData

    const loading = accountDataLoading || spaceDataLoading

    const imagePaths = (users || []).map((user) => user.flagImagePath)

    function uploadFlagImage() {
        setImageUploadType('holon-flag-image')
        setImageUploadModalOpen(true)
    }

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
    // console.log('users: ', users && users[0].flagImagePath)

    // if (loading) return <SpacePageSideBarLeftPlaceholder />

    function expandSpace(type, spaceId) {
        const key = `Direct${type}Holons`
        const space = spaceData[key].find((s) => s.id === spaceId)
        const newSpaces = [...spaceData[key]]
        const newSpace = newSpaces.find((s) => s.id === spaceId)

        if (space.expanded) {
            // const newSpaces = [...spaceData[key]]
            // const newSpace = newSpaces.find((s) => s.id === spaceId)
            newSpace.expanded = false
            setSpaceData({
                ...spaceData,
                [key]: newSpaces,
            })
        } else if (space[key]) {
            // const newSpaces = [...spaceData[key]]
            // const newSpace = newSpaces.find((s) => s.id === spaceId)
            newSpace.expanded = true
            setSpaceData({
                ...spaceData,
                [key]: newSpaces,
            })
        } else {
            const filters =
                'timeRange=AllTime&sortBy=Likes&sortOrder=Descending&depth=Only Direct Descendants&offset=0'
            axios
                .get(
                    `${config.apiURL}/space-spaces?accountId=${accountData.id}&spaceId=${spaceId}&${filters}`
                )
                .then((res) => {
                    // const newSpaces = [...spaceData[key]]
                    // const newSpace = newSpaces.find((s) => s.id === spaceId)
                    newSpace[key] = res.data
                    newSpace.expanded = true
                    setSpaceData({
                        ...spaceData,
                        [key]: newSpaces,
                    })
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <Column className={styles.wrapper}>
            <div className={styles.flagImage}>
                <ImageFade imagePath={spaceData.flagImagePath} speed={1000}>
                    <FlagImagePlaceholder type='space' />
                </ImageFade>
                {isModerator && (
                    <button type='button' className={styles.uploadButton} onClick={uploadFlagImage}>
                        Upload new flag image
                    </button>
                )}
            </div>
            <Column className={styles.content}>
                <h1>{spaceData.name}</h1>
                <p className='grey'>{`s/${spaceData.handle}`}</p>
                {/* <p className={styles.description}>{spaceData.description}</p> */}
                <FlagImageHighlights
                    type='user'
                    imagePaths={imagePaths}
                    text={`${totalUsers} ${isPlural(totalUsers) ? 'People' : 'Person'}`}
                    style={{ marginBottom: 20 }}
                    // shadow
                    outline
                />
                {loggedIn && spaceData.handle !== 'all' && (
                    <button className={styles.followButton} type='button' onClick={followSpace}>
                        {isFollowing ? <EyeIconSVG /> : <EyeSlashIconSVG />}
                        <p>{isFollowing ? 'Following' : 'Not Following'}</p>
                    </button>
                )}
                {/* Todo: make space expansion recursive */}
                {parentSpaces.length > 0 && (
                    <Column className={styles.spacesWrapper}>
                        <Row>
                            <ArrowUpIconSVG />
                            <p>Parent spaces</p>
                        </Row>
                        <ScrollbarOverlay
                            className={`${styles.spaces} os-host-flexbox scrollbar-theme`}
                            options={{ className: 'os-theme-none' }}
                        >
                            {parentSpaces.map((space) => (
                                <Column>
                                    <Row centerY style={{ marginBottom: 10 }}>
                                        <ImageTitle
                                            key={space.id}
                                            type='space'
                                            imagePath={space.flagImagePath}
                                            title={space.name}
                                            link={`/s/${space.handle}/${selectedSpaceSubPage}`}
                                            fontSize={14}
                                            imageSize={35}
                                            wrapText
                                        />
                                        <button
                                            className={styles.expandSpaceButton}
                                            type='button'
                                            onClick={() => expandSpace('Parent', space.id)}
                                        >
                                            {space.expanded ? <MinusIconSVG /> : <PlusIconSVG />}
                                        </button>
                                    </Row>
                                    {space.expanded && (
                                        <Column
                                            scroll
                                            className={styles.spaces}
                                            style={{ marginLeft: 15 }}
                                        >
                                            {(space.DirectParentHolons || []).map((s) => (
                                                <Column>
                                                    <Row centerY style={{ marginBottom: 10 }}>
                                                        <ImageTitle
                                                            key={s.id}
                                                            type='space'
                                                            imagePath={s.flagImagePath}
                                                            title={s.name}
                                                            link={`/s/${s.handle}/${selectedSpaceSubPage}`}
                                                            fontSize={14}
                                                            imageSize={30}
                                                            wrapText
                                                        />
                                                        {/* {space.totalChildren > 0 && (
                                                            <button
                                                                className={styles.expandSpaceButton}
                                                                type='button'
                                                                onClick={() =>
                                                                    expandSpace('Parent', s.id)
                                                                }
                                                            >
                                                                {s.expanded ? (
                                                                    <MinusIconSVG />
                                                                ) : (
                                                                    <PlusIconSVG />
                                                                )}
                                                            </button>
                                                        )} */}
                                                    </Row>
                                                </Column>
                                            ))}
                                        </Column>
                                    )}
                                </Column>
                            ))}
                        </ScrollbarOverlay>
                    </Column>
                )}
                {childSpaces.length > 0 && (
                    <Column className={styles.spacesWrapper}>
                        <Row>
                            <ArrowDownIconSVG />
                            <p>Child spaces</p>
                        </Row>
                        <ScrollbarOverlay
                            className={`${styles.spaces} os-host-flexbox scrollbar-theme`}
                            options={{ className: 'os-theme-none' }}
                        >
                            {childSpaces.map((space) => (
                                <Column>
                                    <Row centerY style={{ marginBottom: 10 }}>
                                        <ImageTitle
                                            key={space.id}
                                            type='space'
                                            imagePath={space.flagImagePath}
                                            title={space.name}
                                            link={`/s/${space.handle}/${selectedSpaceSubPage}`}
                                            fontSize={14}
                                            imageSize={35}
                                            wrapText
                                        />
                                        {space.totalChildren > 0 && (
                                            <button
                                                className={styles.expandSpaceButton}
                                                type='button'
                                                onClick={() => expandSpace('Child', space.id)}
                                            >
                                                {space.expanded ? (
                                                    <MinusIconSVG />
                                                ) : (
                                                    <PlusIconSVG />
                                                )}
                                            </button>
                                        )}
                                    </Row>
                                    {space.expanded && (
                                        <Column
                                            scroll
                                            className={styles.spaces}
                                            style={{ marginLeft: 15 }}
                                        >
                                            {(space.DirectChildHolons || []).map((s) => (
                                                <Column>
                                                    <Row centerY style={{ marginBottom: 10 }}>
                                                        <ImageTitle
                                                            key={s.id}
                                                            type='space'
                                                            imagePath={s.flagImagePath}
                                                            title={s.name}
                                                            link={`/s/${s.handle}/${selectedSpaceSubPage}`}
                                                            fontSize={14}
                                                            imageSize={30}
                                                            wrapText
                                                        />
                                                        {/* {space.totalChildren > 0 && (
                                                            <button
                                                                className={styles.expandSpaceButton}
                                                                type='button'
                                                                onClick={() =>
                                                                    expandSpace('Parent', s.id)
                                                                }
                                                            >
                                                                {s.expanded ? (
                                                                    <MinusIconSVG />
                                                                ) : (
                                                                    <PlusIconSVG />
                                                                )}
                                                            </button>
                                                        )} */}
                                                    </Row>
                                                </Column>
                                            ))}
                                        </Column>
                                    )}
                                </Column>
                            ))}
                        </ScrollbarOverlay>
                    </Column>
                )}
            </Column>
            {/* <div className={styles.description}>{spaceData.description}</div> */}
        </Column>
    )
    // }
    // return null // add side bar placeholder here? {/* <SpacePageSideBarLeftPlaceholder/> */}
}

export default SpacePageSidebar

/* {isModerator && (
    <SideBarButton
        icon='cog-solid.svg'
        text='Settings'
        url='settings'
        selected={selectedSpaceSubPage === 'settings'}
        marginBottom={5}
    />
)} */
/* <SideBarButton
    icon='book-open-solid.svg'
    text='About'
    url='about'
    selected={selectedSpaceSubPage === 'about'}
    marginBottom={5}
/> */
/* <SideBarButton
    icon='edit-solid.svg'
    text='Posts'
    url='posts'
    selected={selectedSpaceSubPage === 'posts'}
    marginBottom={5}
    total={spaceData.totalPosts}
/> */
/* <SideBarButton
    icon='overlapping-circles-thick.svg'
    text='Spaces'
    url='spaces'
    selected={selectedSpaceSubPage === 'spaces'}
    marginBottom={5}
    total={spaceData.totalSpaces}
/> */
/* <SideBarButton
        icon='overlapping-circles-thick.svg'
        text='Spaces'
        url='spaces'
        selected={selectedSpaceSubPage === 'spaces'}
        marginBottom={5}
        total={spaceData.total_spaces}
    /> */
/* <SideBarButton
    icon='users-solid.svg'
    text='Users'
    url='users'
    selected={selectedSpaceSubPage === 'users'}
    marginBottom={5}
    total={spaceData.totalUsers}
/> */
/* {spaceData.handle === 'coops' && (
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
)} */
/* {isModerator && (
    <SideBarButton
        icon='cog-solid.svg'
        text='Settings'
        url='settings'
        selected={selectedSpaceSubPage === 'settings'}
        marginBottom={5}
    />
)} */
