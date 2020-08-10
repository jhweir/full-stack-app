import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSpaces.module.scss'
import HolonCard from '../Cards/HolonCard'
import SearchBar from '../SearchBar'
import HolonPageSpacesFilters from './HolonPageSpacesFilters'
import HolonPageSpacesPlaceholder from './HolonPageSpacesPlaceholder'

function HolonPageSpaces() {
    const { setCreateHolonModalOpen, pageBottomReached, isLoggedIn, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)
    const {
        holonContextLoading, holonData,
        holonSpaces, getHolonSpaces, getNextHolonSpaces,
        holonSpaceFiltersOpen, setHolonSpaceFiltersOpen,
        holonSpaceSearchFilter, holonSpaceTimeRangeFilter, holonSpaceSortByFilter, holonSpaceSortOrderFilter, holonSpaceDepthFilter,
        setSelectedHolonSubPage, holonSpacePaginationOffset,
        setHolonSpaceSearchFilter
    } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('spaces')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData.id) { getHolonSpaces() }
    }, [holonContextLoading, holonSpaceSearchFilter, holonSpaceTimeRangeFilter, holonSpaceSortByFilter, holonSpaceSortOrderFilter, holonSpaceDepthFilter])

    useEffect(() => {
        if (pageBottomReached && !holonContextLoading && holonData.id) { getNextHolonSpaces() }
    }, [pageBottomReached])

    function openCreateSpaceModal() {
        if (!isLoggedIn) { setAlertModalOpen(true); setAlertMessage('Log in to create a space') }
        else { setCreateHolonModalOpen(true) }
    }

    return (
        <div className={styles.childHolonsWrapper}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar setSearchFilter={setHolonSpaceSearchFilter} placeholder='Search spaces...'/>
                    <button className='wecoButton mr-10' onClick={() => setHolonSpaceFiltersOpen(!holonSpaceFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                    <button className="wecoButton" onClick={() => openCreateSpaceModal() }>
                        Create Space
                    </button>
                </div>
                {holonSpaceFiltersOpen && <HolonPageSpacesFilters/>}
            </div>
            {/* <HolonPageSpacesPlaceholder/> */}
            {holonSpaces.length > 0 &&
                <ul className={`${styles.childHolons} ${(holonContextLoading && styles.hidden)}`}>
                    {holonSpaces.map((holon, index) =>
                        <HolonCard
                            holon={holon}
                            index={index}
                            key={index}
                        />
                    )} 
                </ul>
            }
            {holonSpacePaginationOffset > 0 && holonSpaces.length < 1 &&
                <div className='wecoNoContentPlaceholder'>
                    No spaces yet that match those settings...
                </div>
            }
        </div>
    )
}

export default HolonPageSpaces
