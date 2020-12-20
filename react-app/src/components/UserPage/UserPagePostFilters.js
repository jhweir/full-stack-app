import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import DropDownMenu from '../DropDownMenu'

function UserPagePostFilters() {
    const {
        createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter,
        createdPostTypeFilter, setCreatedPostTypeFilter,
        createdPostSortByFilter, setCreatedPostSortByFilter,
        createdPostSortOrderFilter, setCreatedPostSortOrderFilter
    } = useContext(UserContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={createdPostSortByFilter}
                setSelectedOption={setCreatedPostSortByFilter}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={createdPostSortOrderFilter}
                setSelectedOption={setCreatedPostSortOrderFilter}
            />
            <DropDownMenu
                title='Time Range'
                options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                selectedOption={createdPostTimeRangeFilter}
                setSelectedOption={setCreatedPostTimeRangeFilter}
            />
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Url', 'Poll', 'Glass Bead', 'Plot Graph', 'Prism']}
                selectedOption={createdPostTypeFilter}
                setSelectedOption={setCreatedPostTypeFilter}
            />
        </div>
    )
}

export default UserPagePostFilters