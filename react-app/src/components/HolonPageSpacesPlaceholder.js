import React, { useContext } from 'react'
import HolonPlaceholder from './HolonPlaceholder'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/HolonPageSpacesPlaceholder.module.scss'

function HolonPageSpacesPlaceholder() {
    const { holonContextLoading } = useContext(HolonContext)
    return (
        <div className={`${styles.PHChildHolons} ${(holonContextLoading && styles.visible)}`}>
            <div className={styles.PHChildHolonsGradientWrapper}/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
        </div>
    )
}

export default HolonPageSpacesPlaceholder