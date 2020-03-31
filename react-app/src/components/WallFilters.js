import React, { useState, useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'

function WallFilters() {
    const { holonData, updateHolonContext, setPostSortByFilter } = useContext(HolonContext);
    const [dropdown, setDropdown] = useState(false)

    function updateFilter(filter) {
        setDropdown(!dropdown)
        setPostSortByFilter(filter)
        //updateHolonContext(holonData.handle)
    }
    
    return (
        <>
            <div className="wall-filters">
                <button className="button mb-10" onClick={() => setDropdown(!dropdown)}>Filters</button>
                {dropdown && 
                    <div className="dropdown-content">
                        <div className="dropdown-title">Sort by:</div>
                        <div className="dropdown-item" onClick={ () => updateFilter('reactions') }>Reactions</div>
                        <div className="dropdown-item" onClick={ () => updateFilter('likes') }>Likes</div>
                        <div className="dropdown-item" onClick={ () => updateFilter('date') }>Date</div>
                        <div className="dropdown-item" onClick={ () => updateFilter('comments') }>Comments</div>
                    </div>
                }
            </div>

            <style jsx="true">{`
                .wall-filters {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .dropdown-content {
                    width: 200px;
                    padding: 10px;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
                    position: absolute;
                    top: 60px;
                    left: calc(50% - 70px);
                    z-index: 5;
                }
                .dropdown-title {
                    font-weight: 800;
                    width: 100%;
                    text-align: center;
                    margin: 5px 0;
                }
                .dropdown-item {
                    height: 40px;
                    border-radius: 5px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
                .dropdown-item:hover {
                    background-color: #eee;
                }
            `}</style>
        </>
    )
}

export default WallFilters



// import React, { Component } from 'react'
// // import colors from '../tokens/Colors';

// export class WallFilters extends Component {
//     state = {
//         dropdownVisible: false
//     }

//     dropdownToggle = () => this.setState({ dropdownVisible: !this.state.dropdownVisible })
    

//     render() {
//         return (
//             <div className="wall-filters">
//                 {/* <button className="button" onClick={this.props.SortById}>
//                     Sort By ID
//                 </button>
//                 <button className="button" onClick={this.props.SortByLikes}>
//                     Sort By Likes
//                 </button> */}

//                 <button className="button" onClick={this.dropdownToggle}>
//                     Filters
//                 </button>
//                 <div className={"dropdown-content " + (this.state.dropdownVisible ? 'visible' : '')}>
//                     <div className="dropdown-item" onClick={this.props.SortById}>Sort by ID</div>
//                     <div className="dropdown-item" onClick={this.props.SortByLikes}>Sort by Likes</div>
//                 </div>

//                 <style jsx="true">{`
//                     .wall-filters {
//                         display: flex;
//                         flex-direction: row;
//                         align-items: center;
//                     }
//                     .dropdown-content {
//                         display: none;
//                         width: 200px;
//                         border-radius: 5px;
//                         background-color: white;
//                         box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.2);
//                         position: absolute;
//                         top: 130px;
//                         left: calc(50% - 20px)
//                     }
//                     .dropdown-item {
//                         height: 40px;
//                         border-radius: 5px;
//                         display: flex;
//                         flex-direction: row;
//                         align-items: center;
//                         justify-content: center;
//                     }
//                     .dropdown-item:hover {
//                         background-color: #eee;
//                     }
//                     .visible {
//                         display: block;
//                     }

//                 `}</style>
//             </div>
//         )
//     }
// }

// export default WallFilters
