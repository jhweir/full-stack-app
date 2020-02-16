import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import config from '../Config'

export const PostContext = createContext()

function PostContextProvider(props) {
    const [posts, setPosts] = useState([])
    const [allBranchNames, setAllBranchNames] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [isLoading, setIsLoading] = useState(true)

    function getAllPosts() {
        axios.get(config.environmentURL)
            .then(res => { 
                setPosts(res.data)
                setIsLoading(false)
            })
    }

    function getAllBranchNames() {
        axios.get(config.environmentURL + '/all_branch_names')
            .then(res => { 
                setAllBranchNames(res.data)
                // setAllBranchNames(res.data.map((branch) => {
                //     return branch.name
                // }))
            })
    }

    useEffect(() => {
        getAllPosts()
        getAllBranchNames()
    }, [])

    return (
        <PostContext.Provider value={{ posts, searchFilter, setSearchFilter, sortBy, setSortBy, getAllPosts, allBranchNames, isLoading }}>
            {props.children}
        </PostContext.Provider>
    )
}

export default PostContextProvider;