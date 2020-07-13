import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie'

export const AccountContext = createContext()

function AccountContextProvider(props) {
    const [accountContextLoading, setAccountContextLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [accountData, setAccountData] = useState({
        FollowedHolons: [],
        ModeratedHolons: []
    })
    const [alertModalOpen, setAlertModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [userControlsModalOpen, setUserControlsModalOpen] = useState(false)
    const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
    const [createHolonModalOpen, setCreateHolonModalOpen] = useState(false)
    const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false)
    const [imageUploadType, setImageUploadType] = useState('')

    let cookies = new Cookies()

    function getAccountData() {
        let accessToken = cookies.get('accessToken')
        //console.log('accessToken:', accessToken)
        if (accessToken === undefined) { setAccountContextLoading(false) }
        if (accessToken !== undefined) {
            // Create new axios instance with JWT in authorization header
            axios.create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .get(`/account-data`)
            .then(res => {
                if (res.data !== 'Invalid token') { setAccountData(res.data); setIsLoggedIn(true) }
                setAccountContextLoading(false)
            })
        }
    }

    function logOut() {
        cookies.remove('accessToken', { path: '/' })
        setAccountData({        
            FollowedHolons: [],
            ModeratedHolons: []
        })
        setIsLoggedIn(false)
    }

    useEffect(() => {
        getAccountData()
        console.log('account context updated')
    }, [])

    return (
        <AccountContext.Provider value={{
            accountContextLoading,
            isLoggedIn, logOut,
            accountData, getAccountData, setAccountData,
            authModalOpen, setAuthModalOpen,
            userControlsModalOpen, setUserControlsModalOpen,
            alertMessage, setAlertMessage,
            alertModalOpen, setAlertModalOpen,
            imageUploadModalOpen, setImageUploadModalOpen,
            imageUploadType, setImageUploadType,
            createHolonModalOpen, setCreateHolonModalOpen,
            createPostModalOpen, setCreatePostModalOpen
        }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
