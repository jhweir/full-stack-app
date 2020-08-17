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
                title='Time Range'
                options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                selectedOption={createdPostTimeRangeFilter}
                setSelectedOption={setCreatedPostTimeRangeFilter}
            />
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Poll', 'Url']}
                selectedOption={createdPostTypeFilter}
                setSelectedOption={setCreatedPostTypeFilter}
            />
            <DropDownMenu
                title='Sort By'
                options={['Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                selectedOption={createdPostSortByFilter}
                setSelectedOption={setCreatedPostSortByFilter}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={createdPostSortOrderFilter}
                setSelectedOption={setCreatedPostSortOrderFilter}
            />
        </div>
    )
}

export default UserPagePostFilters