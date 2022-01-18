import React, { useContext } from 'react'
import SpaceCardPlaceholder from '../Cards/SpaceCardPlaceholder'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/SpacePageSpacesPlaceholder.module.scss'

const SpacePageSpacesPlaceholder = (): JSX.Element => {
    // const { spaceContextLoading } = useContext(SpaceContext)
    return (
        <div className={styles.PHChildHolons}>
            <div className={styles.PHChildHolonsGradientWrapper} />
            <SpaceCardPlaceholder />
            <SpaceCardPlaceholder />
            <SpaceCardPlaceholder />
            <SpaceCardPlaceholder />
            <SpaceCardPlaceholder />
        </div>
    )
}

export default SpacePageSpacesPlaceholder
