import React, { useContext, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/pages/HolonPage.module.scss'
import CoverImage from '../components/CoverImage'
import HolonPageSettings from '../components/HolonPage/HolonPageSettings'
import HolonPageAbout from '../components/HolonPage/HolonPageAbout'
import HolonPagePosts from '../components/HolonPage/HolonPagePosts'
import HolonPageSpaces from '../components/HolonPage/HolonPageSpaces'
import HolonPageUsers from '../components/HolonPage/HolonPageUsers'
import HolonPageSideBarLeft from '../components/HolonPage/HolonPageSideBarLeft'
import HolonPageSideBarRight from '../components/HolonPage/HolonPageSideBarRight'
// import EmptyPage from './EmptyPage'

const HolonPage = ({
    match,
}: {
    match: { url: string; params: { holonHandle: string } }
}): JSX.Element => {
    const { url, params } = match
    const { holonHandle } = params
    const { accountContextLoading } = useContext(AccountContext)
    const { setHolonHandle, holonData, isModerator, fullScreen } = useContext(
        HolonContext
    )

    useEffect(() => {
        if (!accountContextLoading) {
            setHolonHandle(holonHandle)
        }
    }, [accountContextLoading, holonHandle, setHolonHandle])

    return (
        <div className={styles.holonPage}>
            <CoverImage
                coverImagePath={holonData ? holonData.coverImagePath : null}
                imageUploadType='holon-cover-image'
                canEdit={isModerator}
            />
            <div
                className={`${styles.holonPageContent} ${
                    fullScreen ? styles.fullScreen : ''
                }`}
            >
                <HolonPageSideBarLeft />
                <div className={styles.holonPageCenterPanel}>
                    <Switch>
                        <Redirect from={url} to={`${url}/posts`} exact />
                        {isModerator && (
                            <Route
                                path={`${url}/settings`}
                                component={HolonPageSettings}
                                exact
                            />
                        )}
                        <Route
                            path={`${url}/about`}
                            component={HolonPageAbout}
                            exact
                        />
                        <Route
                            path={`${url}/posts`}
                            component={HolonPagePosts}
                            exact
                        />
                        <Route
                            path={`${url}/spaces`}
                            component={HolonPageSpaces}
                            exact
                        />
                        <Route
                            path={`${url}/users`}
                            component={HolonPageUsers}
                            exact
                        />
                        {/* <Route component={ EmptyPage }/> TODO: Check if this needs to be doubled up on the App.js component */}
                    </Switch>
                </div>
                <HolonPageSideBarRight />
            </div>
        </div>
    )
}

export default HolonPage
