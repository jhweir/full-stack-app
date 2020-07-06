import React, { createContext, useState } from 'react'
import axios from 'axios'
import config from '../Config'
export const UserContext = createContext()

function UserContextProvider(props) {
    const [userData, setUserData] = useState([])
    const [selectedSubPage, setSelectedSubPage] = useState('')
    const [createdPosts, setCreatedPosts] = useState([])

    function updateUserContext(userName) {
        axios
            .get(config.environmentURL + `/user-data?userName=${userName}`)
            .then(res => { setUserData(res.data) })
    }

    function getCreatedPosts() {
        axios
            .get(config.environmentURL + `/created-posts?id=${userData.id}`)
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