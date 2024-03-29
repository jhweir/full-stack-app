import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { ISpaceContext, ISpace, ISpaceHighlights, IPost, IUser } from '@src/Interfaces'

export const SpaceContext = createContext<ISpaceContext>({} as ISpaceContext)

const defaults = {
    spaceData: {
        id: null,
        handle: '',
        name: '',
        description: '',
        flagImagePath: '',
        coverImagePath: '',
        createdAt: '',
        total_posts: 0,
        total_spaces: 0,
        total_users: 0,
        Creator: {
            id: null,
            handle: '',
            name: '',
            flagImagePath: '',
        },
        DirectChildHolons: [],
        DirectParentHolons: [],
        HolonHandles: [],
    },
    postFilters: {
        type: 'All Types',
        sortBy: 'Date',
        sortOrder: 'Descending',
        timeRange: 'All Time',
        depth: 'All Contained Posts',
        searchQuery: '',
        view: 'List',
    },
    spaceFilters: {
        type: 'All Types',
        sortBy: 'Posts',
        sortOrder: 'Descending',
        timeRange: 'All Time',
        depth: 'Only Direct Descendants',
        searchQuery: '',
        view: 'Map',
    },
    userFilters: {
        type: 'All Types',
        sortBy: 'Date',
        sortOrder: 'Descending',
        timeRange: 'All Time',
        searchQuery: '',
    },
}

function SpaceContextProvider({ children }: { children: JSX.Element }): JSX.Element {
    const { accountDataLoading, accountData, isLoggedIn } = useContext(AccountContext)

    const [spaceHandle, setSpaceHandle] = useState('')
    const [spaceData, setSpaceData] = useState(defaults.spaceData)
    const [spaceHighlights, setSpaceHighlights] = useState<Partial<ISpaceHighlights>>({})
    const [isFollowing, setIsFollowing] = useState(false)
    const [isModerator, setIsModerator] = useState(false)
    const [selectedSpaceSubPage, setSelectedSpaceSubPage] = useState('')
    const [fullScreen, setFullScreen] = useState(true)

    // TODO: split spaceContextLoading into holonDataLoading, spacePostsLoading, spaceSpacesLoading, spaceUsersLoading
    const [spaceContextLoading, setSpaceContextLoading] = useState(true)

    const [spacePosts, setSpacePosts] = useState<IPost[]>([])
    const [totalMatchingPosts, setTotalMatchingPosts] = useState(0)
    // const [spacePostsFilters, setSpacePostsFilters] = useState(defaults.postFilters)
    const [spacePostsFiltersOpen, setSpacePostsFiltersOpen] = useState(false)
    const [spacePostsTimeRangeFilter, setSpacePostsTimeRangeFilter] = useState('All Time')
    const [spacePostsTypeFilter, setSpacePostsTypeFilter] = useState('All Types')
    const [spacePostsSortByFilter, setSpacePostsSortByFilter] = useState('Date')
    const [spacePostsSortOrderFilter, setSpacePostsSortOrderFilter] = useState('Descending')
    const [spacePostsDepthFilter, setSpacePostsDepthFilter] = useState('All Contained Posts')
    const [spacePostsSearchFilter, setSpacePostsSearchFilter] = useState('')
    const [spacePostsView, setSpacePostsView] = useState('List')
    const [spacePostsPaginationLimit, setSpacePostsPaginationLimit] = useState(10)
    const [spacePostsPaginationOffset, setSpacePostsPaginationOffset] = useState(0)
    const [spacePostsPaginationHasMore, setSpacePostsPaginationHasMore] = useState(true)

    const [spaceSpaces, setSpaceSpaces] = useState<ISpace[]>([])
    // const [spaceSpacesFilters, setSpaceSpacesFilters] = useState(defaults.spaceFilters)
    const [spaceSpacesFiltersOpen, setSpaceSpacesFiltersOpen] = useState(false)
    const [spaceSpacesTimeRangeFilter, setSpaceSpacesTimeRangeFilter] = useState('All Time')
    const [spaceSpacesTypeFilter, setSpaceSpacesTypeFilter] = useState('All Types')
    const [spaceSpacesSortByFilter, setSpaceSpacesSortByFilter] = useState('Posts')
    const [spaceSpacesSortOrderFilter, setSpaceSpacesSortOrderFilter] = useState('Descending')
    const [spaceSpacesDepthFilter, setSpaceSpacesDepthFilter] = useState('Only Direct Descendants') // 'All Contained Spaces'
    const [spaceSpacesSearchFilter, setSpaceSpacesSearchFilter] = useState('')
    const [spaceSpacesView, setSpaceSpacesView] = useState('Map')
    const [spaceSpacesPaginationLimit, setSpaceSpacesPaginationLimit] = useState(10)
    const [spaceSpacesPaginationOffset, setSpaceSpacesPaginationOffset] = useState(0)
    const [spaceSpacesPaginationHasMore, setSpaceSpacesPaginationHasMore] = useState(true)

    const [spaceUsers, setSpaceUsers] = useState<IUser[]>([])
    const [spaceUsersFiltersOpen, setSpaceUsersFiltersOpen] = useState(false)
    // const [spaceUsersFilters, setSpaceUsersFilters] = useState(defaults.userFilters)
    const [spaceUsersTimeRangeFilter, setSpaceUsersTimeRangeFilter] = useState('All Time')
    const [spaceUsersTypeFilter, setSpaceUsersTypeFilter] = useState('All Types')
    const [spaceUsersSortByFilter, setSpaceUsersSortByFilter] = useState('Date')
    const [spaceUsersSortOrderFilter, setSpaceUsersSortOrderFilter] = useState('Descending')
    const [spaceUsersSearchFilter, setSpaceUsersSearchFilter] = useState('')
    const [spaceUsersPaginationLimit, setSpaceUsersPaginationLimit] = useState(10)
    const [spaceUsersPaginationOffset, setSpaceUsersPaginationOffset] = useState(0)
    const [spaceUsersPaginationHasMore, setSpaceUsersPaginationHasMore] = useState(true)

    function getSpaceData() {
        console.log('SpaceContext: getSpaceData')
        setSpaceContextLoading(true)
        axios.get(`${config.apiURL}/holon-data?handle=${spaceHandle}`).then((res) => {
            setSpaceData(res.data)
            console.log('spaceData: ', res.data)
            setSpaceContextLoading(false)
        })
    }

    function getSpaceHighlights() {
        console.log('SpaceContext: getSpaceHighlights')
        axios
            .get(`${config.apiURL}/holon-highlights?id=${spaceData.id}`)
            .then((res) => setSpaceHighlights(res.data))
    }

    function getSpacePosts() {
        console.log(`SpaceContext: getSpacePosts (0 to ${spacePostsPaginationLimit})`)
        setSpacePostsPaginationHasMore(true)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/holon-posts?accountId=${isLoggedIn ? accountData.id : null
                }&handle=${spaceHandle
                }&timeRange=${spacePostsTimeRangeFilter
                }&postType=${spacePostsTypeFilter
                }&sortBy=${spacePostsSortByFilter
                }&sortOrder=${spacePostsSortOrderFilter
                }&depth=${spacePostsDepthFilter
                }&searchQuery=${spacePostsSearchFilter
                }&limit=${spacePostsPaginationLimit
                }&offset=0`
            )
            .then((res) => {
                if (res.data.posts.length < spacePostsPaginationLimit)
                    setSpacePostsPaginationHasMore(false)
                setSpacePosts(res.data.posts)
                setTotalMatchingPosts(res.data.totalMatchingPosts)
                setSpacePostsPaginationOffset(spacePostsPaginationLimit)
            })
    }

    function getNextSpacePosts() {
        if (spacePosts.length && spacePostsPaginationHasMore) {
            console.log(
                `SpaceContext: getNextSpacePosts (${spacePostsPaginationOffset} to ${
                    spacePostsPaginationOffset + spacePostsPaginationLimit
                })`
            )
            axios
                .get(
                    /* prettier-ignore */
                    `${config.apiURL}/holon-posts?accountId=${isLoggedIn ? accountData.id : null
                    }&handle=${spaceHandle
                    }&timeRange=${spacePostsTimeRangeFilter
                    }&postType=${spacePostsTypeFilter
                    }&sortBy=${spacePostsSortByFilter
                    }&sortOrder=${spacePostsSortOrderFilter
                    }&depth=${spacePostsDepthFilter
                    }&searchQuery=${spacePostsSearchFilter
                    }&limit=${spacePostsPaginationLimit
                    }&offset=${spacePostsPaginationOffset}`
                )
                .then((res) => {
                    if (res.data.posts.length < spacePostsPaginationLimit)
                        setSpacePostsPaginationHasMore(false)
                    setSpacePosts([...spacePosts, ...res.data.posts])
                    setSpacePostsPaginationOffset(
                        spacePostsPaginationOffset + spacePostsPaginationLimit
                    )
                })
        }
    }

    function getAllPosts() {
        console.log(`SpaceContext: getAllPosts`)
        // setSpacePostsPaginationHasMore(true)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/holon-posts?accountId=${isLoggedIn ? accountData.id : null
                }&handle=${spaceHandle
                }&timeRange=${spacePostsTimeRangeFilter
                }&postType=${spacePostsTypeFilter
                }&sortBy=${spacePostsSortByFilter
                }&sortOrder=${spacePostsSortOrderFilter
                }&depth=${spacePostsDepthFilter
                }&searchQuery=${spacePostsSearchFilter
                }&limit=${totalMatchingPosts
                }&offset=0`
            )
            .then((res) => {
                setSpacePostsPaginationHasMore(false)
                setSpacePosts(res.data.posts)
                setTotalMatchingPosts(res.data.totalMatchingPosts)
                setSpacePostsPaginationOffset(res.data.posts.length)
            })
    }

    function getSpaceSpaces() {
        console.log(`SpaceContext: getSpaceSpaces (0 to ${spaceSpacesPaginationLimit})`)
        setSpaceSpacesPaginationHasMore(true)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/holon-spaces?accountId=${isLoggedIn ? accountData.id : null
                }&spaceId=${spaceData.id
                }&timeRange=${spaceSpacesTimeRangeFilter
                }&spaceType=${spaceSpacesTypeFilter
                }&sortBy=${spaceSpacesSortByFilter
                }&sortOrder=${spaceSpacesSortOrderFilter
                }&depth=${spaceSpacesDepthFilter
                }&searchQuery=${spaceSpacesSearchFilter
                }&limit=${spaceSpacesPaginationLimit
                }&offset=0`
            )
            .then((res) => {
                // console.log(res.data)
                if (res.data.length < spaceSpacesPaginationLimit)
                    setSpaceSpacesPaginationHasMore(false)
                setSpaceSpaces(res.data)
                setSpaceSpacesPaginationOffset(spaceSpacesPaginationLimit)
            })
    }

    function getNextSpaceSpaces() {
        if (spaceSpacesPaginationOffset > 0 && spaceSpacesPaginationHasMore) {
            console.log(
                `SpaceContext: getNextSpaceSpaces (${spaceSpacesPaginationOffset} to ${
                    spaceSpacesPaginationOffset + spaceSpacesPaginationLimit
                })`
            )
            axios
                .get(
                    /* prettier-ignore */
                    `${config.apiURL}/holon-spaces?accountId=${isLoggedIn ? accountData.id : null
                    }&spaceId=${spaceData.id
                    }&timeRange=${spaceSpacesTimeRangeFilter
                    }&postType=${spaceSpacesTypeFilter
                    }&sortBy=${spaceSpacesSortByFilter
                    }&sortOrder=${spaceSpacesSortOrderFilter
                    }&depth=${spaceSpacesDepthFilter
                    }&searchQuery=${spaceSpacesSearchFilter
                    }&limit=${spaceSpacesPaginationLimit
                    }&offset=${spaceSpacesPaginationOffset}`
                )
                .then((res) => {
                    if (res.data.length < spaceSpacesPaginationLimit)
                        setSpaceSpacesPaginationHasMore(false)
                    setSpaceSpaces([...spaceSpaces, ...res.data])
                    setSpaceSpacesPaginationOffset(
                        spaceSpacesPaginationOffset + spaceSpacesPaginationLimit
                    )
                })
        }
    }

    let queryPath
    if (spaceData && spaceData.id === 1) {
        queryPath = 'all-users'
    } else {
        queryPath = 'holon-users'
    }

    function getSpaceUsers() {
        console.log(`SpaceContext: getSpaceUsers (0 to ${spaceUsersPaginationLimit})`)
        setSpaceUsersPaginationHasMore(true)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/${queryPath}?accountId=${isLoggedIn ? accountData.id : null
                }&spaceId=${spaceData.id
                }&timeRange=${spaceUsersTimeRangeFilter
                }&spaceType=${spaceUsersTypeFilter
                }&sortBy=${spaceUsersSortByFilter
                }&sortOrder=${spaceUsersSortOrderFilter
                }&searchQuery=${spaceUsersSearchFilter
                }&limit=${spaceUsersPaginationLimit
                }&offset=0`
            )
            .then((res) => {
                if (res.data.length < spaceUsersPaginationLimit)
                    setSpaceUsersPaginationHasMore(false)
                setSpaceUsers(res.data)
                setSpaceUsersPaginationOffset(spaceUsersPaginationLimit)
            })
    }

    function getNextSpaceUsers() {
        if (spaceUsersPaginationHasMore) {
            console.log(
                `SpaceContext: getNextSpaceUsers (${spaceUsersPaginationOffset} to ${
                    spaceUsersPaginationOffset + spaceUsersPaginationLimit
                })`
            )
            axios
                .get(
                    /* prettier-ignore */
                    `${config.apiURL}/${queryPath}?accountId=${isLoggedIn ? accountData.id : null
                    }&holonId=${spaceData.id
                    }&timeRange=${spaceUsersTimeRangeFilter
                    }&postType=${spaceUsersTypeFilter
                    }&sortBy=${spaceUsersSortByFilter
                    }&sortOrder=${spaceUsersSortOrderFilter
                    }&searchQuery=${spaceUsersSearchFilter
                    }&limit=${spaceUsersPaginationLimit
                    }&offset=${spaceUsersPaginationOffset}`
                )
                .then((res) => {
                    if (res.data.length < spaceUsersPaginationLimit)
                        setSpaceUsersPaginationHasMore(false)
                    setSpaceUsers([...spaceUsers, ...res.data])
                    setSpaceUsersPaginationOffset(
                        spaceUsersPaginationOffset + spaceUsersPaginationLimit
                    )
                })
        }
    }

    // TODO: check if below is best approach, could maybe use reset key to re-render component instead
    function resetSpacePostFilters() {
        setSpacePostsFiltersOpen(false)
        setSpacePostsTimeRangeFilter('All Time')
        setSpacePostsTypeFilter('All Types')
        setSpacePostsSortByFilter('Date')
        setSpacePostsSortOrderFilter('Descending')
        setSpacePostsDepthFilter('All Contained Posts')
        setSpacePostsSearchFilter('')
        setSpacePostsPaginationLimit(10)
        setSpacePostsPaginationOffset(0)
        setSpacePostsPaginationHasMore(true)
    }

    // function resetSpaceSpaceFilters() {
    //     setSpaceSpacesFiltersOpen(false)
    //     setSpaceSpacesTimeRangeFilter('All Time')
    //     setSpaceSpacesTypeFilter('All Types')
    //     setSpaceSpacesSortByFilter('Posts')
    //     setSpaceSpacesSortOrderFilter('Descending')
    //     setSpaceSpacesDepthFilter('All Contained Spaces')
    //     setSpaceSpacesSearchFilter('')
    //     setSpaceSpacesPaginationLimit(10)
    //     setSpaceSpacesPaginationOffset(0)
    //     setSpaceSpacesPaginationHasMore(true)
    // }

    function resetSpaceUserFilters() {
        setSpaceUsersFiltersOpen(false)
        setSpaceUsersTimeRangeFilter('All Time')
        setSpaceUsersTypeFilter('All Types')
        setSpaceUsersSortByFilter('Date')
        setSpaceUsersSortOrderFilter('Descending')
        setSpaceUsersSearchFilter('')
        setSpaceUsersPaginationLimit(10)
        setSpaceUsersPaginationOffset(0)
        setSpaceUsersPaginationHasMore(true)
    }

    useEffect(() => {
        // TODO: move to useEffect below?
        resetSpacePostFilters()
        // resetSpaceSpaceFilters()
        resetSpaceUserFilters()
    }, [spaceHandle])

    useEffect(() => {
        if (!accountDataLoading) {
            getSpaceData()
        }
    }, [spaceHandle, accountData.id])

    // useEffect(() => {
    //     if (spaceSpacesSearchFilter.length) {
    //         setSpaceSpacesDepthFilter('All Contained Spaces')
    //     }
    // }, [spaceSpacesSearchFilter])

    useEffect(() => {
        // TODO: work out why 'isModerator' not always updating after handle change in Settings
        if (accountData && spaceData) {
            const accountIsFollowing = accountData.FollowedHolons.some(
                (holon) => holon.handle === spaceData.handle
            )
            const accountIsModerator = accountData.ModeratedHolons.some(
                (holon) => holon.handle === spaceData.handle
            )
            if (accountIsFollowing) {
                setIsFollowing(true)
            } else {
                setIsFollowing(false)
            }
            if (accountIsModerator) {
                setIsModerator(true)
            } else {
                setIsModerator(false)
            }
        }
    }, [spaceData, accountData])

    return (
        <SpaceContext.Provider
            value={{
                spaceContextLoading,
                spaceHandle,
                spaceData,
                spaceHighlights,
                isFollowing,
                isModerator,
                selectedSpaceSubPage,
                fullScreen,

                spacePosts,
                totalMatchingPosts,
                spacePostsFiltersOpen,
                spacePostsSearchFilter,
                spacePostsTimeRangeFilter,
                spacePostsTypeFilter,
                spacePostsSortByFilter,
                spacePostsSortOrderFilter,
                spacePostsDepthFilter,
                spacePostsPaginationLimit,
                spacePostsPaginationOffset,
                spacePostsPaginationHasMore,
                spacePostsView,

                spaceSpaces,
                spaceSpacesFiltersOpen,
                spaceSpacesSearchFilter,
                spaceSpacesTimeRangeFilter,
                spaceSpacesTypeFilter,
                spaceSpacesSortByFilter,
                spaceSpacesSortOrderFilter,
                spaceSpacesDepthFilter,
                spaceSpacesPaginationLimit,
                spaceSpacesPaginationOffset,
                spaceSpacesPaginationHasMore,
                spaceSpacesView,

                spaceUsers,
                spaceUsersFiltersOpen,
                spaceUsersSearchFilter,
                spaceUsersTimeRangeFilter,
                spaceUsersTypeFilter,
                spaceUsersSortByFilter,
                spaceUsersSortOrderFilter,
                spaceUsersPaginationLimit,
                spaceUsersPaginationOffset,
                spaceUsersPaginationHasMore,

                setSpaceContextLoading,
                setSpaceHandle,
                setSpaceData,
                setSpaceHighlights,
                setIsFollowing,
                setIsModerator,
                setSelectedSpaceSubPage,
                setFullScreen,

                setSpacePosts,
                setTotalMatchingPosts,
                setSpacePostsFiltersOpen,
                setSpacePostsSearchFilter,
                setSpacePostsTimeRangeFilter,
                setSpacePostsTypeFilter,
                setSpacePostsSortByFilter,
                setSpacePostsSortOrderFilter,
                setSpacePostsDepthFilter,
                setSpacePostsPaginationLimit,
                setSpacePostsPaginationOffset,
                setSpacePostsPaginationHasMore,
                setSpacePostsView,

                setSpaceSpaces,
                setSpaceSpacesFiltersOpen,
                setSpaceSpacesSearchFilter,
                setSpaceSpacesTimeRangeFilter,
                setSpaceSpacesTypeFilter,
                setSpaceSpacesSortByFilter,
                setSpaceSpacesSortOrderFilter,
                setSpaceSpacesDepthFilter,
                setSpaceSpacesPaginationLimit,
                setSpaceSpacesPaginationOffset,
                setSpaceSpacesPaginationHasMore,
                setSpaceSpacesView,

                setSpaceUsers,
                setSpaceUsersFiltersOpen,
                setSpaceUsersSearchFilter,
                setSpaceUsersTimeRangeFilter,
                setSpaceUsersTypeFilter,
                setSpaceUsersSortByFilter,
                setSpaceUsersSortOrderFilter,
                setSpaceUsersPaginationLimit,
                setSpaceUsersPaginationOffset,
                setSpaceUsersPaginationHasMore,

                getSpaceData,
                getSpaceHighlights,
                getSpacePosts,
                getNextSpacePosts,
                getAllPosts,
                getSpaceSpaces,
                getNextSpaceSpaces,
                getSpaceUsers,
                getNextSpaceUsers,
            }}
        >
            {children}
        </SpaceContext.Provider>
    )
}

export default SpaceContextProvider
