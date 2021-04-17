import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import DropDownMenu from '../DropDownMenu'

const UserPagePostFilters = (): JSX.Element => {
    const {
        createdPostTimeRangeFilter,
        createdPostTypeFilter,
        createdPostSortByFilter,
        createdPostSortOrderFilter,
        setCreatedPostTimeRangeFilter,
        setCreatedPostTypeFilter,
        setCreatedPostSortByFilter,
        setCreatedPostSortOrderFilter,
    } = useContext(UserContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={createdPostSortByFilter}
                setSelectedOption={setCreatedPostSortByFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={createdPostSortOrderFilter}
                setSelectedOption={setCreatedPostSortOrderFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Time Range'
                options={[
                    'All Time',
                    'Last Year',
                    'Last Month',
                    'Last Week',
                    'Last 24 Hours',
                    'Last Hour',
                ]}
                selectedOption={createdPostTimeRangeFilter}
                setSelectedOption={setCreatedPostTimeRangeFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Url', 'Poll', 'Glass Bead', 'Plot Graph', 'Prism']}
                selectedOption={createdPostTypeFilter}
                setSelectedOption={setCreatedPostTypeFilter}
                orientation='vertical'
            />
        </div>
    )
}

export default UserPagePostFilters
