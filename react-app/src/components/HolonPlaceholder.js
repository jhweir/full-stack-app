import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'

function HolonPlaceholder(props) {
    return (
        <>
            <div className="ph-holon-card">
                <div className="ph-shine-holon"/>
                <img className="ph-holon-image" src="/images/holon-flag-image-00.jpg"/>
                <div className="ph-holon-info">
                    <div className="ph-holon-title mb-10"/>
                    <div className="ph-holon-description-1 mb-10"/>
                    <div className="ph-holon-description-2"/>
                </div>
            </div>

            <style jsx="true">{`
                .ph-holon-card {
                    margin-bottom: 10px;
                    padding: 20px;
                    width: 100%;
                    border-radius: 10px;
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.05);
                    display: flex;
                    flex-direction: row;
                    position: relative;
                    overflow: hidden;
                }
                .ph-holon-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin-right: 20px;
                    opacity: 0.5;
                }
                .ph-holon-info {
                    display: flex;
                    flex-direction: column;
                }
                .ph-holon-title {
                    width: 200px;
                    height: 30px;
                    background-color: rgba(0,0,0,0.06);
                }
                .ph-holon-description-1 {
                    width: 350px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.04);
                }
                .ph-holon-description-2 {
                    width: 300px;
                    height: 20px;
                    background-color: rgba(0,0,0,0.04);
                }
            `}</style>
        </>
    )
}

export default HolonPlaceholder