import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import Post from './Post'
import WallHeader from './WallHeader'
import WallPlaceholder from './WallPlaceholder'

function Wall() {
    const { holonData, postSearchFilter, postSortByFilter, isLoading, setIsLoading } = useContext(HolonContext)
    const posts = holonData.Posts

        // Apply search filter to posts
        let filteredPosts = posts.filter(post => {
            return post.title.includes(postSearchFilter) && post.globalState === 'visible'
            //&& post.pins == null
        })

        // Sort posts by Reactions
        if (postSortByFilter === 'reactions') {
            filteredPosts.sort((a, b) => b.Labels.length - a.Labels.length)
        }

        // Sort posts by Likes
        if (postSortByFilter === 'likes') {
            function findNumberOfLikes(post) { return post.Labels.filter((label) => label.type === 'like').length  }
            filteredPosts.sort((a, b) => findNumberOfLikes(b) - findNumberOfLikes(a))
        }

        // Sort posts by Date
        if (postSortByFilter === 'date') {
            filteredPosts.sort((a, b) => b.createdAt - a.createdAt)
        }

        // Sort posts by Comments
        if (postSortByFilter === 'comments') {
            filteredPosts.sort((a, b) => b.Comments.length - a.Comments.length)
        }

        // // Pinned posts
        // let pinnedPosts = posts.filter((post) => {
        //     return post.pins === 'Global wall' && post.visible === true
        // })

    return (
        <>
            <div className="wall">
                <WallHeader />
                <WallPlaceholder />
                <ul className={"posts " + (isLoading ? 'hidden' : '')}>
                    {filteredPosts.map((post, index) =>
                        // <CSSTransition key={index}  in={!isLoading} timeout={500} classNames="contentFade" appear>
                            <Post post={post} key={post.id} index={index} isLoading={isLoading}/>
                        // </CSSTransition>
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
                    z-index: 1;
                    opacity: 1;
                    transition: all 800ms;
                }
                .posts.hidden {
                    //z-index: 0;
                    opacity: 0;
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