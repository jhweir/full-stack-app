import React, { useContext, useEffect } from 'react'
import { BranchContext } from '../contexts/BranchContext'
// import axios from 'axios'
// import config from '../Config'
import Branch from '../components/Branch'
import BranchHeader from '../components/BranchHeader'

function Branches() {
    const { setBranch, branchData, globalData, branchBranches, isLoading } = useContext(BranchContext)

    useEffect(() => {
        //setBranch('root') // Sets the branch in the BranchContext and triggers a call to the database to retrieve the posts
    }, [])

    return (
        <>
            <div className="wall">
                <BranchHeader />
                <ul className="branches">
                    {branchBranches.map((branch, index) => 
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
