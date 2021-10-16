import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import { IAccountContext } from '@src/Interfaces'

export const AccountContext = createContext<IAccountContext>({} as IAccountContext)

const defaults = {
    accountData: {
        id: null,
        handle: null,
        name: null,
        bio: null,
        flagImagePath: null,
        unseen_notifications: 0,
        FollowedHolons: [],
        ModeratedHolons: [],
    },
}

function AccountContextProvider({ children }: { children: JSX.Element }): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [accountData, setAccountData] = useState(defaults.accountData)
    const [accountDataLoading, setAccountDataLoading] = useState(true)
    const [notifications, setNotifications] = useState<any[]>([])
    const [notificationsLoading, setNotificationsLoading] = useState(true)
    // modals (todo: most to be removed...)
    const [alertModalOpen, setAlertModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [navBarDropDownModalOpen, setNavBarDropDownModalOpen] = useState(false)
    const [createPostModalOpen, setCreatePostModalOpen] = useState(false)
    // const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false)
    const [createCommentModalOpen, setCreateCommentModalOpen] = useState(false)
    const [settingModalOpen, setSettingModalOpen] = useState(false)
    const [settingModalType, setSettingModalType] = useState('')
    const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false)
    const [imageUploadType, setImageUploadType] = useState('')
    const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
    const [resetPasswordModalToken, setResetPasswordModalToken] = useState<string | null>('')

    const cookies = new Cookies()

    function getAccountData() {
        console.log('AccountContext: getAccountData')
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        if (!accessToken) setAccountDataLoading(false)
        else {
            axios
                .get(`${config.apiURL}/account-data`, authHeader)
                .then((res) => {
                    if (res.data !== 'invalid-auth-token') {
                        setAccountData(res.data)
                        setIsLoggedIn(true)
                    }
                    setAccountDataLoading(false)
                })
                .catch((error) => console.log('GET account-data error: ', error))
        }
    }

    function updateAccountData(key, payload) {
        setAccountData({ ...accountData, [key]: payload })
    }

    // todo: include offset and set up pagination
    function getNotifications() {
        console.log('AccountContext: getNotifications')
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        if (!accessToken) setNotificationsLoading(false)
        else {
            axios
                .get(`${config.apiURL}/account-notifications`, authHeader)
                .then((res) => {
                    console.log('res.data: ', res.data)
                    setNotifications(res.data)
                    setNotificationsLoading(false)
                })
                .catch((error) => console.log('GET account-notifications error: ', error))
        }
    }

    function updateAccountNotification(id, key, payload) {
        console.log(`AccountContext: updateAccountNotification(${id}, ${key}, ${payload})`)
        const newNotifications = [...notifications]
        const notification = newNotifications.find((n) => n.id === id)
        notification[key] = payload
        setNotifications(newNotifications)
        console.log('newNotifications: ', newNotifications)
    }

    function logOut() {
        console.log('AccountContext: logOut')
        cookies.remove('accessToken', { path: '/' })
        setAccountData(defaults.accountData)
        setIsLoggedIn(false)
    }

    useEffect(() => getAccountData(), [])

    return (
        <AccountContext.Provider
            value={{
                isLoggedIn,
                accountData,
                accountDataLoading,
                notifications,
                setNotifications,
                notificationsLoading,
                // modals (todo: most to be removed...)
                alertModalOpen,
                setAlertModalOpen,
                alertMessage,
                setAlertMessage,
                authModalOpen,
                setAuthModalOpen,
                navBarDropDownModalOpen,
                setNavBarDropDownModalOpen,
                createPostModalOpen,
                setCreatePostModalOpen,
                // createSpaceModalOpen,
                // setCreateSpaceModalOpen,
                createCommentModalOpen,
                setCreateCommentModalOpen,
                settingModalOpen,
                setSettingModalOpen,
                settingModalType,
                setSettingModalType,
                imageUploadModalOpen,
                setImageUploadModalOpen,
                imageUploadType,
                setImageUploadType,
                resetPasswordModalOpen,
                setResetPasswordModalOpen,
                resetPasswordModalToken,
                setResetPasswordModalToken,
                // functions
                getAccountData,
                updateAccountData,
                getNotifications,
                updateAccountNotification,
                logOut,
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContextProvider
