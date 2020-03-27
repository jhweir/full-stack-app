import React, { useState, useContext, useEffect } from 'react'
import HolonPlaceholder from './HolonPlaceholder'
import { HolonContext } from '../contexts/HolonContext'

function ChildHolonsPlaceholder() {
    const { setHolon, isLoading, updateContext, updateHolonContext } = useContext(HolonContext)
    return (
        <>
            <div className={"ph-child-holons " + (isLoading ? 'visible' : '')}>
                <div className="ph-child-holons-gradient-wrapper"/>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
            </div>

            <style jsx="true">{`
                .ph-child-holons {
                    width: 700px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 50px;
                    left: 0;
                    //z-index: 1;
                }
                .ph-child-holons-gradient-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 1000px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(247,247,249,1));
                    z-index: 1;
                }
            `}</style>
        </>
    )
}

export default ChildHolonsPlaceholder