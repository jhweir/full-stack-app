import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie'

export const AccountContext = createContext()

function AccountContextProvider({ children, pageBottomReached, setPageBottomReached }) {
    const [accountContextLoading, setAccountContextLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [accountData, setAccountData] = useState({ FollowedHolons: [], ModeratedHolons: [] })
    const [globalData, setGlobalData] = useState({})
    const [alertModalOpen, setAlertModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [userControlsModalOpen, setUserControlsModalOpen] = useState(false)
    const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
    const [createHolonModalOpen, setCreateHolonModalOpen] = useState(false)
    const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false)
    const [imageUploadType, setImageUploadType] = useState('')

    let cookies = new Cookies()

    function getAccountData() {
        console.log('AccountContext: getAccountData')
        let accessToken = cookies.get('accessToken')
        if (accessToken === undefined) { setAccountContextLoading(false) }
        if (accessToken !== undefined) {
            // Create new axios instance with JWT in authorization header
            axios.create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .get(`/account-data`)
            .then(res => {
                if (res.data !== 'Invalid token') { setAccountData(res.data); setIsLoggedIn(true); console.log('AccountContext: logged in succesfully') }
                setAccountContextLoading(false)
            })
        }
    }

    // function getGlobalData() {
    //     console.log('AccountContext: getGlobalData')
    //     axios.get(config.environmentURL + '/global-data')
    //     .then(res => { setGlobalData(res.data) })
    // }

    function logOut() {
        console.log('AccountContext: logOut')
        cookies.remove('accessToken', { path: '/' })
        setAccountData({ FollowedHolons: [], ModeratedHolons: [] })
        setIsLoggedIn(false)
    }

    useEffect(() => {
        //getGlobalData()
        getAccountData()
    }, [])

    return (
        <AccountContext.Provider value={{
            accountContextLoading,
            pageBottomReached,
            isLoggedIn, logOut,
            //globalData, getGlobalData,
            accountData, getAccountData, setAccountData,
            filtersOpen, setFiltersOpen,
            authModalOpen, setAuthModalOpen,
            userControlsModalOpen, setUserControlsModalOpen,
            alertMessage, setAlertMessage,
            alertModalOpen, setAlertModalOpen,
            imageUploadModalOpen, setImageUploadModalOpen,
            imageUploadType, setImageUploadType,
            createHolonModalOpen, setCreateHolonModalOpen,
            createPostModalOpen, setCreatePostModalOpen
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
