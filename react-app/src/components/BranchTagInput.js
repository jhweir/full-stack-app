import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BranchTag from './BranchTag'

function BranchTagInput(props) {
    const { 
        globalData,
        branches,
        newBranch,
        setNewBranch,
        addBranch,
        removeBranch,
        branchError,
        setBranchError,
        branchErrorMessage,
        setBranchErrorMessage,
        addSuggestedBranch
    } = props

    // Find branches that match the search filter
    const filteredBranches = globalData.filter(branch => (branch.name.includes(newBranch)))
    
    // Suggest branches that match the search filter and haven't already been added to the post
    const suggestedBranches = filteredBranches.filter(branch => !branches.find(b2 => branch.name === b2.name))

    return (
        <>
            <div className="mb-10">
                <div className="branch-input-title mb-20">Add the names of branches you want the post to appear in below:</div>
                <div className="branch-form mb-20">
                    <input className={"input-wrapper " + (branchError && 'error')}
                        style={{ width: '100%' }}
                        type="text"
                        placeholder="Add branches..."
                        value={ props.newBranch }
                        onChange={(e) => {
                            setNewBranch(e.target.value)
                            setBranchError(false)
                            setBranchErrorMessage(false)
                        }}
                    />
                    <button className="button" style={{ flexShrink: 0 }} onClick={ addBranch }>Add branch</button>
                </div>
                {(newBranch !== '' && suggestedBranches.length !== 0) &&
                    <>
                        <div className="mb-10">Suggested branches: </div>
                        <ul className="branches mb-10">
                            {suggestedBranches.map((branch, index) => 
                                <BranchTag branch={branch} key={index} removeBranch={removeBranch} added={false} addSuggestedBranch={addSuggestedBranch}/>
                            )}
                        </ul>
                    </>
                }
                {branchErrorMessage && 
                    <div className="branch-error-message mb-20">Sorry, that branch doesn't exist yet. You'll need to create it first on the <Link to="/branches">Branches</Link> page.</div>
                }
                {branches.length !== 0 &&
                    <>
                        <div className="mb-10">Added branches: </div>
                        <ul className="branches mb-20">
                            {branches.map((branch, index) => 
                                <BranchTag branch={branch} key={index} removeBranch={removeBranch} added={true}/>
                            )}
                        </ul>
                    </>
                }
            </div>

            <style jsx="true">{`
                .branch-input-title, .branch-error-message {
                    width: 400px;
                }
                @media screen and (max-width: 700px) {
                    .branch-input-title {
                        width: auto;
                    }
                }
                .branch-form {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .branches {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-wrap: wrap;
                }
            `}</style>
        </>
    )
}

export default BranchTagInput
