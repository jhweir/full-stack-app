import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPageSpacesFilters() {
    const {
        holonSpaceFiltersOpen,
        holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter,
        holonSpaceSortByFilter, setHolonSpaceSortByFilter,
        holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter,
        holonSpaceScopeFilter, setHolonSpaceScopeFilter,
    } = useContext(HolonContext)

    if (holonSpaceFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Sort By'
                    options={['Followers', 'Posts', 'Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    selectedOption={holonSpaceSortByFilter}
                    setSelectedOption={setHolonSpaceSortByFilter}
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    selectedOption={holonSpaceSortOrderFilter}
                    setSelectedOption={setHolonSpaceSortOrderFilter}
                />
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    selectedOption={holonSpaceTimeRangeFilter}
                    setSelectedOption={setHolonSpaceTimeRangeFilter}
                />
                <DropDownMenu
                    title='Depth'
                    options={['All Contained Spaces', 'Only Direct Descendants']}
                    selectedOption={holonSpaceScopeFilter}
                    setSelectedOption={setHolonSpaceScopeFilter}
                />
            </div>
        )
    } else { return null }
}

export default HolonPageSpacesFilters