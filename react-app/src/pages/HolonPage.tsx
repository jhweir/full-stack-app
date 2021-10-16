import React, { useContext, useEffect } from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/pages/HolonPage.module.scss'
import CoverImage from '@components/CoverImage'
import HolonPageSettings from '@components/HolonPage/HolonPageSettings'
import HolonPageAbout from '@components/HolonPage/HolonPageAbout'
import HolonPagePosts from '@components/HolonPage/HolonPagePosts'
import HolonPageSpaces from '@components/HolonPage/HolonPageSpaces'
import HolonPageUsers from '@components/HolonPage/HolonPageUsers'
import HolonPageSideBarLeft from '@components/HolonPage/HolonPageSideBarLeft'
import HolonPageSideBarRight from '@components/HolonPage/HolonPageSideBarRight'
import AccountSideBar from '@components/AccountSideBar'
// import EmptyPage from './EmptyPage'

const HolonPage = ({ match }: { match: { url: string } }): JSX.Element => {
    const { url } = match
    const { isLoggedIn, accountData } = useContext(AccountContext)
    const { spaceData, spaceSpacesFilters, resetSpaceData, isModerator, fullScreen } = useContext(
        SpaceContext
    )
    const location = useLocation()
    const subpage = location.pathname.split('/')[3]

    useEffect(() => () => resetSpaceData(), [])

    const showAccountSideBar = isLoggedIn && accountData.FollowedHolons.length

    return (
        <div className={`${styles.holonPage} ${showAccountSideBar && styles.showAccountSideBar}`}>
            <CoverImage
                coverImagePath={spaceData.coverImagePath}
                imageUploadType='holon-cover-image'
                canEdit={isModerator}
            />
            <div className={`${styles.holonPageContent} ${fullScreen && styles.fullScreen}`}>
                <HolonPageSideBarLeft />
                <div className={styles.holonPageCenterPanel}>
                    <Switch>
                        <Redirect from={url} to={`${url}/posts`} exact />
                        <Route
                            path='/s/:spaceHandle/settings'
                            component={HolonPageSettings}
                            exact
                        />
                        <Route path='/s/:spaceHandle/about' component={HolonPageAbout} exact />
                        <Route path='/s/:spaceHandle/posts' component={HolonPagePosts} exact />
                        <Route path='/s/:spaceHandle/spaces' component={HolonPageSpaces} exact />
                        <Route path='/s/:spaceHandle/users' component={HolonPageUsers} exact />
                        {/* <Route component={ EmptyPage }/> TODO: Check if this needs to be doubled up on the App.js component */}
                    </Switch>
                </div>
                {!(subpage === 'spaces' && spaceSpacesFilters.view === 'Map') && (
                    <HolonPageSideBarRight />
                )}
            </div>
            <AccountSideBar />
        </div>
    )
}

export default HolonPage
