import React, { useState, useContext } from 'react';
import HolonPageSpacesSearchBar from './HolonPageSpacesSearchBar';
import HolonPageSpacesFilters from './HolonPageSpacesFilters';
import CreateHolon from './CreateHolon';
import { HolonContext } from '../contexts/HolonContext';

function HolonPageSpacesHeader() {
    const { holonContextLoading, setHolonContextLoading } = useContext(HolonContext);
    const [createHolonModalOpen, setCreateHolonModalOpen] = useState(false);

    // function toggleModal() {
    //     setCreateHolonModalOpen(!createHolonModalOpen)
    // }

    return (
        <>
            <div className="holon-header">
                <HolonPageSpacesSearchBar/>
                <button className="button mb-10" onClick={() => setCreateHolonModalOpen(true) }>Create Space</button>
                {createHolonModalOpen && 
                    <CreateHolon setCreateHolonModalOpen={setCreateHolonModalOpen}/>
                }
                {/* <HolonPageSpacesFilters/> */}
            </div>

            <style jsx="true">{`
                .holon-header {
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

export default HolonPageSpacesHeader



// import React, { Component } from 'react';
// import SearchBar from './search-bar';
// import HolonPagePostsFilters from './wall-filters';
// import CreatePostModal from './create-post-modal';
// // import colors from '../tokens/Colors';

// export class HolonPagePostsHeader extends Component {
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

//                 <HolonPagePostsFilters SortById={this.props.SortById} SortByLikes={this.props.SortByLikes}/>

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

// export default HolonPagePostsHeader
