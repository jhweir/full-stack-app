import React, { useContext, useEffect } from 'react'
import post from './Post'

export default function Post() {
    useEffect(() => {
        console.log(post)
    })
    return (
        <div>
            Post title: {post.title}
        </div>
    )
}
