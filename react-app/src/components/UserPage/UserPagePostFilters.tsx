import React, { useContext } from 'react'
import { UserContext } from '@contexts/UserContext'
import DropDownMenu from '@components/DropDownMenu'

const UserPagePostFilters = (): JSX.Element => {
    const { userPostsFilters, updateUserPostsFilter } = useContext(UserContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Post Type'
                options={[
                    'All Types',
                    'Text',
                    'Url',
                    // 'Poll',
                    'Glass Bead Game',
                    // 'Decision Tree',
                    // 'Plot Graph',
                    'Prism',
                ]}
                selectedOption={userPostsFilters.type}
                setSelectedOption={(value) => updateUserPostsFilter('type', value)}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort By'
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={userPostsFilters.sortBy}
                setSelectedOption={(value) => updateUserPostsFilter('sortBy', value)}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={userPostsFilters.sortOrder}
                setSelectedOption={(value) => updateUserPostsFilter('sortOrder', value)}
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
                selectedOption={userPostsFilters.timeRange}
                setSelectedOption={(value) => updateUserPostsFilter('timeRange', value)}
                orientation='vertical'
            />
        </div>
    )
}

export default UserPagePostFilters
