import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import config from '../Config'
import { AccountContext } from './AccountContext'
import { IUserContext, IUser, IPost } from '../Interfaces'

export const UserContext = createContext<IUserContext>({
    userContextLoading: true,
    userHandle: '',
    userData: {},
    selectedUserSubPage: '',
    isOwnAccount: false,
    createdPosts: [],
    createdPostPaginationLimit: 0,
    createdPostPaginationOffset: 0,
    createdPostPaginationHasMore: false,
    createdPostFiltersOpen: false,
    createdPostSearchFilter: '',
    createdPostTimeRangeFilter: '',
    createdPostTypeFilter: '',
    createdPostSortByFilter: '',
    createdPostSortOrderFilter: '',
    setUserContextLoading: () => null,
    setUserHandle: () => null,
    setUserData: () => null,
    setSelectedUserSubPage: () => null,
    setIsOwnAccount: () => null,
    setCreatedPosts: () => null,
    setCreatedPostPaginationLimit: () => null,
    setCreatedPostPaginationOffset: () => null,
    setCreatedPostPaginationHasMore: () => null,
    setCreatedPostFiltersOpen: () => null,
    setCreatedPostSearchFilter: () => null,
    setCreatedPostTimeRangeFilter: () => null,
    setCreatedPostTypeFilter: () => null,
    setCreatedPostSortByFilter: () => null,
    setCreatedPostSortOrderFilter: () => null,
    getUserData: () => null,
    getCreatedPosts: () => null,
    getNextCreatedPosts: () => null,
})

function UserContextProvider({ children }: { children: JSX.Element }): JSX.Element {
    const { accountContextLoading, isLoggedIn, accountData } = useContext(AccountContext)
    const [userContextLoading, setUserContextLoading] = useState(true)
    const [userHandle, setUserHandle] = useState('')
    const [userData, setUserData] = useState<Partial<IUser>>({
        FollowedHolons: [],
        ModeratedHolons: [],
    })
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [isOwnAccount, setIsOwnAccount] = useState(false)

    const [createdPosts, setCreatedPosts] = useState<IPost[]>([])
    const [createdPostFiltersOpen, setCreatedPostFiltersOpen] = useState(false)
    const [createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter] = useState('All Time')
    const [createdPostTypeFilter, setCreatedPostTypeFilter] = useState('All Types')
    const [createdPostSortByFilter, setCreatedPostSortByFilter] = useState('Date')
    const [createdPostSortOrderFilter, setCreatedPostSortOrderFilter] = useState('Descending')
    const [createdPostSearchFilter, setCreatedPostSearchFilter] = useState('')
    const [createdPostPaginationLimit, setCreatedPostPaginationLimit] = useState(10)
    const [createdPostPaginationOffset, setCreatedPostPaginationOffset] = useState(0)
    const [createdPostPaginationHasMore, setCreatedPostPaginationHasMore] = useState(true)

    function getUserData() {
        console.log('UserContext: getUserData')
        setUserContextLoading(true)
        axios.get(`${config.apiURL}/user-data?userHandle=${userHandle}`).then((res) => {
            setUserData(res.data)
            setUserContextLoading(false)
        })
    }

    function getCreatedPosts() {
        console.log(`UserContext: getCreatedPosts (0 to ${createdPostPaginationLimit})`)
        axios
            .get(
                // prettier-ignore
                `${config.apiURL}/user-posts?accountId=${isLoggedIn ? accountData.id : null
                }&userId=${userData.id ? userData.id : null
                }&timeRange=${createdPostTimeRangeFilter
                }&postType=${createdPostTypeFilter
                }&sortBy=${createdPostSortByFilter
                }&sortOrder=${createdPostSortOrderFilter
                }&searchQuery=${createdPostSearchFilter
                }&limit=${createdPostPaginationLimit
                }&offset=0`
            )
            .then((res) => {
                if (res.data.length < createdPostPaginationLimit) {
                    setCreatedPostPaginationHasMore(false)
                }
                setCreatedPosts(res.data)
                setCreatedPostPaginationOffset(createdPostPaginationLimit)
                setUserContextLoading(false)
            })
    }

    function getNextCreatedPosts() {
        if (createdPostPaginationHasMore) {
            console.log(
                `UserContext: getNextCreatedPosts (${createdPostPaginationOffset} to ${
                    createdPostPaginationOffset + createdPostPaginationLimit
                })`
            )
            axios
                .get(
                    // prettier-ignore
                    `${config.apiURL}/user-posts?accountId=${isLoggedIn ? accountData.id : null
                    }&userId=${userData.id ? userData.id : null
                    }&timeRange=${createdPostTimeRangeFilter
                    }&postType=${createdPostTypeFilter
                    }&sortBy=${createdPostSortByFilter
                    }&sortOrder=${createdPostSortOrderFilter
                    }&searchQuery=${createdPostSearchFilter
                    }&limit=${createdPostPaginationLimit
                    }&offset=${createdPostPaginationOffset}`
                )
                .then((res) => {
                    if (res.data.length < createdPostPaginationLimit) {
                        setCreatedPostPaginationHasMore(false)
                    }
                    setCreatedPosts([...createdPosts, ...res.data])
                    setCreatedPostPaginationOffset(
                        createdPostPaginationOffset + createdPostPaginationLimit
                    )
                })
        }
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
        if (!accountContextLoading) {
            getUserData()
        }
    }, [userHandle, accountData.id])

    useEffect(() => {
        if (isLoggedIn && userData && userData.id === accountData.id) {
            setIsOwnAccount(true)
        } else {
            setIsOwnAccount(false)
        }
    }, [isLoggedIn, userData])

    // back button fix
    const history = useHistory()
    useEffect(() => {
        history.listen(() => {
            if (history.action === 'POP') {
                history.go(history.location.pathname)
            }
        })
    }, [])

    return (
        <UserContext.Provider
            value={{
                userContextLoading,
                userHandle,
                userData,
                selectedUserSubPage,
                isOwnAccount,
                createdPosts,
                createdPostPaginationLimit,
                createdPostPaginationOffset,
                createdPostPaginationHasMore,
                createdPostFiltersOpen,
                createdPostSearchFilter,
                createdPostTimeRangeFilter,
                createdPostTypeFilter,
                createdPostSortByFilter,
                createdPostSortOrderFilter,
                setUserContextLoading,
                setUserHandle,
                setUserData,
                setSelectedUserSubPage,
                setIsOwnAccount,
                setCreatedPosts,
                setCreatedPostPaginationLimit,
                setCreatedPostPaginationOffset,
                setCreatedPostPaginationHasMore,
                setCreatedPostFiltersOpen,
                setCreatedPostSearchFilter,
                setCreatedPostTimeRangeFilter,
                setCreatedPostTypeFilter,
                setCreatedPostSortByFilter,
                setCreatedPostSortOrderFilter,
                getUserData,
                getCreatedPosts,
                getNextCreatedPosts,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
