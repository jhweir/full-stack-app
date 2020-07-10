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
    const { accountData, updateAccountContext } = useContext(AccountContext)
    const { userData, updateUserContext, selectedSubPage, setSelectedSubPage } = useContext(UserContext)
    const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false)
    // const [selectedSubPage, setSelectedSubPage] = useState('')


    useEffect(() => {
        //updateAccountContext()
        updateUserContext(userName)
    }, [])

    let userFound = userData != null
    let isOwnAccount = userData && accountData && userData.id === accountData.id

    return (
        <div className={styles.userPage}>
            <div className={styles.coverImageWrapper}>
                <div className={styles.coverImage}/>
            </div>
            {!userFound && <span style={{padding: 20}}>No user with that name!</span>}
            {userFound &&
                <div className={styles.userPageContainer}>
                    <UserPageSideBarLeft 
                        isOwnAccount={isOwnAccount}
                        setImageUploadModalOpen={setImageUploadModalOpen}
                        selectedSubPage={selectedSubPage}
                        setSelectedSubPage={setSelectedSubPage}
                    />
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
            {imageUploadModalOpen &&
                <ImageUploadModal setImageUploadModalOpen={setImageUploadModalOpen}/>
            }
        </div>
    )
}

export default UserPage