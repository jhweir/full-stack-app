import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie';

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTkzNjMyMzY4LCJleHAiOjE1OTM2MzQxNjh9.crjYhaNXYDGKLNRITHQd_yEcQfvIPlCYbyiVoYMLjvM'

export const UserContext = createContext()

function UserContextProvider(props) {
    const [userData, setUserData] = useState(null)

    let cookies = new Cookies()

    function getUserData() {
        let accessToken = cookies.get('accessToken')
        axios
            // Include JWT in Authorization header
            .create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .get(`/user-data`)
            .then(res => { setUserData(res.data) })
    }

    function logOut() {
        cookies.remove('accessToken')
        setUserData(null)
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <UserContext.Provider value={{
            userData,
            setUserData,
            getUserData,
            logOut
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider