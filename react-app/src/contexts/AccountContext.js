import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie';

export const AccountContext = createContext()

function AccountContextProvider(props) {
    const [accountData, setAccountData] = useState(null)
    const [alertModalOpen, setAlertModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [userControlsModalOpen, setUserControlsModalOpen] = useState(false)

    let cookies = new Cookies()

    function updateAccountContext() {
        let accessToken = cookies.get('accessToken')
        console.log('accessToken:', accessToken)
        axios
            // Create new axios instance with JWT in authorization header
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
            logOut,
            authModalOpen,
            setAuthModalOpen,
            userControlsModalOpen,
            setUserControlsModalOpen,
            alertMessage,
            setAlertMessage,
            alertModalOpen,
            setAlertModalOpen
        }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
