import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
// import axios from 'axios'
// import config from '../Config'
import Holon from '../components/Holon'
import BranchHeader from '../components/HolonHeader'

function Holons() {
    const { setHolon, holonData, globalData, branchBranches, isLoading } = useContext(HolonContext)

    useEffect(() => {
        //setHolon('root') // Sets the holon in the HolonContext and triggers a call to the database to retrieve the posts
    }, [])

    return (
        <>
            <div className="wall">
                <BranchHeader />
                <ul className="holons">
                    {branchBranches.map((holon, index) => 
                        <Holon
                            holon={holon}
                            index={index}
                            key={holon.id}  
                        />
                    )} 
                </ul>
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

export default Holons
