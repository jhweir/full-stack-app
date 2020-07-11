import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import { UserContext } from '../contexts/UserContext'
import { Route, Switch, Redirect } from "react-router-dom"
import styles from '../styles/pages/UserPage.module.scss'
import UserPageAbout from '../components/UserPageAbout'
import UserPageSettings from '../components/UserPageSettings'
import UserPageCreatedPosts from '../components/UserPageCreatedPosts'
import UserPageSideBarLeft from '../components/UserPageSideBarLeft'
import ImageUploadModal from '../components/ImageUploadModal'
import UserPageSideBarRight from '../components/UserPageSideBarRight'

function UserPage({ match }) {
    // update userName to userHandle?
    const { userName } = match.params
    const { setImageUploadType, imageUploadModalOpen, setImageUploadModalOpen } = useContext(AccountContext)
    const { userData, getUserData, selectedSubPage, setSelectedSubPage, isOwnAccount } = useContext(UserContext)

    useEffect(() => {
        getUserData(userName)
    }, [])

    return (
        <div className={styles.userPage}>
            {/* TODO: create cover image component */}
            {userData.coverImagePath === null
                ? <div className={styles.coverImagePlaceholder}/>
                : <img className={styles.coverImage} src={userData.coverImagePath}/>
            }
            {isOwnAccount &&
                <div 
                    className={styles.coverImageUploadButton}
                    onClick={() => { setImageUploadType('user-cover-image'); setImageUploadModalOpen(true) }}>
                    Upload new image
                </div>
            }
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