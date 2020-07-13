import React, { useState, useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'

function HolonPageSpacesFilters() {
    const { getHolonPosts, setSortBy } = useContext(HolonContext);
    const [dropdown, setDropdown] = useState(false)

    function toggleDropDown() { setDropdown(!dropdown) }

    function sortByLikes() { toggleDropDown(); getHolonPosts(); setSortBy('likes') }
    function sortByDate() { toggleDropDown(); getHolonPosts(); setSortBy('date') }
    function sortByComments() { toggleDropDown(); getHolonPosts(); setSortBy('comments') }
    
    return (
        <>
            <div className="wall-filters">
                <button className="button mb-10" onClick={toggleDropDown}>Filters</button>

                {dropdown && <div className="dropdown-content">
                    <div className="dropdown-item" onClick={ sortByLikes }>Sort by Likes</div>
                    <div className="dropdown-item" onClick={ sortByDate }>Sort by Date</div>
                    <div className="dropdown-item" onClick={ sortByComments }>Sort by Comments</div>
                </div>}
            </div>

            <style jsx="true">{`
                .wall-filters {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .dropdown-content {
                    width: 200px;
                    //padding: 0 30px;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
                    position: absolute;
                    top: 130px;
                    left: calc(50% - 30px);
                    z-index: 1;
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

export default HolonPageSpacesFilters