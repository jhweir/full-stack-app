import React, { useContext } from 'react'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/SpacePageSideBarLeftPlaceholder.module.scss'

const SpacePageSideBarLeftPlaceholder = (): JSX.Element => {
    // const { spaceContextLoading } = useContext(SpaceContext)

    return (
        <div className={styles.PHSideBarLeft}>
            <div className='PHSideBarShine' />
            {/* <div className={styles.PHSideBarLeftHolonName} /> */}
            <div className={styles.PHSideBarLeftFlagImage} />
            {/* <img className="ph-side-bar-left-flag-image" src="/images/holon-flag-image-00.jpg"/> */}
            <div className={styles.PHSideBarLeftNavButtons}>
                <div className={styles.PHSideBarLeftNavButton1} />
                <div className={styles.PHSideBarLeftNavButton2} />
            </div>
            <div className={styles.PHSideBarLeftHolonDescription1} />
            <div className={styles.PHSideBarLeftHolonDescription2} />
            <div className={styles.PHSideBarLeftHolonDescription3} />
        </div>
    )
}

export default SpacePageSideBarLeftPlaceholder
