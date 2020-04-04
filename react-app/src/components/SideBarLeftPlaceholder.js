import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/SideBarLeftPlaceholder.module.scss'
//import '../styles/Placeholders.scss'

function SideBarLeftPlaceholder() {
    const { isLoading } = useContext(HolonContext)
    const {
        PHSideBarLeft,
        visible,
        PHSideBarLeftHolonName,
        PHSideBarLeftParentHolonNames,
        PHSideBarLeftFlagImage,
        PHSideBarLeftNavButtons,
        PHSideBarLeftNavButton1,
        PHSideBarLeftNavButton2,
        PHSideBarLeftHolonDescription1,
        PHSideBarLeftHolonDescription2,
        PHSideBarLeftHolonDescription3
    } =  styles

    return (
        <div className={`${PHSideBarLeft} ${(!isLoading && visible)}`}>
            <div className="PHSideBarLeftShine"/>
            <div>
                <div className={PHSideBarLeftHolonName}/>
                <div className={PHSideBarLeftParentHolonNames}/>
            </div>
            <div className={PHSideBarLeftFlagImage}/>
            {/* <img className="ph-side-bar-left-flag-image" src="/images/holon-flag-image-00.jpg"/> */}
            <div className={PHSideBarLeftNavButtons}>
                <div className={PHSideBarLeftNavButton1}/>
                <div className={PHSideBarLeftNavButton2}/>
            </div>
            <div className={PHSideBarLeftHolonDescription1}/>
            <div className={PHSideBarLeftHolonDescription2}/>
            <div className={PHSideBarLeftHolonDescription3}/>
        </div>
    )
}

export default SideBarLeftPlaceholder