import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { IUserContext, IPost } from '@src/Interfaces'

export const UserContext = createContext<IUserContext>({} as IUserContext)

const defaults = {
    isOwnAccount: false,
    selectedUserSubPage: '',
    userDataLoading: true,
    userPostsLoading: true,
    nextUserPostsLoading: false,
    // user data
    userId: null,
    userHandle: '',
    userBio: '',
    userFlagImagePath: '',
    userCoverImagePath: '',
    userCreatedAt: '',
    userFollowedHolons: [],
    userModeratedHolons: [],
    // user posts
    userPosts: [],
    userPostsFiltersOpen: false,
    userPostsSortByFilter: 'Date',
    userPostsSortOrderFilter: 'Descending',
    userPostsTimeRangeFilter: 'All Time',
    userPostsTypeFilter: 'All Types',
    userPostsSearchQuery: '',
    userPostsPaginationLimit: 10,
    userPostsPaginationOffset: 0,
    userPostsPaginationHasMore: false,
}

function UserContextProvider({ children }: { children: JSX.Element }): JSX.Element {
    const { isLoggedIn, accountData } = useContext(AccountContext)

    const [isOwnAccount, setIsOwnAccount] = useState(false)
    const [selectedUserSubPage, setSelectedUserSubPage] = useState('')
    const [userDataLoading, setUserDataLoading] = useState(true)
    const [userPostsLoading, setUserPostsLoading] = useState(true)
    const [nextUserPostsLoading, setNextUserPostsLoading] = useState(false)
    // user data
    const [userId, setUserId] = useState<null | string>(null)
    const [userHandle, setUserHandle] = useState('')
    const [userName, setUserName] = useState('')
    const [userBio, setUserBio] = useState('')
    const [userFlagImagePath, setUserFlagImagePath] = useState('')
    const [userCoverImagePath, setUserCoverImagePath] = useState('')
    const [userCreatedAt, setUserCreatedAt] = useState('')
    const [userFollowedHolons, setUserFollowedHolons] = useState<any[]>([])
    const [userModeratedHolons, setUserModeratedHolons] = useState<any[]>([])
    // user posts
    const [userPosts, setUserPosts] = useState<IPost[]>([])
    const [userPostsFiltersOpen, setUserPostsFiltersOpen] = useState(false)

    const [userPostsSortByFilter, setUserPostsSortByFilter] = useState('Date')
    const [userPostsSortOrderFilter, setUserPostsSortOrderFilter] = useState('Descending')
    const [userPostsTimeRangeFilter, setUserPostsTimeRangeFilter] = useState('All Time')
    const [userPostsTypeFilter, setUserPostsTypeFilter] = useState('All Types')
    const [userPostsSearchQuery, setUserPostsSearchQuery] = useState('')

    const [userPostsPaginationLimit, setUserPostsPaginationLimit] = useState(10)
    const [userPostsPaginationOffset, setUserPostsPaginationOffset] = useState(0)
    const [userPostsPaginationHasMore, setUserPostsPaginationHasMore] = useState(false)

    function resetUserContext() {
        console.log('resetUserContext')
        setIsOwnAccount(false)
        setSelectedUserSubPage('')
        // user data
        setUserDataLoading(true)
        setUserId(null)
        setUserHandle('')
        setUserBio('')
        setUserFlagImagePath('')
        setUserCoverImagePath('')
        setUserCreatedAt('')
        setUserFollowedHolons([])
        setUserModeratedHolons([])
        // user posts
        setUserPostsLoading(true)
        setNextUserPostsLoading(false)
        setUserPosts([])
        setUserPostsFiltersOpen(false)
        setUserPostsSortByFilter('Date')
        setUserPostsSortOrderFilter('Descending')
        setUserPostsTimeRangeFilter('All Time')
        setUserPostsTypeFilter('All Types')
        setUserPostsSearchQuery('')
        setUserPostsPaginationLimit(10)
        setUserPostsPaginationOffset(0)
        setUserPostsPaginationHasMore(false)
    }

    function getUserData(handle) {
        console.log('UserContext: getUserData')
        setUserDataLoading(true)
        axios
            .get(`${config.apiURL}/user-data?userHandle=${handle}`)
            .then((res) => {
                setUserId(res.data.id)
                setUserHandle(res.data.handle)
                setUserName(res.data.name)
                setUserBio(res.data.bio)
                setUserFlagImagePath(res.data.flagImagePath)
                setUserCoverImagePath(res.data.coverImagePath)
                setUserCreatedAt(res.data.createdAt)
                setUserFollowedHolons(res.data.FollowedHolons)
                setUserModeratedHolons(res.data.ModeratedHolons)
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
                }&userId=${userId
                }&timeRange=${userPostsTimeRangeFilter
                }&postType=${userPostsTypeFilter
                }&sortBy=${userPostsSortByFilter
                }&sortOrder=${userPostsSortOrderFilter
                }&searchQuery=${userPostsSearchQuery
                }&limit=${userPostsPaginationLimit
                }&offset=${offset}`
            )
            .then((res) => {
                if (firstLoad) setUserPostsLoading(false)
                else setNextUserPostsLoading(false)
                setUserPosts(firstLoad ? res.data : [...userPosts, ...res.data])
                setUserPostsPaginationHasMore(res.data.length === userPostsPaginationLimit)
                setUserPostsPaginationOffset(offset + userPostsPaginationLimit)
            })
            .catch((error) => console.log('GET user-posts error: ', error))
    }

    useEffect(() => {
        if (isLoggedIn && userId === accountData.id) {
            setIsOwnAccount(true)
        } else {
            setIsOwnAccount(false)
        }
    }, [userId, isLoggedIn])

    return (
        <UserContext.Provider
            value={{
                isOwnAccount,
                setIsOwnAccount,
                selectedUserSubPage,
                setSelectedUserSubPage,
                // user data
                userDataLoading,
                setUserDataLoading,
                userId,
                setUserId,
                userHandle,
                setUserHandle,
                userName,
                setUserName,
                userBio,
                setUserBio,
                userFlagImagePath,
                setUserFlagImagePath,
                userCoverImagePath,
                setUserCoverImagePath,
                userCreatedAt,
                setUserCreatedAt,
                userFollowedHolons,
                setUserFollowedHolons,
                userModeratedHolons,
                setUserModeratedHolons,
                // user posts
                userPosts,
                setUserPosts,
                userPostsLoading,
                setUserPostsLoading,
                nextUserPostsLoading,
                setNextUserPostsLoading,
                userPostsFiltersOpen,
                setUserPostsFiltersOpen,
                userPostsSortByFilter,
                setUserPostsSortByFilter,
                userPostsSortOrderFilter,
                setUserPostsSortOrderFilter,
                userPostsTimeRangeFilter,
                setUserPostsTimeRangeFilter,
                userPostsTypeFilter,
                setUserPostsTypeFilter,
                userPostsSearchQuery,
                setUserPostsSearchQuery,
                userPostsPaginationLimit,
                setUserPostsPaginationLimit,
                userPostsPaginationOffset,
                setUserPostsPaginationOffset,
                userPostsPaginationHasMore,
                setUserPostsPaginationHasMore,
                // functions
                getUserData,
                getUserPosts,
                resetUserContext,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider

// export interface IUserContext {
//     // userData: any // Partial<IUser>
//     // setUserData: (payload: any) => void
//     userDataLoading: boolean
//     setUserDataLoading: (payload: boolean) => void
//     userId: null | string
//     setUserId: (payload: null | string) => void
//     userHandle: string
//     setUserHandle: (payload: string) => void
//     userName: string
//     setUserName: (payload: string) => void
//     userBio: string
//     setUserBio: (payload: string) => void
//     userFlagImagePath: string
//     setUserFlagImagePath: (payload: string) => void
//     userCoverImagePath: string
//     setUserCoverImagePath: (payload: string) => void
//     userCreatedAt: string
//     setUserCreatedAt: (payload: string) => void
//     userFollowedHolons: any[]
//     setUserFollowedHolons: (payload: any[]) => void
//     userModeratedHolons: any[]
//     setUserModeratedHolons: (payload: any[]) => void

//     userPosts: IPost[]
//     setUserPosts: (payload: IPost[]) => void
//     userPostsLoading: boolean
//     setUserPostsLoading: (payload: boolean) => void
//     nextUserPostsLoading: boolean
//     setNextUserPostsLoading: (payload: boolean) => void
//     userPostsFiltersOpen: boolean
//     setUserPostsFiltersOpen: (payload: boolean) => void
//     // userPostsFilters: any
//     // setUserPostsFilters: (payload: any) => void
//     userPostsSortByFilter: string
//     setUserPostsSortByFilter: (payload: string) => void
//     userPostsSortOrderFilter: string
//     setUserPostsSortOrderFilter: (payload: string) => void
//     userPostsTimeRangeFilter: string
//     setUserPostsTimeRangeFilter: (payload: string) => void
//     userPostsTypeFilter: string
//     setUserPostsTypeFilter: (payload: string) => void
//     userPostsSearchQuery: string
//     setUserPostsSearchQuery: (payload: string) => void

//     userPostsPaginationLimit: number
//     setUserPostsPaginationLimit: (payload: number) => void
//     userPostsPaginationOffset: number
//     setUserPostsPaginationOffset: (payload: number) => void
//     userPostsPaginationHasMore: boolean
//     setUserPostsPaginationHasMore: (payload: boolean) => void
//     selectedUserSubPage: string
//     setSelectedUserSubPage: (payload: string) => void
//     isOwnAccount: boolean
//     setIsOwnAccount: (payload: boolean) => void

//     getUserData: (payload: string) => void
//     getUserPosts: (payload: number) => void
//     resetUserContext: () => void
//     // updatePostFilter: (filter, payload) => void
// }

// function resetContext() {
//     setIsOwnAccount(defaults.isOwnAccount)
//     setSelectedUserSubPage(defaults.selectedUserSubPage)
//     // user data
//     setUserDataLoading(defaults.userDataLoading)
//     setUserId(defaults.userId)
//     setUserHandle(defaults.userHandle)
//     setUserBio(defaults.userBio)
//     setUserFlagImagePath(defaults.userFlagImagePath)
//     setUserCoverImagePath(defaults.userCoverImagePath)
//     setUserCreatedAt(defaults.userCreatedAt)
//     setUserFollowedHolons(defaults.userFollowedHolons)
//     setUserModeratedHolons(defaults.userModeratedHolons)
//     // user posts
//     setUserPosts([])
//     setUserPostsLoading(false)
//     setNextUserPostsLoading(false)
//     setUserPostsFiltersOpen(false)
//     setUserPostsFilters(defaults.userPostsFilters)
//     setUserPostsPaginationLimit(10)
//     setUserPostsPaginationOffset(0)
//     setUserPostsPaginationHasMore(true)

// }
