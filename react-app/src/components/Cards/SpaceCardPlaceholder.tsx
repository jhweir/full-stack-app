import React from 'react'
import styles from '@styles/components/SpaceCardPlaceholder.module.scss'

const SpaceCardPlaceholder = (): JSX.Element => {
    return (
        <div className={styles.PHHolon}>
            <div className='PHHolonShine' />
            <div className={styles.PHHolonImage} />
            <div className={styles.PHHolonInfo}>
                <div className={styles.PHHolonTitle} />
                <div className={styles.PHHolonDescription1} />
                <div className={styles.PHHolonDescription2} />
            </div>
        </div>
    )
}

export default SpaceCardPlaceholder
