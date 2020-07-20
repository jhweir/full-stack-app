import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSpaces.module.scss'
import HolonCard from '../Cards/HolonCard'
import SearchBar from '../SearchBar'
import HolonPageSpacesFilters from './HolonPageSpacesFilters'
import HolonPageSpacesPlaceholder from './HolonPageSpacesPlaceholder'

function HolonPageSpaces() {
    const { setCreateHolonModalOpen, pageBottomReached } = useContext(AccountContext)
    const {
        holonContextLoading, holonData,
        holonSpaces, getHolonSpaces, getNextHolonSpaces,
        holonSpaceFiltersOpen, setHolonSpaceFiltersOpen,
        holonSpaceSearchFilter, holonSpaceTimeRangeFilter, holonSpaceSortByFilter, holonSpaceSortOrderFilter,
        setSelectedHolonSubPage
    } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('spaces')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData.id) { getHolonSpaces() }
    }, [holonContextLoading, holonSpaceSearchFilter, holonSpaceTimeRangeFilter, holonSpaceSortByFilter, holonSpaceSortOrderFilter])

    useEffect(() => {
        if (pageBottomReached && !holonContextLoading && holonData.id) { getNextHolonSpaces() }
    }, [pageBottomReached])

    return (
        <div className={styles.childHolonsWrapper}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar type='holon-spaces'/>
                    <button className='wecoButton mr-10' onClick={() => setHolonSpaceFiltersOpen(!holonSpaceFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                    <button className="wecoButton" onClick={() => setCreateHolonModalOpen(true) }>
                        Create Space
                    </button>
                </div>
                <HolonPageSpacesFilters/>
            </div>
            {/* <HolonPageSpacesPlaceholder/> */}
            <ul className={`${styles.childHolons} ${(holonContextLoading && styles.hidden)}`}>
                {holonSpaces.map((holon, index) =>
                    <HolonCard
                        holon={holon}
                        index={index}
                        key={index}
                    />
                )} 
            </ul>
        </div>
    )
}

export default HolonPageSpaces
