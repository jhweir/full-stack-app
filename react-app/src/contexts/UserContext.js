import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const UserContext = createContext()

function UserContextProvider(props) {
    const { accountContextLoading, isLoggedIn, accountData } = useContext(AccountContext)
    const [userContextLoading, setUserContextLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [userData, setUserData] = useState({
        Posts: [], //change to 'CreatedPosts'?
        FollowedHolons: [],
        ModeratedHolons: []
    })
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [createdPosts, setCreatedPosts] = useState([])
    const [isOwnAccount, setIsOwnAccount] = useState(false)

    function getUserData() {
        console.log('UserContext: getUserData')
        setUserContextLoading(true)
        axios.get(config.environmentURL + `/user-data?userName=${userName}`)
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
        // when userName recieved from UserPage, getUserData
        if (!accountContextLoading) { getUserData() }
    }, [userName])

    useEffect(() => {
        if (isLoggedIn && userData && userData.id === accountData.id) { setIsOwnAccount(true) }
        else { setIsOwnAccount(false) }
    }, [isLoggedIn, userData])

    return (
        <UserContext.Provider value={{
            isOwnAccount,
            userName, setUserName,
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