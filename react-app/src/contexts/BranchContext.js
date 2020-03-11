import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import config from '../Config'

export const BranchContext = createContext()

function BranchContextProvider(props) {
    const [branch, setBranch] = useState('') // setBranch passed down to BranchPage which then sets the branch as soon as the page loads
    const [globalData, setGlobalData] = useState({})
    const [branchData, setBranchData] = useState({})
    const [branchPosts, setBranchPosts] = useState([])
    const [branchBranches, setBranchBranches] = useState([])
    const [branchTags, setBranchTags] = useState([])
    // const [branchUsers, setBranchUsers] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [searchFilter, setSearchFilter] = useState('')
    const [sortBy, setSortBy] = useState('id')

    // Merge all three requests below into a single request for 'LocalContext'

    function getGlobalData() {
        axios.get(config.environmentURL + '/globalData')
            .then(res => { 
                setGlobalData(res.data)
            })
    }

    function getBranchData() {
        axios.get(config.environmentURL + `/branchData?id=${branch}`)
            .then(res => {
                setBranchData(res.data)
            })
    }

    function getBranchContent() {
        axios.get(config.environmentURL + `/branchContent?id=${branch}`)
            .then(res => {
                console.log('res.data: ', res.data)
                setBranchPosts(res.data.Posts)
                setBranchTags(res.data.Branches)
            })
    }

    useEffect(() => {
        if (branch) {
            // await...
            // getLocalContext (encompasing all )?
            
            // getGlobalData()
            // getBranchData()
            // getBranchContent()
            // getBranchPosts()
            // getBranchBranches()
            // .then()
            setIsLoading(false)
        }
    }, [branch])

    return (
        <BranchContext.Provider value={{ 
            setBranch,
            globalData,
            branchData,
            branchPosts,
            branchBranches,
            branchTags,
            getBranchContent,
            searchFilter,
            setSearchFilter,
            sortBy,
            setSortBy,
            isLoading
        }}>
            {props.children}
        </BranchContext.Provider>
    )
}

export default BranchContextProvider