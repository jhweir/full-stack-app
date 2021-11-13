import React, { useContext, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { SpaceContext } from '@contexts/SpaceContext'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/pages/UserPage.module.scss'
import CoverImage from '@components/CoverImage'
import UserPageAbout from '@components/UserPage/UserPageAbout'
import UserPageSettings from '@components/UserPage/UserPageSettings'
import UserPageNotifications from '@components/UserPage/UserPageNotifications'
import UserPageMessages from '@components/UserPage/UserPageMessages'
import UserPagePosts from '@components/UserPage/UserPagePosts'
import UserPageSideBarLeft from '@components/UserPage/UserPageSideBarLeft'
import UserPageSideBarRight from '@components/UserPage/UserPageSideBarRight'
import AccountSideBar from '@components/AccountSideBar'
// import AccountSpaces from '@components/AccountSpaces'

const UserPage = ({
    match,
}: {
    match: { url: string; params: { userHandle: string } }
}): JSX.Element => {
    const { url } = match
    const { userHandle } = match.params
    const { fullScreen } = useContext(SpaceContext)
    const { userDataLoading, resetUserContext, userData, getUserData, isOwnAccount } = useContext(
        UserContext
    )

    useEffect(() => {
        if (userData.id) resetUserContext()
        getUserData(userHandle)
    }, [userHandle])

    return (
        <div className={styles.userPage}>
            <CoverImage
                coverImagePath={userData.coverImagePath || null}
                imageUploadType='user-cover-image'
                canEdit={isOwnAccount}
            />
            {userDataLoading && <p>Loading...</p>}
            {!userDataLoading && !userData.id && <p>No user with that handle.</p>}
            {!userDataLoading && userData.id && (
                <div
                    className={`${styles.userPageContainer} ${fullScreen ? styles.fullScreen : ''}`}
                >
                    <UserPageSideBarLeft />
                    <div className={styles.userPageCenterPanel}>
                        <Switch>
                            <Redirect from={`${url}`} to={`${url}/about`} exact />
                            {/* todo: redirect to users about page */}
                            {isOwnAccount && (
                                <Route
                                    path={`${url}/settings`}
                                    component={UserPageSettings}
                                    exact
                                />
                            )}
                            {/* {isOwnAccount && ( */}
                            <Route
                                path={`${url}/notifications`}
                                component={UserPageNotifications}
                                exact
                            />
                            {/* )} */}
                            {isOwnAccount && (
                                <Route
                                    path={`${url}/messages`}
                                    component={UserPageMessages}
                                    exact
                                />
                            )}
                            <Route path={`${url}/about`} component={UserPageAbout} exact />
                            <Route path={`${url}/posts`} component={UserPagePosts} exact />
                        </Switch>
                    </div>
                    <div />
                    {/* <UserPageSideBarRight /> */}
                </div>
            )}
            <AccountSideBar />
        </div>
    )
}

export default UserPage
