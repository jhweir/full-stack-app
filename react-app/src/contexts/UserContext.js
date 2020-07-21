import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const UserContext = createContext()

function UserContextProvider(props) {
    const { accountContextLoading, isLoggedIn, accountData } = useContext(AccountContext)
    const [userContextLoading, setUserContextLoading] = useState(true)
    const [userHandle, setUserHandle] = useState('')
    const [userData, setUserData] = useState({ Posts: [], FollowedHolons: [], ModeratedHolons: [] })
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [isOwnAccount, setIsOwnAccount] = useState(false)

    const [createdPosts, setCreatedPosts] = useState([])
    const [createdPostPaginationLimit, setCreatedPostPaginationLimit] = useState(5)
    const [createdPostPaginationOffset, setCreatedPostPaginationOffset] = useState(0)
    const [createdPostPaginationHasMore, setCreatedPostPaginationHasMore] = useState(true)
    const [createdPostFiltersOpen, setCreatedPostFiltersOpen] = useState(false)
    const [createdPostSearchFilter, setCreatedPostSearchFilter] = useState('')
    const [createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter] = useState('All Time')
    const [createdPostTypeFilter, setCreatedPostTypeFilter] = useState('All Types')
    const [createdPostSortByFilter, setCreatedPostSortByFilter] = useState('Posts')
    const [createdPostSortOrderFilter, setCreatedPostSortOrderFilter] = useState('Descending')

    function getUserData() {
        console.log('UserContext: getUserData')
        setUserContextLoading(true)
        axios.get(config.environmentURL + `/user-data?userHandle=${userHandle}`)
            .then(res => { setUserData(res.data); setUserContextLoading(false) })
    }

    function getCreatedPosts() {
        console.log('UserContext: getCreatedPosts')
        axios
            .get(config.environmentURL + 
            `/user-posts?userId=${userData.id ? userData.id : null}&accountId=${isLoggedIn ? accountData.id : null}`)
            .then(res => { setCreatedPosts(res.data); setUserContextLoading(false) })
    }

    useEffect(() => {
        if (!accountContextLoading) { getUserData() }
    }, [userHandle, accountData])

    useEffect(() => {
        if (isLoggedIn && userData && userData.id === accountData.id) { setIsOwnAccount(true) }
        else { setIsOwnAccount(false) }
    }, [isLoggedIn, userData])

    return (
        <UserContext.Provider value={{
            userContextLoading, setUserContextLoading,
            userHandle, setUserHandle,
            userData, getUserData,
            isOwnAccount,
            selectedUserSubPage, setSelectedUserSubPage,
            createdPosts, getCreatedPosts,
            createdPostPaginationLimit, setCreatedPostPaginationLimit,
            createdPostPaginationOffset, setCreatedPostPaginationOffset,
            createdPostPaginationHasMore, setCreatedPostPaginationHasMore,
            createdPostFiltersOpen, setCreatedPostFiltersOpen,
            createdPostSearchFilter, setCreatedPostSearchFilter,
            createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter,
            createdPostTypeFilter, setCreatedPostTypeFilter,
            createdPostSortByFilter, setCreatedPostSortByFilter,
            createdPostSortOrderFilter, setCreatedPostSortOrderFilter
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider