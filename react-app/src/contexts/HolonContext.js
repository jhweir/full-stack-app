import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import config from '../Config'

export const HolonContext = createContext()

function HolonContextProvider(props) {
    const [holon, setHolon] = useState('') // setHolon passed down to HolonPage which then sets the holon as soon as the page loads
    const [renderKey, setRenderKey] = useState(0)
    const [globalData, setGlobalData] = useState({})
    const [holonData, setHolonData] = useState({
        DirectChildHolons: [],
        Posts: []
    })
    const [searchFilter, setSearchFilter] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [isLoading, setIsLoading] = useState(true)

    function updateContext() { 
        setRenderKey(renderKey + 1)
        console.log('reRender function run')
    }

    // Merge all three requests below into a single request for 'LocalContext' ?
    function getData() {
        axios.get(config.environmentURL + `/getData?id=${holon}`).then(res => {
            setHolonData(res.data)
            setIsLoading(false)
        })
    }

    function getGlobalData() {
        axios.get(config.environmentURL + '/getGlobalData').then(res => { 
            setGlobalData(res.data)
        })
    }

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

    useEffect(() => {
        if (holon) {
            getGlobalData()
            getData()
        }
    }, [holon])

    return (
        <HolonContext.Provider key={renderKey} value={{ 
            holon,
            setHolon,
            holonData,
            updateContext,
            getData,
            //getChildHolons,
            globalData,
            // posts,
            // setPosts,
            // childHolons,
            // setChildHolons,
            // users,
            // setUsers,
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