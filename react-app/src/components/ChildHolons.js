
import React, { useState, useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
// import axios from 'axios'
// import config from '../Config'
import Holon from './Holon'
import ChildHolonsHeader from './ChildHolonsHeader'

function ChildHolons() {
    const { setHolon, updateContext, holonData, globalData, isLoading } = useContext(HolonContext)

    // useEffect(() => {
    //     if (holonData) { console.log(holonData.child) }
    //     //setHolon('root') // Sets the holon in the HolonContext and triggers a call to the database to retrieve the posts
    // }, [holonData])

    return (
        <>
            <div className="wall">
                <ChildHolonsHeader />
                {holonData.DirectChildHolons &&
                    <ul className="holons">
                        {holonData.DirectChildHolons.map((holon, index) => 
                            <Holon
                                holon={holon}
                                index={index}
                                key={holon.id}
                                updateContext={updateContext}
                            />
                        )} 
                    </ul>
                }
            </div>

            <style jsx="true">{`
                .title {
                    
                }
                .wall {
                    width: 600px;
                    padding: 0 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .posts {
                    padding: 0;
                    width: 100%;
                }
                .pinned-posts {
                    padding: 0;
                    width: 100%;
                }
                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    )
}

export default ChildHolons
