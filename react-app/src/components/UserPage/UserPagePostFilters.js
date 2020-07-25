import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPagePostFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function UserPagePostFilters() {
    const {
        createdPostFiltersOpen,
        createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter,
        createdPostTypeFilter, setCreatedPostTypeFilter,
        createdPostSortByFilter, setCreatedPostSortByFilter,
        createdPostSortOrderFilter, setCreatedPostSortOrderFilter
    } = useContext(UserContext)

    if (createdPostFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    selectedOption={createdPostTimeRangeFilter}
                    setSelectedOption={setCreatedPostTimeRangeFilter}
                />
                <DropDownMenu
                    title='Post Type'
                    options={['All Types', 'Text', 'Poll', 'Task']}
                    selectedOption={createdPostTypeFilter}
                    setSelectedOption={setCreatedPostTypeFilter}
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    selectedOption={createdPostSortByFilter}
                    setSelectedOption={setCreatedPostSortByFilter}
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    selectedOption={createdPostSortOrderFilter}
                    setSelectedOption={setCreatedPostSortOrderFilter}
                />
            </div>
        )
    } else { return null }
}

export default UserPagePostFilters