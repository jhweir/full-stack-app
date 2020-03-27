import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import Post from './Post'
import WallHeader from './WallHeader'
import WallPlaceholder from './WallPlaceholder'
import {
    BrowserRouter,
    Link,
    Route,
    Switch,
    withRouter
  } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function Wall() {
    const { holonData, searchFilter, sortBy, isLoading, setIsLoading } = useContext(HolonContext)
    const posts = holonData.Posts

    const [inVariable, setInVariable] = useState(true)

        // Filter posts by search text (todo: also remove pinned and hidden posts)
        let filteredPosts = posts.filter(post => {
            return post.title.includes(searchFilter) //&& post.visible === true //&& post.pins == null && post.visible === true
        })

        // // Sort posts by Likes
        // if (sortBy === 'likes') {
        //     filteredPosts.sort((a, b) => b.likes - a.likes)
        // }

        // // Sort posts by Date
        // if (sortBy === 'date') {
        //     filteredPosts.sort((a, b) => b.date - a.date)
        // }

        // // Sort posts by Comments
        // if (sortBy === 'comments') {
        //     filteredPosts.sort((a, b) => b.comments - a.comments)
        // }

        // // Pinned posts
        // let pinnedPosts = posts.filter((post) => {
        //     return post.pins === 'Global wall' && post.visible === true
        // })

    return (
        <>
            <div className="wall">
                <WallHeader />
                <WallPlaceholder />
                <ul className={"posts " + (!isLoading ? 'visible' : '')}>
                    {filteredPosts.map((post, index) =>
                        <CSSTransition key={index}  in={!isLoading} timeout={2000} classNames="contentFade" appear>
                            <Post post={post} index={index} isLoading={isLoading}/>
                        </CSSTransition>
                    )} 
                </ul>
            </div>

            <style jsx="true">{`
                .wall {
                    width: 700px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .posts {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .pinned-posts {
                    padding: 0;
                    width: 100%;
                }
                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    )
}

export default Wall

{/* <ul className="pinned-posts">
    {holonData && pinnedPosts.map((post, index) => 
        <Post
            post={post}
            index={index}
            key={post.id}
            isLoading={isLoading}
        /> 
    )}
</ul> */}