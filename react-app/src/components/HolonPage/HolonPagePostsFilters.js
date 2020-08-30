import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostsFilters() {
    const {
        holonPostTimeRangeFilter, setHolonPostTimeRangeFilter,
        holonPostTypeFilter, setHolonPostTypeFilter,
        holonPostSortByFilter, setHolonPostSortByFilter,
        holonPostSortOrderFilter, setHolonPostSortOrderFilter,
        holonPostDepthFilter, setHolonPostDepthFilter
    } = useContext(HolonContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Total Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={holonPostSortByFilter}
                setSelectedOption={setHolonPostSortByFilter}
            />
            <DropDownMenu
                title='Sort Order'
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
                options={['All Types', 'Text', 'Poll', 'Url']}
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
