import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostsFilters() {
    const { holonPostFiltersOpen } = useContext(HolonContext)

    if (holonPostFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                />
                <DropDownMenu
                    title='Post Type'
                    options={['All Types', 'Text', 'Poll', 'Task']}
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                />
            </div>
        )
    } else { return null }
}

export default HolonPagePostsFilters