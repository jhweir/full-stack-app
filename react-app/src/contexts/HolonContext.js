import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const HolonContext = createContext()

function HolonContextProvider({ children }) {
    const { accountContextLoading, accountData } = useContext(AccountContext)

    const [holonContextLoading, setHolonContextLoading] = useState(true)
    const [holonHandle, setHolonHandle] = useState('')
    const [isFollowing, setIsFollowing] = useState(false)
    const [isModerator, setIsModerator] = useState(false)
    const [selectedHolonSubPage, setSelectedHolonSubPage] = useState('')

    const [holonData, setHolonData] = useState({ DirectChildHolons: [], DirectParentHolons: [], HolonHandles: [] })
    const [holonSpaceSearchFilter, setHolonSpaceSearchFilter] = useState('')
    const [holonSpaceSortByFilter, setHolonSpaceSortByFilter] = useState('date')

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

    const [holonFollowers, setHolonFollowers] = useState([])
    const [holonUserSearchFilter, setHolonUserSearchFilter] = useState('')
    const [holonUserSortByFilter, setHolonUserSortByFilter] = useState('')

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

    function getHolonFollowers() {
        console.log('HolonContext: getHolonFollowers')
        if (holonData.handle === 'root') {
            axios.get(config.environmentURL + `/all-users`)
                .then(res => { setHolonFollowers(res.data) })
        } else {
            axios.get(config.environmentURL + `/holon-followers?holonId=${holonData.id}`)
                .then(res => { setHolonFollowers(res.data) })
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
            isFollowing, setIsFollowing,
            isModerator, setIsModerator,
            selectedHolonSubPage, setSelectedHolonSubPage,

            holonData, getHolonData, setHolonData,
            holonSpaceSearchFilter, setHolonSpaceSearchFilter,
            holonSpaceSortByFilter, setHolonSpaceSortByFilter,

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

            holonFollowers, getHolonFollowers,
            holonUserSearchFilter, setHolonUserSearchFilter,
            holonUserSortByFilter, setHolonUserSortByFilter
        }}>
            {children}
        </HolonContext.Provider>
    )
}

export default HolonContextProvider


    //TODO: create seperate functions for updating globalData, holonData, holonPosts and holonFollowers? Yes!
    // function updateHolonContext(holonHandle) {
    //     // setHolonContextLoading(true)
    //     // const getGlobalData = axios.get(config.environmentURL + '/global-data') //remove getGlobalData and move to seperate function (or context)?
    //     // const getHolonData = axios.get(config.environmentURL + `/holon-data?handle=${holonHandle}`)
    //     // // const getHolonPosts = axios.get(config.environmentURL + `/holon-posts?handle=${holonHandle}&userId=${accountData.id ? accountData.id : null}`)
    //     // // const getHolonUsers = axios.get(config.environmentURL + `/holon-users?handle=${holonHandle}`)
    //     // // const demoDelay = new Promise((resolve) => { setTimeout(resolve, 1000) })
    
    //     // Promise.all([getGlobalData, getHolonData]).then(values => {
    //     //     setGlobalData(values[0].data)
    //     //     setHolonData(values[1].data)
    //     //     // setHolonPosts(values[2].data)
    //     //     //setHolonFollowers(values[3].data)
    //     //     setHolonContextLoading(false)
    //     //     console.log('Holon Context updated')
    //     // })
    // }


    //const [renderKey, setRenderKey] = useState(0)
    //const [holon, setHolon] = useState('') // setHolon passed down as a prop to HolonPage which sets the holon as soon as the page loads

    // function demoAsyncCall() {
    //     return new Promise((resolve) => setTimeout(() => resolve(), 5000));
    // }



    // Merge all three requests below into a single request for 'LocalContext/Data' ?
    // function getData() {
    //     axios.get(config.environmentURL + `/getData?id=${holon}`).then(res => {
    //         setHolonData(res.data)
    //         // setHolonContextLoading(false)
    //     })
    // }
    // const promise3 = new Promise(function(resolve, reject) {
    //     setTimeout(resolve, 100, 'foo');
    //   });


    // function globalData() {
    //     axios.get(config.environmentURL + '/globalData').then(res => { 
    //         setGlobalData(res.data)
    //     })
    // }

    // async function getAllData() {
    //     getData()
    //     globalData()
    // }
    


    // function getBranchData() {
    //     axios.get(config.environmentURL + `/holonData?id=${holon}`)
    //         .then(res => {
    //             setHolonData(res.data)
    //         })
    // }

    // function getBranchContent() {
    //     axios.get(config.environmentURL + `/branchContent?id=${holon}`)
    //         .then(res => {
    //             console.log('res.data: ', res.data)
    //             setHolonPosts(res.data.Posts)
    //             setHolonTags(res.data.Holons)
    //         })
    // }


    //let history = useHistory();

    // function redirectTo(path, handle) {
    //     setHolonContextLoading(true)
    //     setTimeout(() => {
    //         history.push(path)
    //         updateHolonContext(handle)
    //     }, 500)
    // }

    // const getData = axios.get(config.environmentURL + `/getData?id=${holon}`)
    // const globalData = axios.get(config.environmentURL + '/getGlobalData')
    // const demoDelay = new Promise((resolve) => {
    //     setTimeout(resolve, 1000);
    // });
    
    // var updateHolon = new Promise(function(resolve, reject) {
    //     // do a thing, possibly async, then…
      
    //     if (/* everything turned out fine */) {
    //       resolve("Stuff worked!");
    //     }
    //     else {
    //       reject(Error("It broke"));
    //     }
    //   });


        // function updateContext() {
    //     //setRenderKey(renderKey + 1)
    // }

    // useEffect(() => {
    //     updateHolonContext()
    //     console.log('HolonContext UseEffect run...')
    // }, [holon]) //remove holon!