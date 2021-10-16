import React, { useContext } from 'react'
import { SpaceContext } from '../../contexts/SpaceContext'
import DropDownMenu from '../DropDownMenu'

const HolonPagePostsFilters = (): JSX.Element => {
    const { spacePostsFilters, updateSpacePostsFilter } = useContext(SpaceContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Post Type'
                options={[
                    'All Types',
                    'Text',
                    'Url',
                    // 'Poll',
                    'Glass Bead Game',
                    // 'Decision Tree',
                    // 'Plot Graph',
                    'Prism',
                ]}
                selectedOption={spacePostsFilters.type}
                setSelectedOption={(payload) => updateSpacePostsFilter('type', payload)}
                orientation='vertical'
            />
            <DropDownMenu
                title={spacePostsFilters.view === 'Map' ? 'Size By' : 'Sort By'}
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={spacePostsFilters.sortBy}
                setSelectedOption={(payload) => updateSpacePostsFilter('sortBy', payload)}
                orientation='vertical'
            />
            <DropDownMenu
                title={spacePostsFilters.view === 'Map' ? 'Size Order' : 'Sort Order'}
                options={['Descending', 'Ascending']}
                selectedOption={spacePostsFilters.sortOrder}
                setSelectedOption={(payload) => updateSpacePostsFilter('sortOrder', payload)}
                orientation='vertical'
            />
            <DropDownMenu
                title='Time Range'
                options={[
                    'All Time',
                    'Last Year',
                    'Last Month',
                    'Last Week',
                    'Last 24 Hours',
                    'Last Hour',
                ]}
                selectedOption={spacePostsFilters.timeRange}
                setSelectedOption={(payload) => updateSpacePostsFilter('timeRange', payload)}
                orientation='vertical'
            />
            {/* <DropDownMenu
                title='Post Type'
                options={[
                    'All Types',
                    'Text',
                    'Url',
                    // 'Poll',
                    'Glass Bead Game',
                    // 'Decision Tree',
                    // 'Plot Graph',
                    'Prism',
                ]}
                selectedOption={spacePostsTypeFilter}
                setSelectedOption={setSpacePostsTypeFilter}
                orientation='vertical'
            /> */}
            <DropDownMenu
                title='Depth'
                options={['All Contained Posts', 'Only Direct Posts']}
                selectedOption={spacePostsFilters.depth}
                setSelectedOption={(payload) => updateSpacePostsFilter('depth', payload)}
                orientation='vertical'
            />
        </div>
    )
}

export default HolonPagePostsFilters
