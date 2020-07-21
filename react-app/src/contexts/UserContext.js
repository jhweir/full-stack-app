import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const UserContext = createContext()

function UserContextProvider(props) {
    const { accountContextLoading, isLoggedIn, accountData } = useContext(AccountContext)
    const [userContextLoading, setUserContextLoading] = useState(true)
    const [userHandle, setUserHandle] = useState('')
    const [userData, setUserData] = useState({
        Posts: [],
        FollowedHolons: [],
        ModeratedHolons: []
    })
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [createdPosts, setCreatedPosts] = useState([])
    const [isOwnAccount, setIsOwnAccount] = useState(false)

    function getUserData() {
        console.log('UserContext: getUserData')
        setUserContextLoading(true)
        axios.get(config.environmentURL + `/user-data?userHandle=${userHandle}`)
            .then(res => { setUserData(res.data); setUserContextLoading(false) })
    }

    function getCreatedPosts() {
        console.log('UserContext: getCreatedPosts')
        axios
            .get(config.environmentURL + 
            `/created-posts?userId=${userData.id ? userData.id : null}&accountId=${isLoggedIn ? accountData.id : null}`)
            .then(res => { setCreatedPosts(res.data); setUserContextLoading(false) })
    }

    useEffect(() => {
        if (!accountContextLoading) { getUserData() }
    }, [userHandle, accountData])

    useEffect(() => {
        if (isLoggedIn && userData && userData.id === accountData.id) { setIsOwnAccount(true) }
        else { setIsOwnAccount(false) }
    }, [isLoggedIn, userData])

    return (
        <UserContext.Provider value={{
            isOwnAccount,
            userHandle, setUserHandle,
            userData, getUserData,
            selectedUserSubPage, setSelectedUserSubPage,
            createdPosts, getCreatedPosts,
            userContextLoading, setUserContextLoading
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider