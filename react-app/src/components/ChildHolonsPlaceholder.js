import React, { useState, useContext, useEffect } from 'react'
import HolonPlaceholder from './HolonPlaceholder'
import { HolonContext } from '../contexts/HolonContext'

function ChildHolonsPlaceholder() {
    const { setHolon, isLoading, updateContext, updateHolonContext } = useContext(HolonContext)
    return (
        <>
            <div className={"child-holons-placeholder " + (isLoading ? 'visible' : '')}>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
                <HolonPlaceholder/>
            </div>

            <style jsx="true">{`
                .child-holons-placeholder {
                    width: 600px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 60px;
                    left: 0;
                }
            `}</style>
        </>
    )
}

export default ChildHolonsPlaceholder