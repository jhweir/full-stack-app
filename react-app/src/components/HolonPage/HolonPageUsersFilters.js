import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPageUsersFilters() {
    const { holonUserFiltersOpen } = useContext(HolonContext)

    if (holonUserFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    type='holon-users'
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Posts', 'Comments', 'Date']}
                    type='holon-users'
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    type='holon-users'
                />
            </div>
        )
    } else { return null }
}

export default HolonPageUsersFilters