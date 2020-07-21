import React, { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPagePostFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function UserPagePostFilters() {
    const { createdPostFiltersOpen } = useContext(UserContext)

    if (createdPostFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    type='user-posts'
                />
                <DropDownMenu
                    title='Post Type'
                    options={['All Types', 'Text', 'Poll', 'Task']}
                    type='user-posts'
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Comments', 'Date', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    type='user-posts'
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Descending', 'Ascending']}
                    type='user-posts'
                />
            </div>
        )
    } else { return null }
}

export default UserPagePostFilters