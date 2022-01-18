import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDown'
import Row from '@components/Row'

const SpacePageSpacesFilters = (): JSX.Element => {
    const { spaceSpacesFilters, updateSpaceSpacesFilter } = useContext(SpaceContext)
    const { sortBy, sortOrder, timeRange, depth } = spaceSpacesFilters
    return (
        <Row style={{ width: '100%' }}>
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
                style={{ marginRight: 10 }}
                // orientation='vertical'
                // style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('sortOrder', payload)}
                style={{ marginRight: 10 }}
                // orientation='vertical'
                // style={{ margin: '0 20px 10px 0' }}
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
                style={{ marginRight: 10 }}
                // orientation='vertical'
                // style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Spaces', 'Only Direct Descendants']}
                selectedOption={depth}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('depth', payload)}
                style={{ marginRight: 10 }}
                // orientation='vertical'
                // style={{ margin: '0 20px 10px 0' }}
            />
        </Row>
    )
}

export default SpacePageSpacesFilters
