import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import DropDownMenu from '../DropDownMenu'

function HolonPageUsersFilters() {
    const {
        holonUserTimeRangeFilter, setHolonUserTimeRangeFilter,
        holonUserSortByFilter, setHolonUserSortByFilter,
        holonUserSortOrderFilter, setHolonUserSortOrderFilter
    } = useContext(HolonContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Posts', 'Comments', 'Date']}
                selectedOption={holonUserSortByFilter}
                setSelectedOption={setHolonUserSortByFilter}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={holonUserSortOrderFilter}
                setSelectedOption={setHolonUserSortOrderFilter}
            />
            <DropDownMenu
                title='Time Range'
                options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                selectedOption={holonUserTimeRangeFilter}
                setSelectedOption={setHolonUserTimeRangeFilter}
            />
        </div>
    )
}

export default HolonPageUsersFilters