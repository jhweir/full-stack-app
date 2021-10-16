import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDownMenu'

const HolonPageSpacesFilters = (): JSX.Element => {
    const { spaceSpacesFilters, updateSpaceSpacesFilter } = useContext(SpaceContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={[
                    'Followers',
                    'Posts',
                    'Comments',
                    'Date',
                    'Reactions',
                    'Likes',
                    'Ratings',
                ]}
                selectedOption={spaceSpacesFilters.sortBy}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('sortBy', payload)}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={spaceSpacesFilters.sortOrder}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('sortOrder', payload)}
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
                selectedOption={spaceSpacesFilters.timeRange}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('timeRange', payload)}
                orientation='vertical'
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Spaces', 'Only Direct Descendants']}
                selectedOption={spaceSpacesFilters.depth}
                setSelectedOption={(payload) => updateSpaceSpacesFilter('depth', payload)}
                orientation='vertical'
            />
        </div>
    )
}

export default HolonPageSpacesFilters
