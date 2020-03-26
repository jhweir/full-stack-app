import React, { useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'

function CoverImage() {
    // Pull in holon cover image url when set up in database
    const {  } = useContext(HolonContext);
    return (
        <>
            {/* <div className="wrapper"> */}
                <div className="cover-image"><div className="wrapper"/></div>
            {/* </div> */}

            <style jsx="true">{`
                .wrapper {
                    width: 100%;
                    height: 200px;
                    //background-color: rgba(0, 0, 0, 0.05)
                }
                .cover-image {
                    width: 100%;
                    height: 200px;
                    background-image: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); // linear-gradient(180deg, #0b7285 0%, #0ca678 75%); //linear-gradient(#0b7285, #0ca678); 
                }
            `}</style>
        </>
    )
}

export default CoverImage