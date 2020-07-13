import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSpaces.module.scss'
import HolonCard from '../Cards/HolonCard'
import PageHeader from '../PageHeader'
import SearchBar from '../SearchBar'
import HolonPageSpacesPlaceholder from './HolonPageSpacesPlaceholder'

function HolonPageSpaces() {
    const { setCreateHolonModalOpen } = useContext(AccountContext)
    const { holonData, getHolonData, holonContextLoading, holonSpacesSearchFilter, setSelectedHolonSubPage } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('spaces')
    }, [])

    let holons = []
    //holonData && holonData.DirectChildHolons
    if (holonData) { holons = holonData.DirectChildHolons }

    // Apply search filter to holons
    let filteredHolons = holons.filter(holon => {
        return holon.name.toUpperCase().includes(holonSpacesSearchFilter.toUpperCase()) //&& holon.globalState === 'visible'
    })

    return (
        <div className={styles.childHolonsWrapper}>
            <PageHeader>
                <SearchBar type='holon-spaces'/>
                <button className="wecoButton" onClick={() => setCreateHolonModalOpen(true) }>
                    Create Space
                </button>
                {/* <HolonPageSpacesFilters/> */}
            </PageHeader>
            {/* <HolonPageSpacesPlaceholder/> */}
            <ul className={`${styles.childHolons} ${(holonContextLoading && styles.hidden)}`}>
                {filteredHolons.map((holon, index) =>
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
