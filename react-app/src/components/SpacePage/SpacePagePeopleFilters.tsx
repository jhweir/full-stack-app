import React, { useContext } from 'react'
import { SpaceContext } from '@contexts/SpaceContext'
import DropDownMenu from '@components/DropDown'
import Row from '@components/Row'

const SpacePagePeopleFilters = (): JSX.Element => {
    const { spacePeopleFilters, updateSpacePeopleFilter } = useContext(SpaceContext)
    const { sortBy, sortOrder, timeRange } = spacePeopleFilters

    return (
        <Row style={{ width: '100%' }}>
            <DropDownMenu
                title='Sort By'
                options={['Posts', 'Comments', 'Date']}
                selectedOption={sortBy}
                setSelectedOption={(payload) => updateSpacePeopleFilter('sortBy', payload)}
                style={{ marginRight: 10 }}
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={sortOrder}
                setSelectedOption={(payload) => updateSpacePeopleFilter('sortOrder', payload)}
                style={{ marginRight: 10 }}
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
                selectedOption={timeRange}
                setSelectedOption={(payload) => updateSpacePeopleFilter('timeRange', payload)}
                style={{ marginRight: 10 }}
            />
        </Row>
    )
}

export default SpacePagePeopleFilters
