import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostsFilters() {
    const {
        holonPostTimeRangeFilter, setHolonPostTimeRangeFilter,
        holonPostTypeFilter, setHolonPostTypeFilter,
        holonPostSortByFilter, setHolonPostSortByFilter,
        holonPostSortOrderFilter, setHolonPostSortOrderFilter,
        holonPostDepthFilter, setHolonPostDepthFilter,
        holonPostView
    } = useContext(HolonContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title={holonPostView === 'Map'? 'Size By' : 'Sort By'}
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={holonPostSortByFilter}
                setSelectedOption={setHolonPostSortByFilter}
            />
            <DropDownMenu
                title={holonPostView === 'Map'? 'Size Order' : 'Sort Order'}
                options={['Descending', 'Ascending']}
                selectedOption={holonPostSortOrderFilter}
                setSelectedOption={setHolonPostSortOrderFilter}
            />
            <DropDownMenu
                title='Time Range'
                options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                selectedOption={holonPostTimeRangeFilter}
                setSelectedOption={setHolonPostTimeRangeFilter}
            />
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Url', 'Poll', 'Glass Bead', 'Plot Graph', 'Prism']}
                selectedOption={holonPostTypeFilter}
                setSelectedOption={setHolonPostTypeFilter}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Posts', 'Only Direct Posts']}
                selectedOption={holonPostDepthFilter}
                setSelectedOption={setHolonPostDepthFilter}
            />
        </div>
    )
}

export default HolonPagePostsFilters
