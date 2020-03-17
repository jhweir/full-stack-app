import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'

function CoverImage() {
    // Pull in holon cover image url when set up in database
    const {  } = useContext(HolonContext);
    return (
        <>
            <div className="cover-image"/>

            <style jsx="true">{`
                .cover-image {
                    width: 100%;
                    height: 150px;
                    background-image: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);
                }
            `}</style>
        </>
    )
}

export default CoverImage