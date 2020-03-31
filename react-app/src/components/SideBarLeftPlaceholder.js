import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'

function SideBarLeftPlaceholder() {
    const { isLoading } = useContext(HolonContext)

    return (
        <>
            <div className="ph-side-bar-left-shine"/>
            <div className="ph-side-bar-left-location">
                <div className="ph-side-bar-left-holon-name mb-10"/>
                <div className="ph-side-bar-left-parent-holon-names mb-20"/>
            </div>
            <div className="ph-side-bar-left-flag-image"/>
            {/* <img className="ph-side-bar-left-flag-image" src="/images/holon-flag-image-00.jpg"/> */}
            <div className="ph-side-bar-left-nav-buttons">
                <div className="ph-side-bar-left-nav-button-1 mb-10"/>
                <div className="ph-side-bar-left-nav-button-2 mb-20"/>
            </div>
            <div className="ph-side-bar-left-holon-description-1 mb-10"/>
            <div className="ph-side-bar-left-holon-description-2 mb-10"/>
            <div className="ph-side-bar-left-holon-description-3 mb-10"/>

            <style jsx="true">{`
                .ph-side-bar-left-holon-location {
                }
                .ph-side-bar-left-holon-name {
                    width: 80px;
                    height: 23px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-left-parent-holon-names {
                    width: 100px;
                    height: 15px;
                    background-color: rgba(0,0,0,0.03);
                }
                .ph-side-bar-left-flag-image {
                    width: 120px;
                    height: 120px;
                    background-color: rgba(0,0,0,0.06);
                    border-radius: 50%;
                    margin: 0 0 25px 0;
                    opacity: 0.5;
                    z-index: -1;
                }
                .ph-side-bar-left-nav-buttons {
                    display: flex;
                    flex-direction: column;
                }
                .ph-side-bar-left-nav-button-1 {
                    width: 50px;
                    height: 15px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-left-nav-button-2 {
                    width: 70px;
                    height: 15px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-left-holon-description-1 {
                    width: 160px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.03);
                }
                .ph-side-bar-left-holon-description-2 {
                    width: 160px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.03);
                }
                .ph-side-bar-left-holon-description-3 {
                    width: 120px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.03);
                }
            `}</style>
        </>
    )
}

export default SideBarLeftPlaceholder