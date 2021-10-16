import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDownMenu'

const HolonPageUsersFilters = (): JSX.Element => {
    const { spaceUsersFilters, updateSpaceUsersFilter } = useContext(SpaceContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Posts', 'Comments', 'Date']}
                selectedOption={spaceUsersFilters.sortBy}
                setSelectedOption={(payload) => updateSpaceUsersFilter('sortBy', payload)}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={spaceUsersFilters.sortOrder}
                setSelectedOption={(payload) => updateSpaceUsersFilter('sortOrder', payload)}
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
                selectedOption={spaceUsersFilters.timeRange}
                setSelectedOption={(payload) => updateSpaceUsersFilter('timeRange', payload)}
                orientation='vertical'
            />
        </div>
    )
}

export default HolonPageUsersFilters
