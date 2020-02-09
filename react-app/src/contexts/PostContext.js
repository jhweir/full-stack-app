import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios'
import config from '../config'

export const PostContext = createContext()

function PostContextProvider(props) {
    const [posts, setPosts] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [sortBy, setSortBy] = useState('id')

    function getPosts() {
        axios.get(config.environmentURL) // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
            .then(res => { setPosts(res.data) })
            .then(console.log('posts fetched'))
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <PostContext.Provider value={{ posts, searchFilter, setSearchFilter, sortBy, setSortBy, getPosts }}>
            {props.children}
        </PostContext.Provider>
    )
}

export default PostContextProvider;