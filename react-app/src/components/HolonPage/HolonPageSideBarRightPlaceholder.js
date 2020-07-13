import React, { useContext } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSideBarRightPlaceholder.module.scss'

function HolonPageSideBarRightPlaceholder() {
    const { holonContextLoading } = useContext(HolonContext)

    return (
        <div className={`${styles.PHSideBarRight} ${(holonContextLoading && styles.visible)}`}>
            <div className="PHSideBarShine"/>
            <ul className={styles.PHSideBarRightHolons}>
                <div className={styles.PHSideBarRightHolonsTitle}/>
                <div className={styles.PHSideBarRightHolon}>
                    <div className={styles.PHSideBarRightHolonImage}/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className={styles.PHSideBarRightHolonName1}/>
                </div>
                <div className={styles.PHSideBarRightHolon}>
                    <div className={styles.PHSideBarRightHolonImage}/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className={styles.PHSideBarRightHolonName2}/>
                </div>
                <div className={styles.PHSideBarRightHolon}>
                    <div className={styles.PHSideBarRightHolonImage}/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className={styles.PHSideBarRightHolonName3}/>
                </div>
                <div className={styles.PHSideBarRightHolon}>
                    <div className={styles.PHSideBarRightHolonImage}/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className={styles.PHSideBarRightHolonName4}/>
                </div>
            </ul>
        </div>
    )
}

export default HolonPageSideBarRightPlaceholder