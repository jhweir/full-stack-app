import React, { useContext } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/HolonPagePostsFilters.module.scss'
import DropDownMenu from '../DropDownMenu'

function HolonPagePostsFilters() {
    //const { filtersOpen, setFiltersOpen } = useContext(AccountContext)
    const { holonPostFiltersOpen } = useContext(HolonContext)

    if (holonPostFiltersOpen) {
        return (
            <div className={styles.filters}>
                <DropDownMenu
                    title='Time Range'
                    options={['All Time', 'Last Year', 'Last Month', 'Last Week', 'Last 24 Hours', 'Last Hour']}
                    //defaultOption='All Time'
                />
                <DropDownMenu
                    title='Post Type'
                    options={['All Types', 'Text', 'Poll', 'Task']}
                    //defaultOption='All Types'
                />
                <DropDownMenu
                    title='Sort By'
                    options={['Comments', 'Reactions', 'Likes', 'Hearts', 'Ratings', 'Links']}
                    //defaultOption='Likes'
                />
                <DropDownMenu
                    title='Sort Order'
                    options={['Decending', 'Ascending']}
                    //defaultOption='Ascending'
                />
                {/* <div className='wecoButton' style={{height:30}}>
                    <img className='wecoButtonIcon' src='/icons/sync-alt-solid.svg'/>
                </div> */}
            </div>
        )
    } else { return null }
}

export default HolonPagePostsFilters