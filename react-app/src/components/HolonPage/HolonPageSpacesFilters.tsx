import React, { useContext } from 'react'
import { SpaceContext } from '../../contexts/SpaceContext'
import DropDownMenu from '../DropDownMenu'

const HolonPageSpacesFilters = (): JSX.Element => {
    const {
        spaceSpacesTimeRangeFilter,
        spaceSpacesSortByFilter,
        spaceSpacesSortOrderFilter,
        spaceSpacesDepthFilter,
        setSpaceSpacesTimeRangeFilter,
        setSpaceSpacesSortByFilter,
        setSpaceSpacesSortOrderFilter,
        setSpaceSpacesDepthFilter,
    } = useContext(SpaceContext)

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
                selectedOption={spaceSpacesSortByFilter}
                setSelectedOption={setSpaceSpacesSortByFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={spaceSpacesSortOrderFilter}
                setSelectedOption={setSpaceSpacesSortOrderFilter}
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
                selectedOption={spaceSpacesTimeRangeFilter}
                setSelectedOption={setSpaceSpacesTimeRangeFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Depth'
                options={['All Contained Spaces', 'Only Direct Descendants']}
                selectedOption={spaceSpacesDepthFilter}
                setSelectedOption={setSpaceSpacesDepthFilter}
                orientation='vertical'
            />
        </div>
    )
}

export default HolonPageSpacesFilters
