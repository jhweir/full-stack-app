import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const HolonContext = createContext()

function HolonContextProvider({ children }) {
    const { accountContextLoading, accountData } = useContext(AccountContext)

    const [holonContextLoading, setHolonContextLoading] = useState(true)
    const [holonHandle, setHolonHandle] = useState('')
    const [holonData, setHolonData] = useState({ DirectChildHolons: [], DirectParentHolons: [], HolonHandles: [] })
    const [isFollowing, setIsFollowing] = useState(false)
    const [isModerator, setIsModerator] = useState(false)
    const [selectedHolonSubPage, setSelectedHolonSubPage] = useState('')

    const [holonSpaces, setHolonSpaces] = useState([])
    const [holonSpacePaginationLimit, setHolonSpacePaginationLimit] = useState(5)
    const [holonSpacePaginationOffset, setHolonSpacePaginationOffset] = useState(0)
    const [holonSpacePaginationHasMore, setHolonSpacePaginationHasMore] = useState(true)
    const [holonSpaceFiltersOpen, setHolonSpaceFiltersOpen] = useState(false)
    const [holonSpaceSearchFilter, setHolonSpaceSearchFilter] = useState('')
    const [holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter] = useState('All Time')
    const [holonSpaceTypeFilter, setHolonSpaceTypeFilter] = useState('All Types')
    const [holonSpaceSortByFilter, setHolonSpaceSortByFilter] = useState('Posts')
    const [holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter] = useState('Descending')

    const [holonPosts, setHolonPosts] = useState([])
    const [holonPostPaginationLimit, setHolonPostPaginationLimit] = useState(5)
    const [holonPostPaginationOffset, setHolonPostPaginationOffset] = useState(0)
    const [holonPostPaginationHasMore, setHolonPostPaginationHasMore] = useState(true)
    const [holonPostFiltersOpen, setHolonPostFiltersOpen] = useState(false)
    const [holonPostSearchFilter, setHolonPostSearchFilter] = useState('')
    const [holonPostTimeRangeFilter, setHolonPostTimeRangeFilter] = useState('All Time')
    const [holonPostTypeFilter, setHolonPostTypeFilter] = useState('All Types')
    const [holonPostSortByFilter, setHolonPostSortByFilter] = useState('Likes')
    const [holonPostSortOrderFilter, setHolonPostSortOrderFilter] = useState('Descending')

    const [holonUsers, setHolonUsers] = useState([])
    const [holonUserPaginationLimit, setHolonUserPaginationLimit] = useState(9)
    const [holonUserPaginationOffset, setHolonUserPaginationOffset] = useState(0)
    const [holonUserPaginationHasMore, setHolonUserPaginationHasMore] = useState(true)
    const [holonUserFiltersOpen, setHolonUserFiltersOpen] = useState(false)
    const [holonUserSearchFilter, setHolonUserSearchFilter] = useState('')
    const [holonUserTimeRangeFilter, setHolonUserTimeRangeFilter] = useState('All Time')
    const [holonUserTypeFilter, setHolonUserTypeFilter] = useState('All Types')
    const [holonUserSortByFilter, setHolonUserSortByFilter] = useState('Date')
    const [holonUserSortOrderFilter, setHolonUserSortOrderFilter] = useState('Descending')

    function getHolonData() {
        console.log('HolonContext: getHolonData')
        setHolonContextLoading(true)
        axios.get(config.environmentURL + `/holon-data?handle=${holonHandle}`)
            .then(res => { setHolonData(res.data); setHolonContextLoading(false) })
    }

    function getHolonPosts() {
        setHolonPostPaginationHasMore(true)
        console.log(`HolonContext: getHolonPosts (0 to ${holonPostPaginationLimit})`)
        axios.get(config.environmentURL + 
            `/holon-posts?userId=${accountData.id ? accountData.id : null
            }&handle=${holonHandle
            }&timeRange=${holonPostTimeRangeFilter
            }&postType=${holonPostTypeFilter
            }&sortBy=${holonPostSortByFilter
            }&sortOrder=${holonPostSortOrderFilter
            }&searchQuery=${holonPostSearchFilter
            }&limit=${holonPostPaginationLimit
            }&offset=0`)
            .then(res => { 
                setHolonPosts(res.data)
                setHolonPostPaginationOffset(holonPostPaginationLimit)
            })
    }

    function getNextHolonPosts() {
        if (holonPostPaginationHasMore) {
            console.log(`HolonContext: getNextHolonPosts (${holonPostPaginationOffset} to ${holonPostPaginationOffset + holonPostPaginationLimit})`)
            axios.get(config.environmentURL + 
                `/holon-posts?userId=${accountData.id ? accountData.id : null
                }&handle=${holonHandle
                }&timeRange=${holonPostTimeRangeFilter
                }&postType=${holonPostTypeFilter
                }&sortBy=${holonPostSortByFilter
                }&sortOrder=${holonPostSortOrderFilter
                }&searchQuery=${holonPostSearchFilter
                }&limit=${holonPostPaginationLimit
                }&offset=${holonPostPaginationOffset}`)
                .then(res => { 
                    if (res.data.length < holonPostPaginationLimit) { setHolonPostPaginationHasMore(false) }
                    setHolonPosts([...holonPosts, ...res.data])
                    setHolonPostPaginationOffset(holonPostPaginationOffset + holonPostPaginationLimit)
                })
        }
    }

    function getHolonSpaces() {
        setHolonSpacePaginationHasMore(true)
        console.log(`HolonContext: getHolonSpaces (0 to ${holonSpacePaginationLimit})`)
        axios.get(config.environmentURL + 
            `/holon-spaces?userId=${accountData.id ? accountData.id : null
            }&handle=${holonHandle
            }&timeRange=${holonSpaceTimeRangeFilter
            }&spaceType=${holonSpaceTypeFilter
            }&sortBy=${holonSpaceSortByFilter
            }&sortOrder=${holonSpaceSortOrderFilter
            }&searchQuery=${holonSpaceSearchFilter
            }&limit=${holonSpacePaginationLimit
            }&offset=0`)
            .then(res => { 
                setHolonSpaces(res.data)
                setHolonSpacePaginationOffset(holonPostPaginationLimit)
            })
    }

    function getNextHolonSpaces() {
        if (holonSpacePaginationHasMore) {
            console.log(`HolonContext: getNextHolonSpaces (${holonSpacePaginationOffset} to ${holonSpacePaginationOffset + holonSpacePaginationLimit})`)
            axios.get(config.environmentURL + 
                `/holon-spaces?userId=${accountData.id ? accountData.id : null
                }&handle=${holonHandle
                }&timeRange=${holonSpaceTimeRangeFilter
                }&postType=${holonSpaceTypeFilter
                }&sortBy=${holonSpaceSortByFilter
                }&sortOrder=${holonSpaceSortOrderFilter
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
    if (holonData.id === 1) { queryPath = 'all-users' } else { queryPath = 'holon-users' }

    function getHolonUsers() {
        setHolonUserPaginationHasMore(true)
        console.log(`HolonContext: getHolonUsers (0 to ${holonUserPaginationLimit})`)
        axios.get(config.environmentURL + 
            `/${queryPath}?userId=${accountData.id ? accountData.id : null
            }&holonId=${holonData.id
            }&timeRange=${holonUserTimeRangeFilter
            }&spaceType=${holonUserTypeFilter
            }&sortBy=${holonUserSortByFilter
            }&sortOrder=${holonUserSortOrderFilter
            }&searchQuery=${holonUserSearchFilter
            }&limit=${holonUserPaginationLimit
            }&offset=0`)
            .then(res => { 
                setHolonUsers(res.data)
                setHolonUserPaginationOffset(holonUserPaginationLimit)
            })
    }

    function getNextHolonUsers() {
        if (holonUserPaginationHasMore) {
            console.log(`HolonContext: getNextHolonUsers (${holonUserPaginationOffset} to ${holonUserPaginationOffset + holonUserPaginationLimit})`)
            axios.get(config.environmentURL + 
                `/${queryPath}?userId=${accountData.id ? accountData.id : null
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

    useEffect(() => {
        if (!accountContextLoading) { getHolonData() }
    }, [holonHandle, accountData])

    useEffect(() => {
        if (accountData && holonData) {
            let accountIsFollowing = accountData.FollowedHolons.some(holon => holon.handle === holonData.handle)
            let accountIsModerator = accountData.ModeratedHolons.some(holon => holon.handle === holonData.handle)
            if (accountIsFollowing) { setIsFollowing(true) } else { setIsFollowing(false) }
            if (accountIsModerator) { setIsModerator(true) } else { setIsModerator(false) }
        }
    }, [holonData])

    useEffect(() => {
        setHolonPostFiltersOpen(false)
        setHolonPostTimeRangeFilter('All Time')
        setHolonPostTypeFilter('All Types')
        setHolonPostSortByFilter('Likes')
        setHolonPostSortOrderFilter('Descending')
    }, [holonHandle])

    return (
        <HolonContext.Provider value={{
            holonContextLoading, setHolonContextLoading,
            holonHandle, setHolonHandle,
            holonData, setHolonData, getHolonData,
            isFollowing, setIsFollowing,
            isModerator, setIsModerator,
            selectedHolonSubPage, setSelectedHolonSubPage,

            holonSpaces, setHolonSpaces, getHolonSpaces, getNextHolonSpaces,
            holonSpacePaginationLimit, setHolonSpacePaginationLimit,
            holonSpacePaginationOffset, setHolonSpacePaginationOffset,
            holonSpacePaginationHasMore, setHolonSpacePaginationHasMore,
            holonSpaceFiltersOpen, setHolonSpaceFiltersOpen,
            holonSpaceSearchFilter, setHolonSpaceSearchFilter,
            holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter,
            holonSpaceTypeFilter, setHolonSpaceTypeFilter,
            holonSpaceSortByFilter, setHolonSpaceSortByFilter,
            holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter,

            holonPosts, setHolonPosts, getHolonPosts, getNextHolonPosts,
            holonPostPaginationLimit, setHolonPostPaginationLimit,
            holonPostPaginationOffset, setHolonPostPaginationOffset,
            holonPostPaginationHasMore, setHolonPostPaginationHasMore,
            holonPostFiltersOpen, setHolonPostFiltersOpen,
            holonPostSearchFilter, setHolonPostSearchFilter,
            holonPostTimeRangeFilter, setHolonPostTimeRangeFilter,
            holonPostTypeFilter, setHolonPostTypeFilter,
            holonPostSortByFilter, setHolonPostSortByFilter,
            holonPostSortOrderFilter, setHolonPostSortOrderFilter,

            holonUsers, setHolonUsers, getHolonUsers, getNextHolonUsers,
            holonUserPaginationLimit, setHolonUserPaginationLimit,
            holonUserPaginationOffset, setHolonUserPaginationOffset,
            holonUserPaginationHasMore, setHolonUserPaginationHasMore,
            holonUserFiltersOpen, setHolonUserFiltersOpen,
            holonUserSearchFilter, setHolonUserSearchFilter,
            holonUserTimeRangeFilter, setHolonUserTimeRangeFilter,
            holonUserTypeFilter, setHolonUserTypeFilter,
            holonUserSortByFilter, setHolonUserSortByFilter,
            holonUserSortOrderFilter, setHolonUserSortOrderFilter
        }}>
            {children}
        </HolonContext.Provider>
    )
}

export default HolonContextProvider
