import React, { useContext, useEffect } from 'react'
import { Route, Switch, Redirect, useLocation, Link } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/pages/SpacePage.module.scss'
import Column from '@components/Column'
import Row from '@components/Row'
import SpacePageSidebar from '@components/SpacePage/SpacePageSidebar'
import CoverImage from '@components/CoverImage'
import PageTabs from '@components/PageTabs'
import SpacePageSettings from '@components/SpacePage/SpacePageSettings'
import SpacePageAbout from '@components/SpacePage/SpacePageAbout'
import SpacePagePosts from '@components/SpacePage/SpacePagePosts'
import SpacePageSpaces from '@components/SpacePage/SpacePageSpaces'
import SpacePagePeople from '@components/SpacePage/SpacePagePeople'
import SpacePageCalendar from '@components/SpacePage/SpacePageCalendar'
import SpacePageRooms from '@components/SpacePage/SpacePageRooms'
import SpacePageGovernance from '@components/SpacePage/SpacePageGovernance'
import { ReactComponent as SettingsIconSVG } from '@svgs/cog-solid.svg'
// import SpacePageSideBarLeft from '@components/SpacePage/SpacePageSideBarLeft'
// import SpacePageSideBarRight from '@components/SpacePage/SpacePageSideBarRight'
// import SidebarSmall from '@components/SidebarSmall'
// import FlagImage from '@components/FlagImage'
// import EmptyPage from './EmptyPage'

const SpacePage = ({ match }: { match: { url: string } }): JSX.Element => {
    const { url } = match
    const { loggedIn, accountData } = useContext(AccountContext)
    const { spaceData, spaceSpacesFilters, resetSpaceData, isModerator, fullScreen } = useContext(
        SpaceContext
    )
    const location = useLocation()
    const subpage = location.pathname.split('/')[3]
    const tabs = {
        baseRoute: `/s/${spaceData.handle}`,
        left: [
            { text: 'About', visible: true, selected: subpage === 'about' },
            { text: 'Posts', visible: true, selected: subpage === 'posts' },
            { text: 'Spaces', visible: true, selected: subpage === 'spaces' },
            { text: 'People', visible: true, selected: subpage === 'people' },
            { text: 'Calendar', visible: true, selected: subpage === 'calendar' },
            { text: 'Rooms', visible: true, selected: subpage === 'rooms' },
            { text: 'Governance', visible: true, selected: subpage === 'governance' },
        ],
        right: [
            {
                text: 'Settings',
                visible: isModerator,
                selected: subpage === 'settings',
                icon: <SettingsIconSVG />,
            },
        ],
    }

    useEffect(() => () => resetSpaceData(), [])

    return (
        <Row className={styles.wrapper}>
            <SpacePageSidebar />
            <Column className={styles.content}>
                <div className={styles.sticky}>
                    <CoverImage
                        coverImagePath={spaceData.coverImagePath}
                        imageUploadType='holon-cover-image'
                        canEdit={isModerator}
                    />
                    <PageTabs tabs={tabs} />
                </div>
                <Column className={styles.centerPanel}>
                    <Switch>
                        <Redirect from={url} to={`${url}/posts`} exact />
                        <Route path='/s/:spaceHandle/about' component={SpacePageAbout} exact />
                        <Route path='/s/:spaceHandle/posts' component={SpacePagePosts} exact />
                        <Route path='/s/:spaceHandle/spaces' component={SpacePageSpaces} exact />
                        <Route path='/s/:spaceHandle/people' component={SpacePagePeople} exact />
                        <Route
                            path='/s/:spaceHandle/calendar'
                            component={SpacePageCalendar}
                            exact
                        />
                        <Route path='/s/:spaceHandle/rooms' component={SpacePageRooms} exact />
                        <Route
                            path='/s/:spaceHandle/governance'
                            component={SpacePageGovernance}
                            exact
                        />
                        <Route
                            path='/s/:spaceHandle/settings'
                            component={SpacePageSettings}
                            exact
                        />
                        {/* Todo: conditionally display private pages or auto redirect to public posts */}
                        {/* like on user notifications page: if (!isOwnAccount) history.push(`/u/${userData.handle}/about`) */}
                        {/* <Route component={ EmptyPage }/> TODO: Check if this needs to be doubled up on the App.js component */}
                    </Switch>
                </Column>
            </Column>
        </Row>
    )
}

export default SpacePage

/* <div className={`${styles.SpacePage} ${showAccountSideBar && styles.showAccountSideBar}`}>
    <CoverImage
        coverImagePath={spaceData.coverImagePath}
        imageUploadType='holon-cover-image'
        canEdit={isModerator}
    />
    <div className={`${styles.SpacePageContent} ${fullScreen && styles.fullScreen}`}>
        <SpacePageSideBarLeft />
        <div className={styles.SpacePageCenterPanel}>
            <Switch>
                <Redirect from={url} to={`${url}/posts`} exact />
                <Route
                    path='/s/:spaceHandle/settings'
                    component={SpacePageSettings}
                    exact
                />
                <Route path='/s/:spaceHandle/about' component={SpacePageAbout} exact />
                <Route path='/s/:spaceHandle/posts' component={SpacePagePosts} exact />
                <Route path='/s/:spaceHandle/spaces' component={SpacePageSpaces} exact />
                <Route path='/s/:spaceHandle/users' component={SpacePagePeople} exact />
                <Route component={ EmptyPage }/>
            </Switch>
        </div>
        {!(subpage === 'spaces' && spaceSpacesFilters.view === 'Map') && (
            <SpacePageSideBarRight />
        )}
    </div>
    <AccountSideBar />
</div> */
