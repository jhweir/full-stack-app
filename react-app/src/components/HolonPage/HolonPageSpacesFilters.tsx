import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDownMenu'
import Row from '@components/Row'

const HolonPageSpacesFilters = (): JSX.Element => {
    const { spaceSpacesFilters, updateSpaceSpacesFilter } = useContext(SpaceContext)
    const { sortBy, sortOrder, timeRange, depth } = spaceSpacesFilters
    return (
        <Row wrap>
            <DropDownMenu
                title='Sort By'
                options={[
                    'Followers',
                    'Posts',
                    'Comments',
                    'Date',
                    'Reactions',
                    'Likes',
                    'Ratings',
                ]}
                selectedOption={sortBy}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('sortBy', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('sortOrder', payload)}
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
                setSelectedOption={(payload) => updateSpaceSpacesFilter('timeRange', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Spaces', 'Only Direct Descendants']}
                selectedOption={depth}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('depth', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
        </Row>
    )
}

export default HolonPageSpacesFilters
