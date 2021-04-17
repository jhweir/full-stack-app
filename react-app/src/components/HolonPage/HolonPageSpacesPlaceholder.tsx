import React, { useContext } from 'react'
import HolonCardPlaceholder from '../Cards/HolonCardPlaceholder'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPageSpacesPlaceholder.module.scss'

const HolonPageSpacesPlaceholder = (): JSX.Element => {
    const { spaceContextLoading } = useContext(SpaceContext)
    return (
        <div className={`${styles.PHChildHolons} ${spaceContextLoading && styles.visible}`}>
            <div className={styles.PHChildHolonsGradientWrapper} />
            <HolonCardPlaceholder />
            <HolonCardPlaceholder />
            <HolonCardPlaceholder />
            <HolonCardPlaceholder />
            <HolonCardPlaceholder />
        </div>
    )
}

export default HolonPageSpacesPlaceholder
