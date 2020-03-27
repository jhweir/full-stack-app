import React, { useState, useContext, useEffect } from 'react'
import PostPlaceholder from './PostPlaceholder'
import { HolonContext } from '../contexts/HolonContext'

function WallPlaceholder() {
    const { setHolon, isLoading, updateContext, updateHolonContext } = useContext(HolonContext)
    return (
        <>
            <div className={"ph-wall " + (isLoading ? 'visible' : '')}>
                <div className="ph-wall-gradient-wrapper"/>
                <PostPlaceholder/>
                <PostPlaceholder/>
                <PostPlaceholder/>
                <PostPlaceholder/>
                <PostPlaceholder/>
            </div>

            <style jsx="true">{`
                .ph-wall {
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
                .ph-wall-gradient-wrapper {
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

export default WallPlaceholder