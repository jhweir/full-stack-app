import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import config from '../Config'

export const PostContext = createContext()

function PostContextProvider(props) {
    const [posts, setPosts] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [isLoading, setisLoading] = useState(true)

    function getPosts() {
        axios.get(config.environmentURL)
            .then(res => { 
                setPosts(res.data)
                setisLoading(false)
            })
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <PostContext.Provider value={{ posts, searchFilter, setSearchFilter, sortBy, setSortBy, getPosts, isLoading }}>
            {props.children}
        </PostContext.Provider>
    )
}

export default PostContextProvider;