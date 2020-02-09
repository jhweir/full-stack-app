import React, { useContext, useState } from 'react'
import { PostContext } from '../contexts/PostContext'
import Post from '../components/Post'
import WallHeader from '../components/WallHeader';

function Wall() {
    const context = useContext(PostContext);

    // Filter posts by search text
    let filteredPosts = context.posts.filter((post) => {
        return post.title.indexOf(context.searchFilter) !== -1;
    })
    // Sort posts by ID
    // if (context.sortBy === 'id') {
    //     filteredPosts = filteredPosts.sort((a, b) => a.id - b.id)
    // }
    // Sort posts by Likes
    if (context.sortBy === 'likes') {
        filteredPosts = filteredPosts.sort((a, b) => b.likes - a.likes)
    }
    // Sort posts by Date
    if (context.sortBy === 'date') {
        filteredPosts = filteredPosts.sort((a, b) => b.date - a.date)
    }

    return (
        <div className="wall">
            <WallHeader />

            <ul className="posts">
                {/* {filteredPosts.map((post, index) => console.log(post.id, index) )}  */}
                {filteredPosts.map((post, index) => <Post key={post.id} index={index} post={post} getPosts={context.getPosts}/> )} 
            </ul>

            <style jsx="true">{`
                .wall {
                    width: 600px;
                    padding: 0 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .posts {
                    padding: 0;
                    width: 100%;
                }

                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    )
}


export default Wall



// import React from 'react'
// import Post from '.././components/post'

// import WallHeader from '../components/wall-header';

// class wall extends React.Component {
//     state = {
//         searchText: '',
//         sortBy: 'id'
//     }

//     searchFilter = (text) => {
//         console.log(text)
//         this.setState({ searchText: text });
//     }

//     SortById = () => this.setState({ sortBy: 'id' });

//     SortByLikes = () => this.setState({ sortBy: 'likes' });

//     render() {
//         // // Filter out empty posts (TODO: add 'visible' boolean)
//         // let usablePosts = this.props.posts.filter((el) => { return el != null})
//         // // Filter out posts that don't match the search criteria (TODO: create new search queries when users enter search instead of searching existing state)
//         // let filteredPosts = usablePosts.filter((post) => {
//         //     return post.title.indexOf(this.state.searchText) !== -1;
//         // })
//         // // Sort posts by ID
//         // if (this.state.sortBy === 'id') {
//         //     filteredPosts = filteredPosts.sort((a, b) => a.id - b.id)
//         // }
//         // // Sort posts by Likes
//         // if (this.state.sortBy === 'likes') {
//         //     filteredPosts = filteredPosts.sort((a, b) => b.likes - a.likes)
//         // }

//         return (
//             <div className="wall">
//                 <WallHeader posts={this.props.posts} newPost={this.props.newPost} searchFilter={this.searchFilter} SortById={this.SortById} SortByLikes={this.SortByLikes}/>

//                 {/* <ul className="wall-list">
//                     {filteredPosts
//                         .map((post) => {
//                             return <Post key={post.id} post={post} deletePost={this.props.deletePost} addLike={this.props.addLike}/>
//                         })
//                     }
//                 </ul> */}

//                 <style jsx="true">{`
//                     .wall {
//                         width: 600px;
//                         padding: 0 10px;
//                         display: flex;
//                         flex-direction: column;
//                         justify-content: center;
//                         align-items: center;
//                     }

//                     .wall-list {
//                         padding: 0;
//                         width: 100%;
//                     }

//                     @media screen and (max-width: 700px) {
//                         .wall {
//                             width: 100%;
//                         }
//                     }
//                 `}</style>
//             </div>
//         )
//     }
// }

// export default wall
