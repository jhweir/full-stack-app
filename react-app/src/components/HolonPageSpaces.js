import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/HolonPageSpaces.module.scss'
import Holon from './Holon'
import HolonPageSpacesHeader from './HolonPageSpacesHeader'
import HolonPageSpacesPlaceholder from './HolonPageSpacesPlaceholder'

function HolonPageSpaces() {
    const { holonData, getHolonData, holonContextLoading, holonSearchFilter, setSelectedHolonSubPage } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('spaces')
    }, [])

    let holons = []
    //holonData && holonData.DirectChildHolons
    if (holonData) { holons = holonData.DirectChildHolons }

    // Apply search filter to holons
    let filteredHolons = holons.filter(holon => {
        return holon.name.toUpperCase().includes(holonSearchFilter.toUpperCase()) //&& holon.globalState === 'visible'
    })

    return (
        <div className={styles.childHolonsWrapper}>
            <HolonPageSpacesHeader/>
            <HolonPageSpacesPlaceholder/>
            <ul className={`${styles.childHolons} ${(holonContextLoading && styles.hidden)}`}>
                {filteredHolons.map((holon, index) =>
                    <Holon
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
