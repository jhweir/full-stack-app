
import React, { createContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import config from '../Config'

export const HolonContext = createContext()

function HolonContextProvider(props) {
    const [renderKey, setRenderKey] = useState(0)

    const [globalData, setGlobalData] = useState({})
    const [holonData, setHolonData] = useState({
        DirectChildHolons: [],
        DirectParentHolons: [],
        Posts: []
    })
    const [searchFilter, setSearchFilter] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [isLoading, setIsLoading] = useState(false)

    function updateHolonContext(holonHandle) {
        setIsLoading(true)
        const getGlobalData = axios.get(config.environmentURL + '/getGlobalData')
        const getHolonData = axios.get(config.environmentURL + `/getHolonData?id=${holonHandle}`)
        const demoDelay = new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        Promise.all([getGlobalData, getHolonData, demoDelay]).then((values) => {
            setGlobalData(values[0].data)
            setHolonData(values[1].data)
            setIsLoading(false)
            console.log('updateHolonContext function run...')
        })
    }

    return (
        <HolonContext.Provider key={renderKey} value={{ 
            holonData,
            globalData,
            updateHolonContext,
            searchFilter,
            setSearchFilter,
            sortBy,
            setSortBy,
            isLoading,
            setIsLoading
        }}>
            {props.children}
        </HolonContext.Provider>
    )
}

export default HolonContextProvider

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


    // function getGlobalData() {
    //     axios.get(config.environmentURL + '/getGlobalData').then(res => { 
    //         setGlobalData(res.data)
    //     })
    // }

    // async function getAllData() {
    //     getData()
    //     getGlobalData()
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
    // const getGlobalData = axios.get(config.environmentURL + '/getGlobalData')
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