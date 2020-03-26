import React, { useState, useContext, useEffect } from 'react'
import PostPlaceholder from './PostPlaceholder'
import { HolonContext } from '../contexts/HolonContext'

function WallPlaceholder() {
    const { setHolon, isLoading, updateContext, updateHolonContext } = useContext(HolonContext)
    return (
        <>
            <div className={"wall-placeholder " + (isLoading ? 'visible' : '')}>
                <PostPlaceholder/>
                <PostPlaceholder/>
                <PostPlaceholder/>
                <PostPlaceholder/>
            </div>

            <style jsx="true">{`
                .wall-placeholder {
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

export default WallPlaceholder