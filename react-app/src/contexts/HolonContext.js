import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const HolonContext = createContext()

function HolonContextProvider({ children }) {
    const { accountContextLoading, accountData, getAccountData, isLoggedIn } = useContext(AccountContext)

    const [holonHandle, setHolonHandle] = useState('')
    const [holonData, setHolonData] = useState({ DirectChildHolons: [], DirectParentHolons: [], HolonHandles: [] })
    const [isFollowing, setIsFollowing] = useState(false)
    const [isModerator, setIsModerator] = useState(false)
    const [selectedHolonSubPage, setSelectedHolonSubPage] = useState('')

    // TODO: split holonContextLoading into holonDataLoading, holonPostsLoading, holonSpacesLoading, holonUsersLoading
    const [holonContextLoading, setHolonContextLoading] = useState(true)

    const [holonPosts, setHolonPosts] = useState({ posts: [] })
    const [totalMatchingPosts, setTotalMatchingPosts] = useState(0)
    const [holonPostFiltersOpen, setHolonPostFiltersOpen] = useState(false)
    const [holonPostTimeRangeFilter, setHolonPostTimeRangeFilter] = useState('All Time')
    const [holonPostTypeFilter, setHolonPostTypeFilter] = useState('All Types')
    const [holonPostSortByFilter, setHolonPostSortByFilter] = useState('Likes')
    const [holonPostSortOrderFilter, setHolonPostSortOrderFilter] = useState('Descending')
    const [holonPostDepthFilter, setHolonPostDepthFilter] = useState('All Contained Posts')
    const [holonPostSearchFilter, setHolonPostSearchFilter] = useState('')
    const [holonPostPaginationLimit, setHolonPostPaginationLimit] = useState(10)
    const [holonPostPaginationOffset, setHolonPostPaginationOffset] = useState(0)
    const [holonPostPaginationHasMore, setHolonPostPaginationHasMore] = useState(true)
    // const [holonPostViewsOpen, setHolonPostViewsOpen] = useState(false)
    const [holonPostView, setHolonPostView] = useState('List')

    const [holonSpaces, setHolonSpaces] = useState([])
    const [holonSpaceFiltersOpen, setHolonSpaceFiltersOpen] = useState(false)
    const [holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter] = useState('All Time')
    const [holonSpaceTypeFilter, setHolonSpaceTypeFilter] = useState('All Types')
    const [holonSpaceSortByFilter, setHolonSpaceSortByFilter] = useState('Posts')
    const [holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter] = useState('Descending')
    const [holonSpaceDepthFilter, setHolonSpaceDepthFilter] = useState('All Contained Spaces')
    const [holonSpaceSearchFilter, setHolonSpaceSearchFilter] = useState('')
    const [holonSpacePaginationLimit, setHolonSpacePaginationLimit] = useState(10)
    const [holonSpacePaginationOffset, setHolonSpacePaginationOffset] = useState(0)
    const [holonSpacePaginationHasMore, setHolonSpacePaginationHasMore] = useState(true)
    const [holonSpaceView, setHolonSpaceView] = useState('List')

    const [holonUsers, setHolonUsers] = useState([])
    const [holonUserFiltersOpen, setHolonUserFiltersOpen] = useState(false)
    const [holonUserTimeRangeFilter, setHolonUserTimeRangeFilter] = useState('All Time')
    const [holonUserTypeFilter, setHolonUserTypeFilter] = useState('All Types')
    const [holonUserSortByFilter, setHolonUserSortByFilter] = useState('Date')
    const [holonUserSortOrderFilter, setHolonUserSortOrderFilter] = useState('Descending')
    const [holonUserSearchFilter, setHolonUserSearchFilter] = useState('')
    const [holonUserPaginationLimit, setHolonUserPaginationLimit] = useState(10)
    const [holonUserPaginationOffset, setHolonUserPaginationOffset] = useState(0)
    const [holonUserPaginationHasMore, setHolonUserPaginationHasMore] = useState(true)

    function getHolonData() {
        console.log('HolonContext: getHolonData')
        setHolonContextLoading(true)
        axios.get(config.environmentURL + `/holon-data?handle=${holonHandle}`)
            .then(res => { setHolonData(res.data); setHolonContextLoading(false) })
    }

    function getHolonPosts() {
        console.log(`HolonContext: getHolonPosts (0 to ${holonPostPaginationLimit})`)
        setHolonPostPaginationHasMore(true)
        axios.get(config.environmentURL + 
            `/holon-posts?accountId=${isLoggedIn ? accountData.id : null
            }&handle=${holonHandle
            }&timeRange=${holonPostTimeRangeFilter
            }&postType=${holonPostTypeFilter
            }&sortBy=${holonPostSortByFilter
            }&sortOrder=${holonPostSortOrderFilter
            }&depth=${holonPostDepthFilter
            }&searchQuery=${holonPostSearchFilter
            }&limit=${holonPostPaginationLimit
            }&offset=0`)
            .then(res => {
                if (res.data.posts.length < holonPostPaginationLimit) { setHolonPostPaginationHasMore(false) }
                setHolonPosts(res.data.posts)
                setTotalMatchingPosts(res.data.totalMatchingPosts)
                setHolonPostPaginationOffset(holonPostPaginationLimit)
            })
    }

    function getNextHolonPosts() {
        if (holonPostPaginationHasMore) {
            console.log(`HolonContext: getNextHolonPosts (${holonPostPaginationOffset} to ${holonPostPaginationOffset + holonPostPaginationLimit})`)
            axios.get(config.environmentURL + 
                `/holon-posts?accountId=${isLoggedIn ? accountData.id : null
                }&handle=${holonHandle
                }&timeRange=${holonPostTimeRangeFilter
                }&postType=${holonPostTypeFilter
                }&sortBy=${holonPostSortByFilter
                }&sortOrder=${holonPostSortOrderFilter
                }&depth=${holonPostDepthFilter
                }&searchQuery=${holonPostSearchFilter
                }&limit=${holonPostPaginationLimit
                }&offset=${holonPostPaginationOffset}`)
                .then(res => { 
                    if (res.data.posts.length < holonPostPaginationLimit) { setHolonPostPaginationHasMore(false) }
                    setHolonPosts([...holonPosts, ...res.data.posts])
                    setHolonPostPaginationOffset(holonPostPaginationOffset + holonPostPaginationLimit)
                })
        }
    }

    function getAllHolonPosts() {
        console.log(`HolonContext: getAllHolonPosts`)
        //setHolonPostPaginationHasMore(true)
        axios.get(config.environmentURL + 
            `/holon-posts?accountId=${isLoggedIn ? accountData.id : null
            }&handle=${holonHandle
            }&timeRange=${holonPostTimeRangeFilter
            }&postType=${holonPostTypeFilter
            }&sortBy=${holonPostSortByFilter
            }&sortOrder=${holonPostSortOrderFilter
            }&depth=${holonPostDepthFilter
            }&searchQuery=${holonPostSearchFilter
            }&limit=${totalMatchingPosts
            }&offset=0`)
            .then(res => {
                setHolonPostPaginationHasMore(false)
                setHolonPosts(res.data.posts)
                setTotalMatchingPosts(res.data.totalMatchingPosts)
                setHolonPostPaginationOffset(res.data.posts.length)
            })
    }

    function getHolonSpaces() {
        console.log(`HolonContext: getHolonSpaces (0 to ${holonSpacePaginationLimit})`)
        setHolonSpacePaginationHasMore(true)
        axios.get(config.environmentURL + 
            `/holon-spaces?accountId=${isLoggedIn ? accountData.id : null
            }&handle=${holonHandle
            }&timeRange=${holonSpaceTimeRangeFilter
            }&spaceType=${holonSpaceTypeFilter
            }&sortBy=${holonSpaceSortByFilter
            }&sortOrder=${holonSpaceSortOrderFilter
            }&depth=${holonSpaceDepthFilter
            }&searchQuery=${holonSpaceSearchFilter
            }&limit=${holonSpacePaginationLimit
            }&offset=0`)
            .then(res => {
                if (res.data.length < holonSpacePaginationLimit) { setHolonSpacePaginationHasMore(false) }
                setHolonSpaces(res.data)
                setHolonSpacePaginationOffset(holonPostPaginationLimit)
            })
    }

    function getNextHolonSpaces() {
        if (holonSpacePaginationOffset > 0 && holonSpacePaginationHasMore) {
            console.log(`HolonContext: getNextHolonSpaces (${holonSpacePaginationOffset} to ${holonSpacePaginationOffset + holonSpacePaginationLimit})`)
            axios.get(config.environmentURL + 
                `/holon-spaces?accountId=${isLoggedIn ? accountData.id : null
                }&handle=${holonHandle
                }&timeRange=${holonSpaceTimeRangeFilter
                }&postType=${holonSpaceTypeFilter
                }&sortBy=${holonSpaceSortByFilter
                }&sortOrder=${holonSpaceSortOrderFilter
                }&depth=${holonSpaceDepthFilter
                }&searchQuery=${holonSpaceSearchFilter
                }&limit=${holonSpacePaginationLimit
                }&offset=${holonSpacePaginationOffset}`)
                .then(res => { 
                    if (res.data.length < holonSpacePaginationLimit) { setHolonSpacePaginationHasMore(false) }
                    setHolonSpaces([...holonSpaces, ...res.data])
                    setHolonSpacePaginationOffset(holonSpacePaginationOffset + holonSpacePaginationLimit)
                })
        }
    }

    let queryPath
    if (holonData && holonData.id === 1) { queryPath = 'all-users' } else { queryPath = 'holon-users' }

    function getHolonUsers() {
        console.log(`HolonContext: getHolonUsers (0 to ${holonUserPaginationLimit})`)
        setHolonUserPaginationHasMore(true)
        axios.get(config.environmentURL + 
            `/${queryPath}?accountId=${isLoggedIn ? accountData.id : null
            }&holonId=${holonData.id
            }&timeRange=${holonUserTimeRangeFilter
            }&spaceType=${holonUserTypeFilter
            }&sortBy=${holonUserSortByFilter
            }&sortOrder=${holonUserSortOrderFilter
            }&searchQuery=${holonUserSearchFilter
            }&limit=${holonUserPaginationLimit
            }&offset=0`)
            .then(res => {
                if (res.data.length < holonUserPaginationLimit) { setHolonUserPaginationHasMore(false) }
                setHolonUsers(res.data)
                setHolonUserPaginationOffset(holonUserPaginationLimit)
            })
    }

    function getNextHolonUsers() {
        if (holonUserPaginationHasMore) {
            console.log(`HolonContext: getNextHolonUsers (${holonUserPaginationOffset} to ${holonUserPaginationOffset + holonUserPaginationLimit})`)
            axios.get(config.environmentURL + 
                `/${queryPath}?accountId=${isLoggedIn ? accountData.id : null
                }&holonId=${holonData.id
                }&timeRange=${holonUserTimeRangeFilter
                }&postType=${holonUserTypeFilter
                }&sortBy=${holonUserSortByFilter
                }&sortOrder=${holonUserSortOrderFilter
                }&searchQuery=${holonUserSearchFilter
                }&limit=${holonUserPaginationLimit
                }&offset=${holonUserPaginationOffset}`)
                .then(res => { 
                    if (res.data.length < holonUserPaginationLimit) { setHolonUserPaginationHasMore(false) }
                    setHolonUsers([...holonUsers, ...res.data])
                    setHolonUserPaginationOffset(holonUserPaginationOffset + holonUserPaginationLimit)
                })
        }
    }

    // TODO: check if below is best approach, could maybe use reset key to re-render component instead
    function resetHolonPostFilters() {
        setHolonPostFiltersOpen(false)
        setHolonPostTimeRangeFilter('All Time')
        setHolonPostTypeFilter('All Types')
        setHolonPostSortByFilter('Likes')
        setHolonPostSortOrderFilter('Descending')
        setHolonPostDepthFilter('All Contained Posts')
        setHolonPostSearchFilter('')
        setHolonPostPaginationLimit(10)
        setHolonPostPaginationOffset(0)
        setHolonPostPaginationHasMore(true)
    }

    function resetHolonSpaceFilters() {
        setHolonSpaceFiltersOpen(false)
        setHolonSpaceTimeRangeFilter('All Time')
        setHolonSpaceTypeFilter('All Types')
        setHolonSpaceSortByFilter('Posts')
        setHolonSpaceSortOrderFilter('Descending')
        setHolonSpaceDepthFilter('All Contained Spaces')
        setHolonSpaceSearchFilter('')
        setHolonSpacePaginationLimit(10)
        setHolonSpacePaginationOffset(0)
        setHolonSpacePaginationHasMore(true)
    }

    function resetHolonUserFilters() {
        setHolonUserFiltersOpen(false)
        setHolonUserTimeRangeFilter('All Time')
        setHolonUserTypeFilter('All Types')
        setHolonUserSortByFilter('Date')
        setHolonUserSortOrderFilter('Descending')
        setHolonUserSearchFilter('')
        setHolonUserPaginationLimit(10)
        setHolonUserPaginationOffset(0)
        setHolonUserPaginationHasMore(true)
    }

    useEffect(() => { //TODO: move to useEffect below?
        resetHolonPostFilters()
        resetHolonSpaceFilters()
        resetHolonUserFilters()
    }, [holonHandle])

    useEffect(() => {
        if (!accountContextLoading) {
            console.log('HolonContext: holonHandle set')
            getHolonData()
        }
    }, [holonHandle, accountData.id])

    useEffect(() => { //TODO: work out why 'isModerator' not always updating after handle change in Settings
        if (accountData && holonData) {
            let accountIsFollowing = accountData.FollowedHolons.some(holon => holon.handle === holonData.handle)
            let accountIsModerator = accountData.ModeratedHolons.some(holon => holon.handle === holonData.handle)
            if (accountIsFollowing) { setIsFollowing(true) } else { setIsFollowing(false) }
            if (accountIsModerator) { setIsModerator(true) } else { setIsModerator(false) }
        }
    }, [holonData, accountData])

    return (
        <HolonContext.Provider value={{
            // state
            holonContextLoading, setHolonContextLoading,
            holonHandle, setHolonHandle,
            holonData, setHolonData,
            isFollowing, setIsFollowing,
            isModerator, setIsModerator,
            selectedHolonSubPage, setSelectedHolonSubPage,

            holonPosts, setHolonPosts,
            totalMatchingPosts, setTotalMatchingPosts,
            holonPostFiltersOpen, setHolonPostFiltersOpen,
            holonPostSearchFilter, setHolonPostSearchFilter,
            holonPostTimeRangeFilter, setHolonPostTimeRangeFilter,
            holonPostTypeFilter, setHolonPostTypeFilter,
            holonPostSortByFilter, setHolonPostSortByFilter,
            holonPostSortOrderFilter, setHolonPostSortOrderFilter,
            holonPostDepthFilter, setHolonPostDepthFilter,
            holonPostPaginationLimit, setHolonPostPaginationLimit,
            holonPostPaginationOffset, setHolonPostPaginationOffset,
            holonPostPaginationHasMore, setHolonPostPaginationHasMore,
            //holonPostViewsOpen, setHolonPostViewsOpen,
            holonPostView, setHolonPostView,

            holonSpaces, setHolonSpaces,
            holonSpaceFiltersOpen, setHolonSpaceFiltersOpen,
            holonSpaceSearchFilter, setHolonSpaceSearchFilter,
            holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter,
            holonSpaceTypeFilter, setHolonSpaceTypeFilter,
            holonSpaceSortByFilter, setHolonSpaceSortByFilter,
            holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter,
            holonSpaceDepthFilter, setHolonSpaceDepthFilter,
            holonSpacePaginationLimit, setHolonSpacePaginationLimit,
            holonSpacePaginationOffset, setHolonSpacePaginationOffset,
            holonSpacePaginationHasMore, setHolonSpacePaginationHasMore,
            holonSpaceView, setHolonSpaceView,

            holonUsers, setHolonUsers,
            holonUserFiltersOpen, setHolonUserFiltersOpen,
            holonUserSearchFilter, setHolonUserSearchFilter,
            holonUserTimeRangeFilter, setHolonUserTimeRangeFilter,
            holonUserTypeFilter, setHolonUserTypeFilter,
            holonUserSortByFilter, setHolonUserSortByFilter,
            holonUserSortOrderFilter, setHolonUserSortOrderFilter,
            holonUserPaginationLimit, setHolonUserPaginationLimit,
            holonUserPaginationOffset, setHolonUserPaginationOffset,
            holonUserPaginationHasMore, setHolonUserPaginationHasMore,

            // functions
            getHolonData,
            getHolonPosts, getNextHolonPosts, getAllHolonPosts,
            getHolonSpaces, getNextHolonSpaces,
            getHolonUsers, getNextHolonUsers,
            // resetHolonPostFilters,
            // resetHolonSpaceFilters,
            // resetHolonUserFilters
        }}>
            {children}
        </HolonContext.Provider>
    )
}

export default HolonContextProvider
