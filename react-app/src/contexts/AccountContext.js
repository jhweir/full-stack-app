import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie';
import { HolonContext } from './HolonContext'

export const AccountContext = createContext()

function AccountContextProvider(props) {
    //const { updateHolonContext, holonData } = useContext(HolonContext)

    const [accountContextLoading, setAccountContextLoading] = useState(true)
    const [accountData, setAccountData] = useState({
        FollowedHolons: [],
        ModeratedHolons: []
    })
    const [alertModalOpen, setAlertModalOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [userControlsModalOpen, setUserControlsModalOpen] = useState(false)

    let cookies = new Cookies()

    function updateAccountContext() {
        let accessToken = cookies.get('accessToken')
        //console.log('accessToken:', accessToken)
        if (accessToken === undefined) { setAccountContextLoading(false) }
        if (accessToken !== undefined) {
            axios
                // Create new axios instance with JWT in authorization header
                .create({
                    baseURL: config.environmentURL,
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                .get(`/account-data`)
                .then(res => {
                    if (res.data !== 'Invalid token') { setAccountData(res.data) }
                    setAccountContextLoading(false)
                    //updateHolonContext(holonData.handle)
                })
        }
    }

    function logOut() {
        cookies.remove('accessToken', { path: '/' })
        setAccountData({        
            FollowedHolons: [],
            ModeratedHolons: []
        })
    }

    useEffect(() => {
        updateAccountContext()
        console.log('account context updated')
    }, [])

    // useEffect(() => {
    //     //
    //         updateHolonContext('root')
    //     //}
    // }, [accountData])

    return (
        <AccountContext.Provider value={{
            accountContextLoading,
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
