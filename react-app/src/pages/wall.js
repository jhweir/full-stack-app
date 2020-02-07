import React from 'react'
import Post from '.././components/post'

import WallHeader from '../components/wall-header';

import MyContext from '../components/MyContext';

function Wall(props) {
    return (
        <div className="wall">
            <style jsx="true">{`
                .wall {
                    width: 600px;
                    padding: 0 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .wall-list {
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

export default Wall();

// class wall extends React.Component {
//     static contextType = MyContext;

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
//         // let filteredPosts = this.context.posts;
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
//         // let contextTest = this.context;

//         return (

//             <div className="wall">
//                 <MyContext.Consumer>
//                     { context => (context)  }
//                 </MyContext.Consumer>
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
