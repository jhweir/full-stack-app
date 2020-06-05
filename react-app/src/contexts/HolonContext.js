import React, { createContext, useState } from 'react'
import axios from 'axios'
import config from '../Config'

export const HolonContext = createContext()

function HolonContextProvider(props) {
    const [globalData, setGlobalData] = useState({})
    const [holonData, setHolonData] = useState({
        DirectChildHolons: [],
        DirectParentHolons: [],
    })
    const [holonPosts, setHolonPosts] = useState([])
    const [postSearchFilter, setPostSearchFilter] = useState('')
    const [postSortByFilter, setPostSortByFilter] = useState('reactions')
    const [holonSearchFilter, setHolonSearchFilter] = useState('')
    const [holonSortByFilter, setHolonSortByFilter] = useState('date')
    const [isLoading, setIsLoading] = useState(false)

    //TODO: create seperate functions for updating globalData, holonData, and holonPosts

    function updateHolonContext(holonHandle) {
        setIsLoading(true)
        const getGlobalData = axios.get(config.environmentURL + '/global-data') //remove getGlobalData and move to seperate function (or context)?
        const getHolonData = axios.get(config.environmentURL + `/holon-data?handle=${holonHandle}`)
        const getHolonPosts = axios.get(config.environmentURL + `/holon-posts?handle=${holonHandle}`)
        // const demoDelay = new Promise((resolve) => { setTimeout(resolve, 1000) })
        Promise.all([getGlobalData, getHolonData, getHolonPosts]).then((values) => {
            setGlobalData(values[0].data)
            setHolonData(values[1].data)
            setHolonPosts(values[2].data)
            setIsLoading(false)
            console.log('HolonContext updated')
        })
    }

    return (
        <HolonContext.Provider value={{
            globalData,
            holonData,
            holonPosts,
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
            setIsLoading
        }}>
            {props.children}
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