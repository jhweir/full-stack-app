import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const UserContext = createContext()

function UserContextProvider({ children }) {
    const { accountContextLoading, isLoggedIn, accountData } = useContext(AccountContext)
    const [userContextLoading, setUserContextLoading] = useState(true)
    const [userHandle, setUserHandle] = useState('')
    const [userData, setUserData] = useState({ Posts: [], FollowedHolons: [], ModeratedHolons: [] })
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [isOwnAccount, setIsOwnAccount] = useState(false)

    const [createdPosts, setCreatedPosts] = useState([])
    const [createdPostFiltersOpen, setCreatedPostFiltersOpen] = useState(false)
    const [createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter] = useState('All Time')
    const [createdPostTypeFilter, setCreatedPostTypeFilter] = useState('All Types')
    const [createdPostSortByFilter, setCreatedPostSortByFilter] = useState('Date')
    const [createdPostSortOrderFilter, setCreatedPostSortOrderFilter] = useState('Descending')
    const [createdPostSearchFilter, setCreatedPostSearchFilter] = useState('')
    const [createdPostPaginationLimit, setCreatedPostPaginationLimit] = useState(10)
    const [createdPostPaginationOffset, setCreatedPostPaginationOffset] = useState(0)
    const [createdPostPaginationHasMore, setCreatedPostPaginationHasMore] = useState(true)

    const [notifications, setNotifications] = useState([])

    function getUserData() {
        console.log('UserContext: getUserData')
        setUserContextLoading(true)
        axios.get(config.apiURL + `/user-data?userHandle=${userHandle}`)
            .then(res => { setUserData(res.data); setUserContextLoading(false) })
    }

    function getCreatedPosts() {
        console.log(`UserContext: getCreatedPosts (0 to ${createdPostPaginationLimit})`)
        axios.get(config.apiURL + 
            `/user-posts?accountId=${isLoggedIn ? accountData.id : null
            }&userId=${userData.id ? userData.id : null
            }&timeRange=${createdPostTimeRangeFilter
            }&postType=${createdPostTypeFilter
            }&sortBy=${createdPostSortByFilter
            }&sortOrder=${createdPostSortOrderFilter
            }&searchQuery=${createdPostSearchFilter
            }&limit=${createdPostPaginationLimit
            }&offset=0`)
            .then(res => {
                if (res.data.length < createdPostPaginationLimit) { setCreatedPostPaginationHasMore(false) }
                setCreatedPosts(res.data)
                setCreatedPostPaginationOffset(createdPostPaginationLimit)
                setUserContextLoading(false)
            })
    }

    function getNextCreatedPosts() {
        if (createdPostPaginationHasMore) {
            console.log(`UserContext: getNextCreatedPosts (${createdPostPaginationOffset} to ${createdPostPaginationOffset + createdPostPaginationLimit})`)
            axios.get(config.apiURL + 
                `/user-posts?accountId=${isLoggedIn ? accountData.id : null
                }&userId=${userData.id ? userData.id : null
                }&timeRange=${createdPostTimeRangeFilter
                }&postType=${createdPostTypeFilter
                }&sortBy=${createdPostSortByFilter
                }&sortOrder=${createdPostSortOrderFilter
                }&searchQuery=${createdPostSearchFilter
                }&limit=${createdPostPaginationLimit
                }&offset=${createdPostPaginationOffset}`)
                .then(res => { 
                    if (res.data.length < createdPostPaginationLimit) { setCreatedPostPaginationHasMore(false) }
                    setCreatedPosts([...createdPosts, ...res.data])
                    setCreatedPostPaginationOffset(createdPostPaginationOffset + createdPostPaginationLimit)
                })
        }
    }

    function getNotifications() {
        axios
            .get(config.apiURL + `/user-notifications?userId=${accountData.id}`)
            .then(res => {
                setNotifications(res.data)
            })
    }

    function getNextNotifications() {
        //
    }

    function resetCreatedPostFilters() {
        setCreatedPostFiltersOpen(false)
        setCreatedPostTimeRangeFilter('All Time')
        setCreatedPostTypeFilter('All Types')
        setCreatedPostSortByFilter('Date')
        setCreatedPostSortOrderFilter('Descending')
        setCreatedPostSearchFilter('')
        setCreatedPostPaginationLimit(10)
        setCreatedPostPaginationOffset(0)
        setCreatedPostPaginationHasMore(true)
    }

    useEffect(() => {
        resetCreatedPostFilters()
    }, [userHandle])

    useEffect(() => {
        if (!accountContextLoading) { getUserData() }
    }, [userHandle, accountData.id])

    useEffect(() => {
        if (isLoggedIn && userData && userData.id === accountData.id) { setIsOwnAccount(true) }
        else { setIsOwnAccount(false) }
    }, [isLoggedIn, userData.id])

    return (
        <UserContext.Provider value={{
            userContextLoading, setUserContextLoading,
            userHandle, setUserHandle,
            userData, setUserData,
            selectedUserSubPage, setSelectedUserSubPage,
            isOwnAccount, setIsOwnAccount,
            
            createdPosts, setCreatedPosts,
            createdPostPaginationLimit, setCreatedPostPaginationLimit,
            createdPostPaginationOffset, setCreatedPostPaginationOffset,
            createdPostPaginationHasMore, setCreatedPostPaginationHasMore,
            createdPostFiltersOpen, setCreatedPostFiltersOpen,
            createdPostSearchFilter, setCreatedPostSearchFilter,
            createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter,
            createdPostTypeFilter, setCreatedPostTypeFilter,
            createdPostSortByFilter, setCreatedPostSortByFilter,
            createdPostSortOrderFilter, setCreatedPostSortOrderFilter,

            notifications, setNotifications,

            // functions
            getUserData,
            getCreatedPosts, getNextCreatedPosts,
            getNotifications, getNextNotifications
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
