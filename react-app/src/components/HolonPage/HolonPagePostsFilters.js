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
                    type='holon-posts'
                />
                <DropDownMenu
                    title='Post Type'
                    options={['All Types', 'Text', 'Poll', 'Task']}
                    type='holon-posts'
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    type='holon-posts'
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    type='holon-posts'
                />
            </div>
        )
    } else { return null }
}

export default HolonPagePostsFilters