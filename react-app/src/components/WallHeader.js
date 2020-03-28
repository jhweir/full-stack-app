import React, { useState, useContext } from 'react';
import WallSearchBar from './WallSearchBar';
import WallFilters from './WallFilters';
import CreatePost from './CreatePost';
import { HolonContext } from '../contexts/HolonContext'

function WallHeader(props) {
    const { isLoading, setIsLoading } = useContext(HolonContext);
    const [modal, setModal] = useState(false);
    

    function toggleModal() {
        setModal(!modal)
    }

    return (
        <>
            <div className="wall-header">
                <WallSearchBar/>
                <button className="button mb-10" onClick={ toggleModal }>Create Post</button>
                {modal && 
                    <CreatePost toggleModal={ toggleModal }/>
                }
                <WallFilters/>
            </div>

            <style jsx="true">{`
                .wall-header {
                    width: 100%;
                    //padding-top: 10px 0;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-wrap: wrap;
                }
            `}</style>
        </>
    )
}

export default WallHeader



// import React, { Component } from 'react';
// import SearchBar from './search-bar';
// import WallFilters from './wall-filters';
// import CreatePostModal from './create-post-modal';
// // import colors from '../tokens/Colors';

// export class WallHeader extends Component {
//     state = {
//         showPostModal: false
//     }
//     showPostModal = () => {
//         this.setState({ showPostModal: true });
//     }
//     hidePostModal = () => {
//         this.setState({ showPostModal: false });
//     }
//     render() {
//         const showHidePostModal = this.state.showPostModal ? {display:"flex"} : {display:"none"};

//         return (
//             <div className="wall-header">

//                 <button className="button" onClick={this.showPostModal}>Create Post</button>

//                 <CreatePostModal posts={this.props.posts} newPost={this.props.newPost} showHidePostModal={showHidePostModal} hidePostModal={this.hidePostModal}/>

//                 <SearchBar searchFilter={this.props.searchFilter}/>

//                 <WallFilters SortById={this.props.SortById} SortByLikes={this.props.SortByLikes}/>

//                 <style jsx="true">{`
//                     .wall-header {
//                         width: 100%;
//                         padding: 10px 0;
//                         display: flex;
//                         flex-direction: row;
//                         align-items: center;
//                         flex-wrap: wrap;
//                     }
//                 `}</style>
//             </div>
//         )
//     }
// }

// export default WallHeader
