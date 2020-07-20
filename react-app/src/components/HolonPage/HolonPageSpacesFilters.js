import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPageSpacesFilters() {
    const { holonSpaceFiltersOpen } = useContext(HolonContext)

    if (holonSpaceFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    type='holon-spaces'
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    type='holon-spaces'
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    type='holon-spaces'
                />
            </div>
        )
    } else { return null }
}

export default HolonPageSpacesFilters