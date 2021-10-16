import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { IUserContext, IPost } from '@src/Interfaces'

export const UserContext = createContext<IUserContext>({} as IUserContext)

const defaults = {
    userData: {
        id: null,
        handle: null,
        name: null,
        bio: null,
        flagImagePath: null,
        coverImagePath: null,
        createdAt: null,
        followedHolons: [],
        moderatedHolons: [],
    },
    postFilters: {
        type: 'All Types',
        sortBy: 'Date',
        sortOrder: 'Descending',
        timeRange: 'All Time',
        searchQuery: '',
    },
}

function UserContextProvider({ children }: { children: JSX.Element }): JSX.Element {
    const { isLoggedIn, accountData } = useContext(AccountContext)

    const [isOwnAccount, setIsOwnAccount] = useState(false)
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [userData, setUserData] = useState(defaults.userData)
    const [userDataLoading, setUserDataLoading] = useState(true)
    const [userPosts, setUserPosts] = useState<IPost[]>([])
    const [userPostsLoading, setUserPostsLoading] = useState(true)
    const [nextUserPostsLoading, setNextUserPostsLoading] = useState(false)
    const [userPostsFilters, setUserPostsFilters] = useState(defaults.postFilters)
    const [userPostsFiltersOpen, setUserPostsFiltersOpen] = useState(false)
    const [userPostsPaginationLimit, setUserPostsPaginationLimit] = useState(10)
    const [userPostsPaginationOffset, setUserPostsPaginationOffset] = useState(0)
    const [userPostsPaginationHasMore, setUserPostsPaginationHasMore] = useState(false)

    function getUserData(userHandle) {
        console.log('UserContext: getUserData')
        setUserDataLoading(true)
        axios
            .get(`${config.apiURL}/user-data?userHandle=${userHandle}`)
            .then((res) => {
                setUserData(res.data || defaults.userData)
                setUserDataLoading(false)
            })
            .catch((error) => console.log('GET user-data error: ', error))
    }

    function getUserPosts(offset) {
        console.log(`UserContext: getUserPosts (${offset} to ${offset + userPostsPaginationLimit})`)
        const firstLoad = offset === 0
        if (firstLoad) setUserPostsLoading(true)
        else setNextUserPostsLoading(true)
        axios
            .get(
                // prettier-ignore
                `${config.apiURL}/user-posts?accountId=${accountData.id
                }&userId=${userData.id
                }&postType=${userPostsFilters.type
                }&sortBy=${userPostsFilters.sortBy
                }&sortOrder=${userPostsFilters.sortOrder
                }&timeRange=${userPostsFilters.timeRange
                }&searchQuery=${userPostsFilters.searchQuery
                }&limit=${userPostsPaginationLimit
                }&offset=${offset}`
            )
            .then((res) => {
                setUserPosts(firstLoad ? res.data : [...userPosts, ...res.data])
                setUserPostsPaginationHasMore(res.data.length === userPostsPaginationLimit)
                setUserPostsPaginationOffset(offset + userPostsPaginationLimit)
                if (firstLoad) setUserPostsLoading(false)
                else setNextUserPostsLoading(false)
            })
            .catch((error) => console.log('GET user-posts error: ', error))
    }

    function updateUserPostsFilter(key, payload) {
        console.log(`UserContext: updateUserPostsFilter (${key}: ${payload})`)
        setUserPostsFilters({ ...userPostsFilters, [key]: payload })
    }

    function resetUserContext() {
        console.log('UserContext: resetUserContext')
        setUserData(defaults.userData)
        setUserPosts([])
        setUserPostsFilters(defaults.postFilters)
        setUserPostsFiltersOpen(false)
        setUserPostsPaginationLimit(10)
        setUserPostsPaginationOffset(0)
        setUserPostsPaginationHasMore(false)
    }

    // determine if user is owned by account
    useEffect(() => {
        if (isLoggedIn && userData.id === accountData.id) setIsOwnAccount(true)
        else setIsOwnAccount(false)
    }, [userData.id, isLoggedIn])

    return (
        <UserContext.Provider
            value={{
                isOwnAccount,
                selectedUserSubPage,
                setSelectedUserSubPage,
                userData,
                userDataLoading,
                userPosts,
                userPostsLoading,
                nextUserPostsLoading,
                userPostsFilters,
                userPostsFiltersOpen,
                setUserPostsFiltersOpen,
                userPostsPaginationLimit,
                userPostsPaginationOffset,
                userPostsPaginationHasMore,
                // functions
                getUserData,
                getUserPosts,
                updateUserPostsFilter,
                resetUserContext,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
