import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSpaces.module.scss'
import HolonCard from '../Cards/HolonCard'
import SearchBar from '../SearchBar'
//import Filters from '../Filters'
import HolonPageSpacesPlaceholder from './HolonPageSpacesPlaceholder'

function HolonPageSpaces() {
    const { setCreateHolonModalOpen } = useContext(AccountContext)
    const { holonData, getHolonData, holonContextLoading, holonSpaceSearchFilter, setSelectedHolonSubPage } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('spaces')
    }, [])

    let holons = []
    //holonData && holonData.DirectChildHolons
    if (holonData) { holons = holonData.DirectChildHolons }

    // Apply search filter to holons
    let filteredHolons = holons.filter(holon => {
        return holon.name.toUpperCase().includes(holonSpaceSearchFilter.toUpperCase()) //&& holon.globalState === 'visible'
    })

    return (
        <div className={styles.childHolonsWrapper}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar type='holon-spaces'/>
                    <button className="wecoButton" onClick={() => setCreateHolonModalOpen(true) }>
                        Create Space
                    </button>
                </div>
                {/* <Filters type='holon-spaces'/> */}
            </div>
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
