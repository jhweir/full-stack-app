import React, { useContext } from 'react'
import HolonCardPlaceholder from '../Cards/HolonCardPlaceholder'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSpacesPlaceholder.module.scss'

function HolonPageSpacesPlaceholder() {
    const { holonContextLoading } = useContext(HolonContext)
    return (
        <div className={`${styles.PHChildHolons} ${(holonContextLoading && styles.visible)}`}>
            <div className={styles.PHChildHolonsGradientWrapper}/>
            <HolonCardPlaceholder/>
            <HolonCardPlaceholder/>
            <HolonCardPlaceholder/>
            <HolonCardPlaceholder/>
            <HolonCardPlaceholder/>
        </div>
    )
}

export default HolonPageSpacesPlaceholder