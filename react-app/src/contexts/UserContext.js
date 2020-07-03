import React, { createContext, useState } from 'react'
import axios from 'axios'
import config from '../Config'
export const UserContext = createContext()

function UserContextProvider(props) {
    const [userData, setUserData] = useState({})

    function updateUserContext(userName) {
        axios
            .get(config.environmentURL + `/user-data?userName=${userName}`)
            .then(res => { setUserData(res.data) })
    }

    return (
        <UserContext.Provider value={{
            userData,
            updateUserContext
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider