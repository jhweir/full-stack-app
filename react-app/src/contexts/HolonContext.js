import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import config from '../Config'

export const HolonContext = createContext()

function HolonContextProvider(props) {
    const [globalData, setGlobalData] = useState({})
    const [holon, setHolon] = useState('') // setHolon passed down to HolonPage which then sets the holon as soon as the page loads
    const [holonData, setHolonData] = useState({})
    // const [posts, setPosts] = useState({})
    // const [childHolons, setChildHolons] = useState({})
    // const [users, setUsers] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    // const [searchFilter, setSearchFilter] = useState('')
    // const [sortBy, setSortBy] = useState('id')

    // Merge all three requests below into a single request for 'LocalContext'

    function getData() {
        axios.get(config.environmentURL + `/data?id=${holon}`)
            .then(res => { 
                setHolonData(res.data)
            })
    }

    // function getGlobalData() {
    //     axios.get(config.environmentURL + '/globalData')
    //         .then(res => { 
    //             setGlobalData(res.data)
    //         })
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

    useEffect(() => {
        if (holon) {
            // await...
            getData()
            // .then()
            setIsLoading(false)
        }
    }, [holon])

    return (
        <HolonContext.Provider value={{ 
            holon,
            setHolon,
            // globalData,
            // posts,
            // setPosts,
            // childHolons,
            // setChildHolons,
            // users,
            // setUsers,
            // searchFilter,
            // setSearchFilter,
            // sortBy,
            // setSortBy,
            // isLoading
        }}>
            {props.children}
        </HolonContext.Provider>
    )
}

export default HolonContextProvider