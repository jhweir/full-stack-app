import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDownMenu'
import Row from '@components/Row'

const HolonPagePostsFilters = (): JSX.Element => {
    const { spacePostsFilters, updateSpacePostsFilter } = useContext(SpaceContext)
    const { type, sortBy, sortOrder, timeRange, depth, view } = spacePostsFilters
    return (
        <Row wrap>
            <DropDownMenu
                title='Post Type'
                options={['All Types', 'Text', 'Url', 'Glass Bead Game', 'Prism']}
                selectedOption={type}
                setSelectedOption={(payload) => updateSpacePostsFilter('type', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title={view === 'Map' ? 'Size By' : 'Sort By'}
                options={['Likes', 'Comments', 'Reposts', 'Ratings', 'Date']}
                selectedOption={sortBy}
                setSelectedOption={(payload) => updateSpacePostsFilter('sortBy', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title={view === 'Map' ? 'Size Order' : 'Sort Order'}
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(payload) => updateSpacePostsFilter('sortOrder', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
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
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Posts', 'Only Direct Posts']}
                selectedOption={depth}
                setSelectedOption={(payload) => updateSpacePostsFilter('depth', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
        </Row>
    )
}

export default HolonPagePostsFilters
