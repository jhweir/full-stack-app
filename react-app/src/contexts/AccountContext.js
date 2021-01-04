import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie'

export const AccountContext = createContext()

function AccountContextProvider({ children, pageBottomReached }) {
    const [accountContextLoading, setAccountContextLoading] = useState(true)
    const [accountData, setAccountData] = useState({ FollowedHolons: [], ModeratedHolons: [] })
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [notifications, setNotifications] = useState([])
    const [selectedNavBarItem, setSelectedNavBarItem] = useState('')

    // modals
    const [alertModalOpen, setAlertModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [navBarDropDownModalOpen, setNavBarDropDownModalOpen] = useState(false)
    const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
    const [createHolonModalOpen, setCreateHolonModalOpen] = useState(false)
    const [createCommentModalOpen, setCreateCommentModalOpen] = useState(false)
    const [settingModalOpen, setSettingModalOpen] = useState(false)
    const [settingModalType, setSettingModalType] = useState('')
    const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false)
    const [imageUploadType, setImageUploadType] = useState('')
    const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
    const [resetPasswordModalToken, setResetPasswordModalToken] = useState('')

    const [createPostFromTurn, setCreatePostFromTurn] = useState(false)
    const [createPostFromTurnData, setCreatePostFromTurnData] = useState({})

    let cookies = new Cookies()

    function getAccountData() {
        console.log('AccountContext: getAccountData')
        let accessToken = cookies.get('accessToken')
        if (accessToken === undefined) { setAccountContextLoading(false) }
        if (accessToken !== undefined) {
            // create new axios instance with JWT in authorization header
            axios.create({
                baseURL: config.apiURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .get(`/account-data`)
            .then(res => {
                if (res.data !== 'Invalid token') {
                    setAccountData(res.data)
                    //console.log('account data: ', res.data)
                    setIsLoggedIn(true)
                    console.log('AccountContext: logged in succesfully') }
                setAccountContextLoading(false)
            })
        }
    }

    function getNotifications() {
        console.log('AccountContext: getNotifications')
        axios
            .get(config.apiURL + `/account-notifications?accountId=${accountData.id}`)
            .then(res => {
                setNotifications(res.data)
            })
    }

    function getNextNotifications() {
        //
    }

    function logOut() {
        console.log('AccountContext: logOut')
        cookies.remove('accessToken', { path: '/' })
        setAccountData({ FollowedHolons: [], ModeratedHolons: [] })
        setIsLoggedIn(false)
    }

    useEffect(() => {
        getAccountData()
        //getNotifications()
    }, [])

    return (
        <AccountContext.Provider value={{
            accountContextLoading, setAccountContextLoading,
            pageBottomReached,
            isLoggedIn, logOut,
            accountData, getAccountData, setAccountData,
            authModalOpen, setAuthModalOpen,
            navBarDropDownModalOpen, setNavBarDropDownModalOpen,
            alertMessage, setAlertMessage,
            alertModalOpen, setAlertModalOpen,
            imageUploadModalOpen, setImageUploadModalOpen,
            imageUploadType, setImageUploadType,
            createHolonModalOpen, setCreateHolonModalOpen,
            createPostModalOpen, setCreatePostModalOpen,
            createCommentModalOpen, setCreateCommentModalOpen,
            settingModalOpen, setSettingModalOpen,
            settingModalType, setSettingModalType,
            createPostFromTurn, setCreatePostFromTurn,
            createPostFromTurnData, setCreatePostFromTurnData,
            resetPasswordModalOpen, setResetPasswordModalOpen,
            resetPasswordModalToken, setResetPasswordModalToken,

            selectedNavBarItem, setSelectedNavBarItem,

            notifications, setNotifications,

            getNotifications, getNextNotifications
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
