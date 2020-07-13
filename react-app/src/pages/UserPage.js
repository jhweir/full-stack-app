import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import { UserContext } from '../contexts/UserContext'
import { Route, Switch, Redirect } from "react-router-dom"
import styles from '../styles/pages/UserPage.module.scss'
import CoverImage from '../components/CoverImage'
import UserPageAbout from '../components/UserPage/UserPageAbout'
import UserPageSettings from '../components/UserPage/UserPageSettings'
import UserPageCreatedPosts from '../components/UserPage/UserPageCreatedPosts'
import UserPageSideBarLeft from '../components/UserPage/UserPageSideBarLeft'
import UserPageSideBarRight from '../components/UserPage/UserPageSideBarRight'

function UserPage({ match }) {
    // update userName to userHandle?
    const { userName } = match.params
    const { accountContextLoading, setImageUploadType, imageUploadModalOpen, setImageUploadModalOpen } = useContext(AccountContext)
    const { userData, setUserName, getUserData, selectedUserSubPage, setSelectedUserSubPage, isOwnAccount } = useContext(UserContext)

    useEffect(() => {
        if (!accountContextLoading) { setUserName(userName) }
    }, [accountContextLoading])

    // useEffect(() => {
    //     getUserData(userName)
    // }, [])

    return (
        <div className={styles.userPage}>
            <CoverImage type='user'/>
            {!userData && <span style={{padding: 20}}>No user with that name!</span>}
            {userData &&
                <div className={styles.userPageContainer}>
                    <UserPageSideBarLeft/>
                    <div className={styles.userPageCenterPanel}>
                        <Switch>
                            {isOwnAccount && <Route path={`${match.url}/settings`} component={ UserPageSettings } exact/>}
                            <Redirect from={`${match.url}`} to={`${match.url}/about`} exact/>
                            <Route path={`${match.url}/about`} component={ UserPageAbout } exact/>
                            <Route path={`${match.url}/created-posts`} component={ UserPageCreatedPosts } exact/>
                        </Switch>
                    </div>
                    <UserPageSideBarRight/>
                </div>
            }
        </div>
    )
}

export default UserPage