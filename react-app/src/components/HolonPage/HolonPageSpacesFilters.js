import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import DropDownMenu from '../DropDownMenu'

function HolonPageSpacesFilters() {
    const {
        holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter,
        holonSpaceSortByFilter, setHolonSpaceSortByFilter,
        holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter,
        holonSpaceDepthFilter, setHolonSpaceDepthFilter,
    } = useContext(HolonContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Followers', 'Posts', 'Comments', 'Date', 'Reactions', 'Likes', 'Ratings']}
                selectedOption={holonSpaceSortByFilter}
                setSelectedOption={setHolonSpaceSortByFilter}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={holonSpaceSortOrderFilter}
                setSelectedOption={setHolonSpaceSortOrderFilter}
            />
            <DropDownMenu
                title='Time Range'
                options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                selectedOption={holonSpaceTimeRangeFilter}
                setSelectedOption={setHolonSpaceTimeRangeFilter}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Spaces', 'Only Direct Descendants']}
                selectedOption={holonSpaceDepthFilter}
                setSelectedOption={setHolonSpaceDepthFilter}
            />
        </div>
    )
}

export default HolonPageSpacesFilters