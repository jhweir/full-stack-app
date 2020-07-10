import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import { AccountContext } from './AccountContext'

export const HolonContext = createContext()

function HolonContextProvider({ children }) {
    const { accountData } = useContext(AccountContext)

    const [globalData, setGlobalData] = useState({})
    const [holonData, setHolonData] = useState({
        DirectChildHolons: [],
        DirectParentHolons: []
    })
    const [holonPosts, setHolonPosts] = useState([])
    const [holonUsers, setHolonUsers] = useState([])
    const [postSearchFilter, setPostSearchFilter] = useState('')
    const [postSortByFilter, setPostSortByFilter] = useState('reactions')
    const [holonSearchFilter, setHolonSearchFilter] = useState('')
    const [holonSortByFilter, setHolonSortByFilter] = useState('date')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedHolonSubPage, setSelectedHolonSubPage] = useState('')
    const [isFollowing, setIsFollowing] = useState(false)
    const [isModerator, setIsModerator] = useState(false)

    //TODO: create seperate functions for updating globalData, holonData, and holonPosts?
    function updateHolonContext(holonHandle) {
        setIsLoading(true)
        const getGlobalData = axios.get(config.environmentURL + '/global-data') //remove getGlobalData and move to seperate function (or context)?
        const getHolonData = axios.get(config.environmentURL + `/holon-data?handle=${holonHandle}`)
        const getHolonPosts = axios.get(config.environmentURL + `/holon-posts?handle=${holonHandle}&userId=${accountData.id ? accountData.id : null}`)
        const getHolonUsers = axios.get(config.environmentURL + `/holon-users?handle=${holonHandle}`)
        // const demoDelay = new Promise((resolve) => { setTimeout(resolve, 1000) })
    
        Promise.all([getGlobalData, getHolonData, getHolonPosts, getHolonUsers]).then(values => {
            setGlobalData(values[0].data)
            setHolonData(values[1].data)
            setHolonPosts(values[2].data)
            setHolonUsers(values[3].data)
            setIsLoading(false)
            console.log('Holon Context updated')
        })
    }

    useEffect(() => {
        if (holonData.handle) {
            updateHolonContext(holonData.handle)
            console.log('holon context use effect run')
        }
    }, [accountData])

    useEffect(() => {
        // if (holonData && accountData) {
            // Check if space is followed or moderated by account and set in state
            let accountIsFollowing = accountData && holonData && accountData.FollowedHolons.some(holon => holon.handle === holonData.handle)
            let accountIsModerator = accountData && holonData && accountData.ModeratedHolons.some(holon => holon.handle === holonData.handle)
            if (accountIsFollowing) { setIsFollowing(true) } else { setIsFollowing(false) }
            if (accountIsModerator) { setIsModerator(true) } else { setIsModerator(false) }
        //}
    }, [holonData])

    return (
        <HolonContext.Provider value={{
            globalData,
            holonData,
            holonPosts,
            holonUsers,
            updateHolonContext,
            postSearchFilter,
            setPostSearchFilter,
            postSortByFilter,
            setPostSortByFilter,
            holonSearchFilter,
            setHolonSearchFilter,
            holonSortByFilter,
            setHolonSortByFilter,
            isLoading,
            setIsLoading,
            selectedHolonSubPage,
            setSelectedHolonSubPage,
            isFollowing,
            setIsFollowing,
            isModerator,
            setIsModerator
        }}>
            {children}
        </HolonContext.Provider>
    )
}

export default HolonContextProvider



    //const [renderKey, setRenderKey] = useState(0)
    //const [holon, setHolon] = useState('') // setHolon passed down as a prop to HolonPage which sets the holon as soon as the page loads

    // function demoAsyncCall() {
    //     return new Promise((resolve) => setTimeout(() => resolve(), 5000));
    // }



    // Merge all three requests below into a single request for 'LocalContext/Data' ?
    // function getData() {
    //     axios.get(config.environmentURL + `/getData?id=${holon}`).then(res => {
    //         setHolonData(res.data)
    //         // setIsLoading(false)
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
    //     setIsLoading(true)
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