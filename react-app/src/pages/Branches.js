import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import config from '../Config'
import Branch from '../components/Branch'

function Branches() {
    const [branches, setBranches] = useState([])

    function getAllBranches() {
        axios.get(config.environmentURL + '/branches')
            .then(res => { 
                setBranches(res.data)
            })
    }

    useEffect(() => {
        getAllBranches()
    }, [])


    return (
        <>
            <div className="wall">
                <div className="title">Branch page</div>
                <ul className="branches">
                    {branches.map((branch, index) => 
                        <Branch
                            branch={branch}
                            index={index}
                            key={branch.id}  
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

export default Branches
