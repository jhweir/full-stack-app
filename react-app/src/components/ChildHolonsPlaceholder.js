import React, { useContext } from 'react'
import HolonPlaceholder from './HolonPlaceholder'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/ChildHolonsPlaceholder.module.scss'

function ChildHolonsPlaceholder() {
    const { isLoading } = useContext(HolonContext)
    return (
        <div className={`${styles.PHChildHolons} ${(isLoading && styles.visible)}`}>
            <div className={styles.PHChildHolonsGradientWrapper}/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
            <HolonPlaceholder/>
        </div>
    )
}

export default ChildHolonsPlaceholder