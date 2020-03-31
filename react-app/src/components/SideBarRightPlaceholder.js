import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'

function SideBarRightPlaceholder() {
    const { isLoading } = useContext(HolonContext)

    return (
        <>
            <div className="ph-side-bar-right-shine"/>
            <ul className="ph-side-bar-right-child-holons">
                <div className="ph-side-bar-right-child-holons-title"/>
                <div className="ph-side-bar-right-child-holon mb-10">
                    <div className="ph-side-bar-right-child-holon-image"/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className="ph-side-bar-right-child-holon-name-1"/>
                </div>
                <div className="ph-side-bar-right-child-holon mb-10">
                    <div className="ph-side-bar-right-child-holon-image"/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className="ph-side-bar-right-child-holon-name-2"/>
                </div>
                <div className="ph-side-bar-right-child-holon mb-10">
                    <div className="ph-side-bar-right-child-holon-image"/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className="ph-side-bar-right-child-holon-name-3"/>
                </div>
                <div className="ph-side-bar-right-child-holon mb-10">
                    <div className="ph-side-bar-right-child-holon-image"/>
                    {/* <img className="ph-side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                    <div className="ph-side-bar-right-child-holon-name-4"/>
                </div>
            </ul>

            <style jsx="true">{`
                .ph-side-bar-right-child-holons {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .ph-side-bar-right-child-holons-title {
                    width: 70px;
                    height: 22px;
                    margin-bottom: 10px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-right-child-holon {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .ph-side-bar-right-child-holon-image {
                    background-position: center;
                    background-size: cover;
                    height: 40px;
                    width: 40px;
                    background-color: rgba(0,0,0,0.06);
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-right: 10px;
                    opacity: 0.5;
                    z-index: -1;
                }
                .ph-side-bar-right-child-holon-name-1 {
                    width: 90px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-right-child-holon-name-2 {
                    width: 70px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-right-child-holon-name-3 {
                    width: 80px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.05);
                }
                .ph-side-bar-right-child-holon-name-4 {
                    width: 50px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.05);
                }
            `}</style>
        </>
    )
}

export default SideBarRightPlaceholder