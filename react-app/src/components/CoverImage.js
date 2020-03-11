import React, { useContext } from 'react'
import { BranchContext } from '../contexts/BranchContext'

function CoverImage() {
    // Pull in branch cover image url when set up in database
    const {  } = useContext(BranchContext);
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