import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDown'
import Row from '@components/Row'

const SpacePagePostsFilters = (): JSX.Element => {
    const { spacePostsFilters, updateSpacePostsFilter } = useContext(SpaceContext)
    const { type, sortBy, sortOrder, timeRange, depth, view } = spacePostsFilters
    return (
        <Row style={{ width: '100%' }}>
            <DropDownMenu
                title='Type'
                options={['All Types', 'Text', 'Url', 'Glass Bead Game', 'Prism']}
                selectedOption={type}
                setSelectedOption={(payload) => updateSpacePostsFilter('type', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title={view === 'Map' ? 'Size By' : 'Sort By'}
                options={['Likes', 'Comments', 'Reposts', 'Ratings', 'Date']}
                selectedOption={sortBy}
                setSelectedOption={(payload) => updateSpacePostsFilter('sortBy', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title={view === 'Map' ? 'Size Order' : 'Order'}
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(payload) => updateSpacePostsFilter('sortOrder', payload)}
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
                setSelectedOption={(payload) => updateSpacePostsFilter('timeRange', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Posts', 'Only Direct Posts']}
                selectedOption={depth}
                setSelectedOption={(payload) => updateSpacePostsFilter('depth', payload)}
                style={{ marginRight: 10 }}
            />
        </Row>
    )
}

export default SpacePagePostsFilters
