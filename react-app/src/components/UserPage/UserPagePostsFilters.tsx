import React, { useContext } from 'react'
import { UserContext } from '@contexts/UserContext'
import DropDownMenu from '@components/DropDown'
import Row from '@components/Row'

const UserPagePostsFilters = (): JSX.Element => {
    const { userPostsFilters, updateUserPostsFilter } = useContext(UserContext)
    const { type, sortBy, sortOrder, timeRange } = userPostsFilters
    // const margin = { margin: '0 20px 10px 0' }

    return (
        <Row style={{ width: '100%' }}>
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Url', 'Glass Bead Game', 'Prism']}
                selectedOption={type}
                setSelectedOption={(value) => updateUserPostsFilter('type', value)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Sort By'
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={sortBy}
                setSelectedOption={(value) => updateUserPostsFilter('sortBy', value)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(value) => updateUserPostsFilter('sortOrder', value)}
                style={{ marginRight: 10 }}
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
                style={{ marginRight: 10 }}
            />
        </Row>
    )
}

export default UserPagePostsFilters
