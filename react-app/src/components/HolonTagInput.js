import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BranchTag from './HolonTag'

function BranchTagInput(props) {
    const { 
        globalData,
        holons,
        newHolon,
        setNewHolon,
        addBranch,
        removeBranch,
        holonError,
        setHolonError,
        holonErrorMessage,
        setHolonErrorMessage,
        addSuggestedBranch
    } = props

    // Find holons that match the search filter
    const filteredBranches = globalData.filter(holon => (holon.name.includes(newHolon)))
    
    // Suggest holons that match the search filter and haven't already been added to the post
    const suggestedBranches = filteredBranches.filter(holon => !holons.find(b2 => holon.name === b2.name))

    return (
        <>
            <div className="mb-10">
                <div className="holon-input-title mb-20">Add the names of holons you want the post to appear in below:</div>
                <div className="holon-form mb-20">
                    <input className={"input-wrapper " + (holonError && 'error')}
                        style={{ width: '100%' }}
                        type="text"
                        placeholder="Add holons..."
                        value={ props.newHolon }
                        onChange={(e) => {
                            setNewHolon(e.target.value)
                            setHolonError(false)
                            setHolonErrorMessage(false)
                        }}
                    />
                    <button className="button" style={{ flexShrink: 0 }} onClick={ addBranch }>Add holon</button>
                </div>
                {(newHolon !== '' && suggestedBranches.length !== 0) &&
                    <>
                        <div className="mb-10">Suggested holons: </div>
                        <ul className="holons mb-10">
                            {suggestedBranches.map((holon, index) => 
                                <BranchTag holon={holon} key={index} removeBranch={removeBranch} added={false} addSuggestedBranch={addSuggestedBranch}/>
                            )}
                        </ul>
                    </>
                }
                {holonErrorMessage && 
                    <div className="holon-error-message mb-20">Sorry, that holon doesn't exist yet. You'll need to create it first on the <Link to="/holons">Holons</Link> page.</div>
                }
                {holons.length !== 0 &&
                    <>
                        <div className="mb-10">Added holons: </div>
                        <ul className="holons mb-20">
                            {holons.map((holon, index) => 
                                <BranchTag holon={holon} key={index} removeBranch={removeBranch} added={true}/>
                            )}
                        </ul>
                    </>
                }
            </div>

            <style jsx="true">{`
                .holon-input-title, .holon-error-message {
                    width: 400px;
                }
                @media screen and (max-width: 700px) {
                    .holon-input-title {
                        width: auto;
                    }
                }
                .holon-form {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .holons {
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
