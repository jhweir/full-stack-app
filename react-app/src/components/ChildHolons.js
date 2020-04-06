
import React, { useState, useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/ChildHolons.module.scss'
import Holon from './Holon'
import ChildHolonsHeader from './ChildHolonsHeader'
import ChildHolonsPlaceholder from './ChildHolonsPlaceholder'

function ChildHolons() {
    const { updateContext, holonData, isLoading, holonSearchFilter } = useContext(HolonContext)
    const holons = holonData.DirectChildHolons

    // Apply search filter to holons
    let filteredHolons = holons.filter(holon => {
        return holon.name.includes(holonSearchFilter) //&& holon.globalState === 'visible'
    })

    return (
        <div className={styles.childHolonsWrapper}>
            <ChildHolonsHeader/>
            <ChildHolonsPlaceholder/>
            <ul className={`${styles.childHolons} ${(isLoading && styles.hidden)}`}>
                {filteredHolons.map((holon, index) =>
                    <Holon
                        holon={holon}
                        index={index}
                        key={holon.id}
                        updateContext={updateContext}
                    />
                )} 
            </ul>
        </div>
    )
}

export default ChildHolons
