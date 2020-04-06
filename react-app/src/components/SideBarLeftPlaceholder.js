import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/SideBarLeftPlaceholder.module.scss'

function SideBarLeftPlaceholder() {
    const { isLoading } = useContext(HolonContext)

    return (
        <div className={`${styles.PHSideBarLeft} ${(isLoading && styles.visible)}`}>
            <div className="PHSideBarShine"/>
            <div className={styles.PHSideBarLeftHolonName}/>
            <div className={styles.PHSideBarLeftFlagImage}/>
            {/* <img className="ph-side-bar-left-flag-image" src="/images/holon-flag-image-00.jpg"/> */}
            <div className={styles.PHSideBarLeftNavButtons}>
                <div className={styles.PHSideBarLeftNavButton1}/>
                <div className={styles.PHSideBarLeftNavButton2}/>
            </div>
            <div className={styles.PHSideBarLeftHolonDescription1}/>
            <div className={styles.PHSideBarLeftHolonDescription2}/>
            <div className={styles.PHSideBarLeftHolonDescription3}/>
        </div>
    )
}

export default SideBarLeftPlaceholder