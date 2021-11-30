import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDownMenu'
import Row from '@components/Row'

const HolonPageUsersFilters = (): JSX.Element => {
    const { spaceUsersFilters, updateSpaceUsersFilter } = useContext(SpaceContext)
    const { sortBy, sortOrder, timeRange } = spaceUsersFilters

    return (
        <Row wrap>
            <DropDownMenu
                title='Sort By'
                options={['Posts', 'Comments', 'Date']}
                selectedOption={sortBy}
                setSelectedOption={(payload) => updateSpaceUsersFilter('sortBy', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(payload) => updateSpaceUsersFilter('sortOrder', payload)}
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
                setSelectedOption={(payload) => updateSpaceUsersFilter('timeRange', payload)}
                orientation='vertical'
                style={{ margin: '0 20px 10px 0' }}
            />
        </Row>
    )
}

export default HolonPageUsersFilters
