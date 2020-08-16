import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import { UserContext } from '../contexts/UserContext'
import { Route, Switch, Redirect } from "react-router-dom"
import styles from '../styles/pages/UserPage.module.scss'
import CoverImage from '../components/CoverImage'
import UserPageAbout from '../components/UserPage/UserPageAbout'
import UserPageSettings from '../components/UserPage/UserPageSettings'
import UserPagePosts from '../components/UserPage/UserPagePosts'
import UserPageSideBarLeft from '../components/UserPage/UserPageSideBarLeft'
import UserPageSideBarRight from '../components/UserPage/UserPageSideBarRight'

function UserPage({ match }) {
    const { url } = match
    const { userHandle } = match.params
    const { accountContextLoading } = useContext(AccountContext)
    const { userData, setUserHandle, isOwnAccount } = useContext(UserContext)

    useEffect(() => {
        if (!accountContextLoading) { setUserHandle(userHandle) }
    }, [accountContextLoading])

    return (
        <div className={styles.userPage}>
            <CoverImage
                coverImagePath={userData ? userData.coverImagePath : null}
                imageUploadType='user-cover-image'
                canEdit={isOwnAccount}
            />
            {!userData && <span style={{padding: 20}}>No user with that name!</span>}
            {userData &&
                <div className={styles.userPageContainer}>
                    <UserPageSideBarLeft/>
                    <div className={styles.userPageCenterPanel}>
                        <Switch>
                            {isOwnAccount && <Route path={`${url}/settings`} component={ UserPageSettings } exact/>}
                            <Redirect from={`${url}`} to={`${url}/about`} exact/>
                            <Route path={`${url}/about`} component={ UserPageAbout } exact/>
                            <Route path={`${url}/posts`} component={ UserPagePosts } exact/>
                        </Switch>
                    </div>
                    <UserPageSideBarRight/>
                </div>
            }
        </div>
    )
}

export default UserPage