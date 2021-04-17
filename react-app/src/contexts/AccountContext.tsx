import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '../Config'
import { IAccountContext } from '../Interfaces'

export const AccountContext = createContext<IAccountContext>({
    accountContextLoading: true,
    pageBottomReached: false,
    isLoggedIn: false,
    accountData: {},
    authModalOpen: false,
    navBarDropDownModalOpen: false,
    alertMessage: '',
    alertModalOpen: false,
    imageUploadModalOpen: false,
    imageUploadType: '',
    createHolonModalOpen: false,
    createPostModalOpen: false,
    createCommentModalOpen: false,
    settingModalOpen: false,
    settingModalType: '',
    createPostFromTurn: false,
    createPostFromTurnData: {},
    resetPasswordModalOpen: false,
    resetPasswordModalToken: '',
    selectedNavBarItem: '',
    notifications: [],
    setAccountContextLoading: () => null,
    setAccountData: () => null,
    setAuthModalOpen: () => null,
    setNavBarDropDownModalOpen: () => null,
    setAlertMessage: () => null,
    setAlertModalOpen: () => null,
    setImageUploadModalOpen: () => null,
    setImageUploadType: () => null,
    setCreateHolonModalOpen: () => null,
    setCreatePostModalOpen: () => null,
    setCreateCommentModalOpen: () => null,
    setSettingModalOpen: () => null,
    setSettingModalType: () => null,
    setCreatePostFromTurn: () => null,
    setCreatePostFromTurnData: () => null,
    setResetPasswordModalOpen: () => null,
    setResetPasswordModalToken: () => null,
    setSelectedNavBarItem: () => null,
    setNotifications: () => null,
    logOut: () => null,
    getAccountData: () => null,
    getNotifications: () => null,
    getNextNotifications: () => null,
})

function AccountContextProvider({
    children,
    pageBottomReached,
}: {
    children: JSX.Element
    pageBottomReached: boolean
}): JSX.Element {
    const [accountContextLoading, setAccountContextLoading] = useState(true)
    const [accountData, setAccountData] = useState({
        FollowedHolons: [],
        ModeratedHolons: [],
    })
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [notifications, setNotifications] = useState<any[]>([])
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
    const [resetPasswordModalToken, setResetPasswordModalToken] = useState<string | null>('')

    const [createPostFromTurn, setCreatePostFromTurn] = useState(false)
    const [createPostFromTurnData, setCreatePostFromTurnData] = useState({})

    const cookies = new Cookies()

    function getAccountData() {
        console.log('AccountContext: getAccountData')
        const accessToken = cookies.get('accessToken')
        if (!accessToken) setAccountContextLoading(false)
        else {
            axios
                .get(`${config.apiURL}/account-data`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => {
                    if (res.data !== 'Invalid token') {
                        setAccountData(res.data)
                        setIsLoggedIn(true)
                        console.log('AccountContext: logged in succesfully')
                    }
                    setAccountContextLoading(false)
                })
        }
    }

    function getNotifications() {
        console.log('AccountContext: getNotifications')
        const accessToken = cookies.get('accessToken')
        if (accessToken) {
            axios
                .get(`${config.apiURL}/account-notifications`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((res) => setNotifications(res.data))
        }
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
        // getNotifications()
    }, [])

    return (
        <AccountContext.Provider
            value={{
                accountContextLoading,
                pageBottomReached,
                isLoggedIn,
                accountData,
                authModalOpen,
                navBarDropDownModalOpen,
                alertMessage,
                alertModalOpen,
                imageUploadModalOpen,
                imageUploadType,
                createHolonModalOpen,
                createPostModalOpen,
                createCommentModalOpen,
                settingModalOpen,
                settingModalType,
                createPostFromTurn,
                createPostFromTurnData,
                resetPasswordModalOpen,
                resetPasswordModalToken,
                selectedNavBarItem,
                notifications,
                setAccountContextLoading,
                setAccountData,
                setAuthModalOpen,
                setNavBarDropDownModalOpen,
                setAlertMessage,
                setAlertModalOpen,
                setImageUploadModalOpen,
                setImageUploadType,
                setCreateHolonModalOpen,
                setCreatePostModalOpen,
                setCreateCommentModalOpen,
                setSettingModalOpen,
                setSettingModalType,
                setCreatePostFromTurn,
                setCreatePostFromTurnData,
                setResetPasswordModalOpen,
                setResetPasswordModalToken,
                setSelectedNavBarItem,
                setNotifications,
                logOut,
                getAccountData,
                getNotifications,
                getNextNotifications,
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
