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
        totalPosts: 0,
        totalSpaces: 0,
        totalUsers: 0,
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
    const { accountData, loggedIn } = useContext(AccountContext)

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
    const [spacePeopleLoading, setSpacePeopleLoading] = useState(false)
    const [nextSpacePeopleLoading, setNextSpacePeopleLoading] = useState(false)

    const [spacePosts, setSpacePosts] = useState<any[]>([])
    const [totalMatchingPosts, setTotalMatchingPosts] = useState(0)
    const [spacePostsFilters, setSpacePostsFilters] = useState(defaults.postFilters)
    const [spacePostsFiltersOpen, setSpacePostsFiltersOpen] = useState(false)
    const [spacePostsPaginationLimit, setSpacePostsPaginationLimit] = useState(10)
    const [spacePostsPaginationOffset, setSpacePostsPaginationOffset] = useState(0)
    const [spacePostsPaginationHasMore, setSpacePostsPaginationHasMore] = useState(true)

    const [spaceSpaces, setSpaceSpaces] = useState<any[]>([])
    const [spaceSpacesFilters, setSpaceSpacesFilters] = useState(defaults.spaceFilters)
    // const [spaceSpacesSearchQuery, setSpaceSpacesSearchQuery] = useState('')
    const [spaceSpacesFiltersOpen, setSpaceSpacesFiltersOpen] = useState(false)
    const [spaceSpacesPaginationLimit, setSpaceSpacesPaginationLimit] = useState(10)
    const [spaceSpacesPaginationOffset, setSpaceSpacesPaginationOffset] = useState(0)
    const [spaceSpacesPaginationHasMore, setSpaceSpacesPaginationHasMore] = useState(true)

    const [spacePeople, setSpacePeople] = useState<any[]>([])
    const [spacePeopleFiltersOpen, setSpacePeopleFiltersOpen] = useState(false)
    const [spacePeopleFilters, setSpacePeopleFilters] = useState(defaults.userFilters)
    const [spacePeoplePaginationLimit, setSpacePeoplePaginationLimit] = useState(10)
    const [spacePeoplePaginationOffset, setSpacePeoplePaginationOffset] = useState(0)
    const [spacePeoplePaginationHasMore, setSpacePeoplePaginationHasMore] = useState(true)

    function getSpaceData(handle, returnFunction) {
        console.log(`SpaceContext: getSpaceData (${handle})`)
        setSpaceDataLoading(true)
        axios.get(`${config.apiURL}/space-data?handle=${handle}`).then((res) => {
            console.log('res.data: ', res.data)
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
                // console.log('posts: ', res.data)
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

    function getSpacePeople(spaceId, offset, limit) {
        console.log(`SpaceContext: getSpacePeople (${offset} to ${offset + limit})`)
        const firstLoad = offset === 0
        if (firstLoad) setSpacePeopleLoading(true)
        else setNextSpacePeopleLoading(true)
        const isRootSpace = spaceId === 1
        axios
            .get(
                /* prettier-ignore */
                `${config.apiURL}/${isRootSpace ? 'all-users' : 'space-users'
                }?accountId=${accountData.id
                }&spaceId=${spaceId
                }&timeRange=${spacePeopleFilters.timeRange
                }&spaceType=${spacePeopleFilters.type
                }&sortBy=${spacePeopleFilters.sortBy
                }&sortOrder=${spacePeopleFilters.sortOrder
                }&searchQuery=${spacePeopleFilters.searchQuery
                }&limit=${limit
                }&offset=${offset}`
            )
            .then((res) => {
                // console.log('res.data: ', res.data)
                setSpacePeople(firstLoad ? res.data : [...spacePeople, ...res.data])
                setSpacePeoplePaginationHasMore(res.data.length === spacePeoplePaginationLimit)
                setSpacePeoplePaginationOffset(offset + spacePeoplePaginationLimit)
                if (firstLoad) setSpacePeopleLoading(false)
                else setNextSpacePeopleLoading(false)
            })
    }

    function updateSpacePostsFilter(key, payload) {
        console.log(`SpaceContext: updateSpacePostsFilter (${key}: ${payload})`)
        setSpacePostsFilters({ ...spacePostsFilters, [key]: payload })
    }

    function updateSpaceSpacesFilter(key, payload) {
        console.log(`SpaceContext: updateSpaceSpacesFilter (${key}: ${payload})`)
        // if search query set, change depth to all contained spaces and vice versa
        if (key === 'searchQuery') {
            setSpaceSpacesFilters({
                ...spaceSpacesFilters,
                [key]: payload,
                depth: payload.length ? 'All Contained Spaces' : 'Only Direct Descendants',
            })
            return
        }
        setSpaceSpacesFilters({ ...spaceSpacesFilters, [key]: payload })
    }

    function updateSpacePeopleFilter(key, payload) {
        console.log(`SpaceContext: updateSpacePeopleFilter (${key}: ${payload})`)
        setSpacePeopleFilters({ ...spacePeopleFilters, [key]: payload })
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

    function resetSpacePeople() {
        console.log('SpaceContext: resetSpacePeople')
        setSpacePeople([])
        setSpacePeoplePaginationLimit(10)
        setSpacePeoplePaginationOffset(0)
        setSpacePeoplePaginationHasMore(true)
    }

    useEffect(() => {
        const following = accountData.FollowedHolons.some((s) => s.handle === spaceData.handle)
        const moderator = accountData.ModeratedHolons.some((s) => s.handle === spaceData.handle)
        setIsFollowing(following)
        setIsModerator(moderator)
    }, [loggedIn, spaceData.id])

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
                spacePeopleLoading,
                nextSpacePeopleLoading,

                spacePosts,
                setSpacePosts,
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

                spacePeople,
                spacePeopleFilters,
                spacePeopleFiltersOpen,
                setSpacePeopleFiltersOpen,
                spacePeoplePaginationLimit,
                spacePeoplePaginationOffset,
                spacePeoplePaginationHasMore,

                getSpaceData,
                getSpacePosts,
                getSpaceSpaces,
                getSpacePeople,

                updateSpacePostsFilter,
                updateSpaceSpacesFilter,
                updateSpacePeopleFilter,
                resetSpaceData,
                resetSpacePosts,
                resetSpaceSpaces,
                resetSpacePeople,
            }}
        >
            {children}
        </SpaceContext.Provider>
    )
}

export default SpaceContextProvider
