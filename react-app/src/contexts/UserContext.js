import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const UserContext = createContext()

function UserContextProvider(props) {
    const { accountData } = useContext(AccountContext)

    const [userData, setUserData] = useState({
        Posts: [], //change to 'CreatedPosts'
        FollowedHolons: [],
        ModeratedHolons: []
    })
    const [selectedSubPage, setSelectedSubPage] = useState('')
    const [createdPosts, setCreatedPosts] = useState([])

    function updateUserContext(userName) {
        axios
            .get(config.environmentURL + `/user-data?userName=${userName}`)
            .then(res => { setUserData(res.data) })
    }

    function getCreatedPosts() {
        axios
            .get(config.environmentURL + `/created-posts?accountId=${accountData ? accountData.id : null}&userId=${userData ? userData.id : null}`)
            .then(res => { setCreatedPosts(res.data) })
    }

    return (
        <UserContext.Provider value={{
            userData,
            updateUserContext,
            selectedSubPage,
            setSelectedSubPage,
            createdPosts,
            getCreatedPosts
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider