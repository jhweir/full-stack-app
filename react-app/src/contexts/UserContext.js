import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const UserContext = createContext()

function UserContextProvider(props) {
    const { isLoggedIn, accountData } = useContext(AccountContext)

    const [userData, setUserData] = useState({
        Posts: [], //change to 'CreatedPosts'?
        FollowedHolons: [],
        ModeratedHolons: []
    })
    const [selectedSubPage, setSelectedSubPage] = useState('')
    const [createdPosts, setCreatedPosts] = useState([])
    const [isOwnAccount, setIsOwnAccount] = useState(false)

    function getUserData(userName) {
        axios
            .get(config.environmentURL + `/user-data?userName=${userName}`)
            .then(res => { setUserData(res.data) })
    }

    function getCreatedPosts() {
        axios
            .get(config.environmentURL + 
            `/created-posts?userId=${userData.id ? userData.id : null}&accountId=${isLoggedIn ? accountData.id : null}`)
            .then(res => { setCreatedPosts(res.data) })
    }

    useEffect(() => {
        if (isLoggedIn && userData && userData.id === accountData.id) { setIsOwnAccount(true) }
        else { setIsOwnAccount(false) }
    }, [isLoggedIn, userData])

    return (
        <UserContext.Provider value={{
            userData,
            getUserData,
            selectedSubPage,
            setSelectedSubPage,
            createdPosts,
            getCreatedPosts,
            isOwnAccount
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider