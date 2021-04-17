import React, { useContext } from 'react'
import { SpaceContext } from '../../contexts/SpaceContext'
import DropDownMenu from '../DropDownMenu'

const HolonPageUsersFilters = (): JSX.Element => {
    const {
        spaceUsersTimeRangeFilter,
        setSpaceUsersTimeRangeFilter,
        spaceUsersSortByFilter,
        setSpaceUsersSortByFilter,
        spaceUsersSortOrderFilter,
        setSpaceUsersSortOrderFilter,
    } = useContext(SpaceContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Posts', 'Comments', 'Date']}
                selectedOption={spaceUsersSortByFilter}
                setSelectedOption={setSpaceUsersSortByFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={spaceUsersSortOrderFilter}
                setSelectedOption={setSpaceUsersSortOrderFilter}
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
                selectedOption={spaceUsersTimeRangeFilter}
                setSelectedOption={setSpaceUsersTimeRangeFilter}
                orientation='vertical'
            />
        </div>
    )
}

export default HolonPageUsersFilters
