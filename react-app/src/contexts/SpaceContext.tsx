import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { ISpaceContext, ISpace, IPost, IUser } from '@src/Interfaces'

export const SpaceContext = createContext<ISpaceContext>({} as ISpaceContext)

const defaults = {
    spaceData: {
        id: null,
        handle: null,
        name: null,
        description: null,
        flagImagePath: null,
        coverImagePath: null,
        createdAt: null,
        total_posts: 0,
        total_spaces: 0,
        total_users: 0,
        Creator: {
            id: null,
            handle: null,
            name: null,
            flagImagePath: null,
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
        sortBy: 'Likes',
        sortOrder: 'Descending',
        timeRange: 'All Time',
        depth: 'Only Direct Descendants',
        searchQuery: '',
        view: 'List',
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
    const { accountData, isLoggedIn } = useContext(AccountContext)

    const [spaceData, setSpaceData] = useState(defaults.spaceData)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isModerator, setIsModerator] = useState(false)
    const [selectedSpaceSubPage, setSelectedSpaceSubPage] = useState('')
    const [fullScreen, setFullScreen] = useState(true)

    // loading state
    const [spaceDataLoading, setSpaceDataLoading] = useState(false)
    const [spacePostsLoading, setSpacePostsLoading] = useState(false)
    const [nextSpacePostsLoading, setNextSpacePostsLoading] = useState(false)
    const [spaceSpacesLoading, setSpaceSpacesLoading] = useState(false)
    const [nextSpaceSpacesLoading, setNextSpaceSpacesLoading] = useState(false)
    const [spaceUsersLoading, setSpaceUsersLoading] = useState(false)
    const [nextSpaceUsersLoading, setNextSpaceUsersLoading] = useState(false)

    const [spacePosts, setSpacePosts] = useState<IPost[]>([])
    const [totalMatchingPosts, setTotalMatchingPosts] = useState(0)
    const [spacePostsFilters, setSpacePostsFilters] = useState(defaults.postFilters)
    const [spacePostsFiltersOpen, setSpacePostsFiltersOpen] = useState(false)
    const [spacePostsPaginationLimit, setSpacePostsPaginationLimit] = useState(10)
    const [spacePostsPaginationOffset, setSpacePostsPaginationOffset] = useState(0)
    const [spacePostsPaginationHasMore, setSpacePostsPaginationHasMore] = useState(true)

    const [spaceSpaces, setSpaceSpaces] = useState<any[]>([])
    const [spaceSpacesFilters, setSpaceSpacesFilters] = useState(defaults.spaceFilters)
    const [spaceSpacesFiltersOpen, setSpaceSpacesFiltersOpen] = useState(false)
    const [spaceSpacesPaginationLimit, setSpaceSpacesPaginationLimit] = useState(10)
    const [spaceSpacesPaginationOffset, setSpaceSpacesPaginationOffset] = useState(0)
    const [spaceSpacesPaginationHasMore, setSpaceSpacesPaginationHasMore] = useState(true)

    const [spaceUsers, setSpaceUsers] = useState<IUser[]>([])
    const [spaceUsersFiltersOpen, setSpaceUsersFiltersOpen] = useState(false)
    const [spaceUsersFilters, setSpaceUsersFilters] = useState(defaults.userFilters)
    const [spaceUsersPaginationLimit, setSpaceUsersPaginationLimit] = useState(10)
    const [spaceUsersPaginationOffset, setSpaceUsersPaginationOffset] = useState(0)
    const [spaceUsersPaginationHasMore, setSpaceUsersPaginationHasMore] = useState(true)

    function getSpaceData(handle, returnFunction) {
        console.log(`SpaceContext: getSpaceData (${handle})`)
        setSpaceDataLoading(true)
        axios.get(`${config.apiURL}/space-data?handle=${handle}`).then((res) => {
            // console.log('res.data: ', res.data)
            setSpaceData(res.data || defaults.spaceData)
            setSpaceDataLoading(false)
            if (returnFunction) returnFunction(res.data.id)
        })
    }

    function getSpacePosts(spaceId, offset, limit) {
        console.log(`SpaceContext: getSpacePosts (${offset} to ${offset + limit})`)
        const firstLoad = offset === 0
        if (firstLoad) setSpacePostsLoading(true)
        else setNextSpacePostsLoading(true)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/space-posts?accountId=${accountData.id
                }&spaceId=${spaceId
                }&timeRange=${spacePostsFilters.timeRange
                }&postType=${spacePostsFilters.type
                }&sortBy=${spacePostsFilters.sortBy
                }&sortOrder=${spacePostsFilters.sortOrder
                }&depth=${spacePostsFilters.depth
                }&searchQuery=${spacePostsFilters.searchQuery
                }&limit=${limit
                }&offset=${offset}`
            )
            .then((res) => {
                console.log('posts: ', res.data)
                setSpacePosts(firstLoad ? res.data.posts : [...spacePosts, ...res.data.posts])
                setTotalMatchingPosts(res.data.totalMatchingPosts)
                // use total matching posts to work out if definitely more
                setSpacePostsPaginationHasMore(res.data.posts.length === spacePostsPaginationLimit)
                setSpacePostsPaginationOffset(offset + spacePostsPaginationLimit)
                if (firstLoad) setSpacePostsLoading(false)
                else setNextSpacePostsLoading(false)
            })
    }

    function getSpaceSpaces(spaceId, offset, limit) {
        console.log(`SpaceContext: getSpaceSpaces (${offset} to ${offset + limit})`)
        const firstLoad = offset === 0
        if (firstLoad) setSpaceSpacesLoading(true)
        else setNextSpaceSpacesLoading(true)
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/space-spaces?accountId=${accountData.id
                }&spaceId=${spaceId
                }&timeRange=${spaceSpacesFilters.timeRange
                }&spaceType=${spaceSpacesFilters.type
                }&sortBy=${spaceSpacesFilters.sortBy
                }&sortOrder=${spaceSpacesFilters.sortOrder
                }&depth=${spaceSpacesFilters.depth
                }&searchQuery=${spaceSpacesFilters.searchQuery
                }&limit=${limit
                }&offset=${offset}`
            )
            .then((res) => {
                setSpaceSpaces(firstLoad ? res.data : [...spaceSpaces, ...res.data])
                setSpaceSpacesPaginationHasMore(res.data.length === spaceSpacesPaginationLimit)
                setSpaceSpacesPaginationOffset(offset + spaceSpacesPaginationLimit)
                if (firstLoad) setSpaceSpacesLoading(false)
                else setNextSpaceSpacesLoading(false)
            })
    }

    function getSpaceUsers(spaceId, offset, limit) {
        console.log(`SpaceContext: getSpaceUsers (${offset} to ${offset + limit})`)
        const firstLoad = offset === 0
        if (firstLoad) setSpaceUsersLoading(true)
        else setNextSpaceUsersLoading(true)
        const isRootSpace = spaceId === 1
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/${isRootSpace ? 'all-users' : 'space-users'
                }?accountId=${accountData.id
                }&spaceId=${spaceId
                }&timeRange=${spaceUsersFilters.timeRange
                }&spaceType=${spaceUsersFilters.type
                }&sortBy=${spaceUsersFilters.sortBy
                }&sortOrder=${spaceUsersFilters.sortOrder
                }&searchQuery=${spaceUsersFilters.searchQuery
                }&limit=${limit
                }&offset=${offset}`
            )
            .then((res) => {
                console.log('res.data: ', res.data)
                setSpaceUsers(firstLoad ? res.data : [...spaceUsers, ...res.data])
                setSpaceUsersPaginationHasMore(res.data.length === spaceUsersPaginationLimit)
                setSpaceUsersPaginationOffset(offset + spaceUsersPaginationLimit)
                if (firstLoad) setSpaceUsersLoading(false)
                else setNextSpaceUsersLoading(false)
            })
    }

    function updateSpacePostsFilter(key, payload) {
        console.log(`SpaceContext: updateSpacePostsFilter (${key}: ${payload})`)
        setSpacePostsFilters({ ...spacePostsFilters, [key]: payload })
    }

    function updateSpaceSpacesFilter(key, payload) {
        console.log(`SpaceContext: updateSpaceSpacesFilter (${key}: ${payload})`)
        // if search query set, also change depth to all contained spaces
        if (key === 'searchQuery' && payload.length) {
            setSpaceSpacesFilters({
                ...spaceSpacesFilters,
                [key]: payload,
                depth: 'All Contained Spaces',
            })
            return
        }
        setSpaceSpacesFilters({ ...spaceSpacesFilters, [key]: payload })
    }

    function updateSpaceUsersFilter(key, payload) {
        console.log(`SpaceContext: updateSpaceUsersFilter (${key}: ${payload})`)
        setSpaceUsersFilters({ ...spaceUsersFilters, [key]: payload })
    }

    function resetSpaceData() {
        console.log('SpaceContext: resetSpaceData')
        setSpaceData(defaults.spaceData)
    }

    function resetSpacePosts() {
        console.log('SpaceContext: resetSpacePosts')
        setSpacePosts([])
        setSpacePostsPaginationLimit(10)
        setSpacePostsPaginationOffset(0)
        setSpacePostsPaginationHasMore(true)
    }

    function resetSpaceSpaces() {
        console.log('SpaceContext: resetSpaceSpaces')
        setSpaceSpaces([])
        setSpaceSpacesPaginationLimit(10)
        setSpaceSpacesPaginationOffset(0)
        setSpaceSpacesPaginationHasMore(true)
    }

    function resetSpaceUsers() {
        console.log('SpaceContext: resetSpaceUsers')
        setSpaceUsers([])
        setSpaceUsersPaginationLimit(10)
        setSpaceUsersPaginationOffset(0)
        setSpaceUsersPaginationHasMore(true)
    }

    useEffect(() => {
        const following = accountData.FollowedHolons.some((s) => s.handle === spaceData.handle)
        const moderator = accountData.ModeratedHolons.some((s) => s.handle === spaceData.handle)
        setIsFollowing(following)
        setIsModerator(moderator)
    }, [isLoggedIn, spaceData.id])

    return (
        <SpaceContext.Provider
            value={{
                spaceData,
                setSpaceData,
                isFollowing,
                setIsFollowing,
                isModerator,
                selectedSpaceSubPage,
                setSelectedSpaceSubPage,
                fullScreen,
                setFullScreen,

                spaceDataLoading,
                spacePostsLoading,
                setSpacePostsLoading,
                nextSpacePostsLoading,
                spaceSpacesLoading,
                nextSpaceSpacesLoading,
                spaceUsersLoading,
                nextSpaceUsersLoading,

                spacePosts,
                totalMatchingPosts,
                spacePostsFilters,
                spacePostsFiltersOpen,
                setSpacePostsFiltersOpen,
                spacePostsPaginationLimit,
                spacePostsPaginationOffset,
                spacePostsPaginationHasMore,

                spaceSpaces,
                setSpaceSpaces,
                spaceSpacesFilters,
                spaceSpacesFiltersOpen,
                setSpaceSpacesFiltersOpen,
                spaceSpacesPaginationLimit,
                spaceSpacesPaginationOffset,
                spaceSpacesPaginationHasMore,

                spaceUsers,
                spaceUsersFilters,
                spaceUsersFiltersOpen,
                setSpaceUsersFiltersOpen,
                spaceUsersPaginationLimit,
                spaceUsersPaginationOffset,
                spaceUsersPaginationHasMore,

                getSpaceData,
                getSpacePosts,
                getSpaceSpaces,
                getSpaceUsers,

                updateSpacePostsFilter,
                updateSpaceSpacesFilter,
                updateSpaceUsersFilter,
                resetSpaceData,
                resetSpacePosts,
                resetSpaceSpaces,
                resetSpaceUsers,
            }}
        >
            {children}
        </SpaceContext.Provider>
    )
}

export default SpaceContextProvider
