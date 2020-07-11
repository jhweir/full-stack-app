import React, { useState, useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/HolonPagePostsFilters.module.scss'

function HolonPagePostsFilters() {
    const { 
        //holonData,
        //updateHolonContext,
        setPostSortByFilter
    } = useContext(HolonContext)
    const [dropdown, setDropdown] = useState(false)

    function updateFilter(filter) {
        setDropdown(!dropdown)
        setPostSortByFilter(filter)
        //updateHolonContext(holonData.handle)
    }
    
    return (
        <div className={styles.wallFilters}>
            <button className="button mb-10" onClick={() => setDropdown(!dropdown)}>Filters</button>
            {dropdown && 
                <div className={styles.dropDownContent}>
                    <div className={styles.dropDownTitle}>Sort by:</div>
                    <div className={styles.dropDownItem} onClick={ () => updateFilter('reactions') }>Reactions</div>
                    <div className={styles.dropDownItem} onClick={ () => updateFilter('likes') }>Likes</div>
                    <div className={styles.dropDownItem} onClick={ () => updateFilter('hearts') }>Hearts</div>
                    <div className={styles.dropDownItem} onClick={ () => updateFilter('date') }>Date</div>
                    <div className={styles.dropDownItem} onClick={ () => updateFilter('comments') }>Comments</div>
                </div>
            }
        </div>
    )
}

export default HolonPagePostsFilters



// import React, { Component } from 'react'
// // import colors from '../tokens/Colors';

// export class HolonPagePostsFilters extends Component {
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

// export default HolonPagePostsFilters
