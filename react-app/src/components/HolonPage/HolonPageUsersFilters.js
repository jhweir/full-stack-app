import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPageUsersFilters() {
    const {
        holonUserFiltersOpen,
        holonUserTimeRangeFilter, setHolonUserTimeRangeFilter,
        holonUserSortByFilter, setHolonUserSortByFilter,
        holonUserSortOrderFilter, setHolonUserSortOrderFilter
    } = useContext(HolonContext)

    if (holonUserFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    selectedOption={holonUserTimeRangeFilter}
                    setSelectedOption={setHolonUserTimeRangeFilter}
                />
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
            </div>
        )
    } else { return null }
}

export default HolonPageUsersFilters