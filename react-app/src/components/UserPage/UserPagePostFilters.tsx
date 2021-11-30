import React, { useContext } from 'react'
import { UserContext } from '@contexts/UserContext'
import DropDownMenu from '@components/DropDownMenu'
import Row from '@components/Row'

const UserPagePostFilters = (): JSX.Element => {
    const { userPostsFilters, updateUserPostsFilter } = useContext(UserContext)
    const { type, sortBy, sortOrder, timeRange } = userPostsFilters
    const margin = { margin: '0 20px 10px 0' }

    return (
        <Row wrap>
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Url', 'Glass Bead Game', 'Prism']}
                selectedOption={type}
                setSelectedOption={(value) => updateUserPostsFilter('type', value)}
                orientation='vertical'
                style={margin}
            />
            <DropDownMenu
                title='Sort By'
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={sortBy}
                setSelectedOption={(value) => updateUserPostsFilter('sortBy', value)}
                orientation='vertical'
                style={margin}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(value) => updateUserPostsFilter('sortOrder', value)}
                orientation='vertical'
                style={margin}
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
                selectedOption={timeRange}
                setSelectedOption={(value) => updateUserPostsFilter('timeRange', value)}
                orientation='vertical'
                style={margin}
            />
        </Row>
    )
}

export default UserPagePostFilters
