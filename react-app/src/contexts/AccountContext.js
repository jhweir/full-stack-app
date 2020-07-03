import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie';

// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNTkzNjMyMzY4LCJleHAiOjE1OTM2MzQxNjh9.crjYhaNXYDGKLNRITHQd_yEcQfvIPlCYbyiVoYMLjvM'

export const AccountContext = createContext()

function AccountContextProvider(props) {
    const [accountData, setAccountData] = useState(null)

    let cookies = new Cookies()

    function updateAccountContext() {
        let accessToken = cookies.get('accessToken')
        console.log('accessToken:', accessToken)
        axios
            // Include JWT in Authorization header
            .create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .get(`/account-data`)
            .then(res => { setAccountData(res.data) })
    }

    function logOut() {
        cookies.remove('accessToken', { path: '/' })
        setAccountData(null)
    }

    useEffect(() => {
        console.log('account context run')
        updateAccountContext()
    }, [])

    return (
        <AccountContext.Provider value={{
            accountData,
            setAccountData,
            updateAccountContext,
            logOut
        }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
