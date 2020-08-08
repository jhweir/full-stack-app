import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostsFilters() {
    const {
        holonPostFiltersOpen,
        holonPostTimeRangeFilter, setHolonPostTimeRangeFilter,
        holonPostTypeFilter, setHolonPostTypeFilter,
        holonPostSortByFilter, setHolonPostSortByFilter,
        holonPostSortOrderFilter, setHolonPostSortOrderFilter,
        holonPostScopeFilter, setHolonPostScopeFilter
    } = useContext(HolonContext)

    if (holonPostFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Sort By'
                    options={['Date', 'Comments', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    selectedOption={holonPostSortByFilter}
                    setSelectedOption={setHolonPostSortByFilter}
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    selectedOption={holonPostSortOrderFilter}
                    setSelectedOption={setHolonPostSortOrderFilter}
                />
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    selectedOption={holonPostTimeRangeFilter}
                    setSelectedOption={setHolonPostTimeRangeFilter}
                />
                <DropDownMenu
                    title='Post Type'
                    options={['All Types', 'Text', 'Poll']}
                    selectedOption={holonPostTypeFilter}
                    setSelectedOption={setHolonPostTypeFilter}
                />
                <DropDownMenu
                    title='Depth'
                    options={['All Contained Posts']} // include 'Only Direct Posts To Space'
                    selectedOption={holonPostScopeFilter}
                    setSelectedOption={setHolonPostScopeFilter}
                />
            </div>
        )
    } else { return null }
}

export default HolonPagePostsFilters