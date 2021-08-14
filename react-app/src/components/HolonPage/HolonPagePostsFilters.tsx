import React, { useContext } from 'react'
import { SpaceContext } from '../../contexts/SpaceContext'
import DropDownMenu from '../DropDownMenu'

const HolonPagePostsFilters = (): JSX.Element => {
    const {
        spacePostsTimeRangeFilter,
        setSpacePostsTimeRangeFilter,
        spacePostsTypeFilter,
        setSpacePostsTypeFilter,
        spacePostsSortByFilter,
        setSpacePostsSortByFilter,
        spacePostsSortOrderFilter,
        setSpacePostsSortOrderFilter,
        spacePostsDepthFilter,
        setSpacePostsDepthFilter,
        spacePostsView,
    } = useContext(SpaceContext)

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
                selectedOption={spacePostsTypeFilter}
                setSelectedOption={setSpacePostsTypeFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title={spacePostsView === 'Map' ? 'Size By' : 'Sort By'}
                options={['Reactions', 'Likes', 'Reposts', 'Ratings', 'Comments', 'Date']}
                selectedOption={spacePostsSortByFilter}
                setSelectedOption={setSpacePostsSortByFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title={spacePostsView === 'Map' ? 'Size Order' : 'Sort Order'}
                options={['Descending', 'Ascending']}
                selectedOption={spacePostsSortOrderFilter}
                setSelectedOption={setSpacePostsSortOrderFilter}
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
                selectedOption={spacePostsTimeRangeFilter}
                setSelectedOption={setSpacePostsTimeRangeFilter}
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
                selectedOption={spacePostsDepthFilter}
                setSelectedOption={setSpacePostsDepthFilter}
                orientation='vertical'
            />
        </div>
    )
}

export default HolonPagePostsFilters
