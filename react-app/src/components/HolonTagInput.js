import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HolonTag from './HolonTag'

function BranchTagInput(props) {
    const { 
        globalData,
        holonTags,
        newHolonTag,
        setNewHolonTag,
        addHolonTag,
        removeHolonTag,
        holonError,
        setHolonError,
        holonErrorMessage,
        setHolonErrorMessage,
        addSuggestedHolonTag
    } = props

    // Find holons that match the search filter
    const filteredHolonTags = globalData.filter(holonTag => (holonTag.handle.includes(newHolonTag)))
    
    // Suggest holons that match the search filter and haven't already been added to the post
    const suggestedHolonTags = filteredHolonTags.filter(holonTag => !holonTags.find(b2 => holonTag.handle === b2.handle))

    return (
        <>
            <div className="mb-10">
                <div className="holon-input-title mb-20">Add the names of holons you want the post to appear in below:</div>
                <div className="holon-form mb-20">
                    <input className={"input-wrapper " + (holonError && 'error')}
                        style={{ width: '100%' }}
                        type="text"
                        placeholder="Add holon tags..."
                        value={ props.newHolonTag }
                        onChange={(e) => {
                            setNewHolonTag(e.target.value)
                            setHolonError(false)
                            setHolonErrorMessage(false)
                        }}
                    />
                    <button className="button" style={{ flexShrink: 0 }} onClick={ addHolonTag }>Add holon</button>
                </div>
                {(newHolonTag !== '' && suggestedHolonTags.length !== 0) &&
                    <>
                        <div className="mb-10">Suggested holons: </div>
                        <ul className="holons mb-10">
                            {suggestedHolonTags.map((holonTag, index) => 
                                <HolonTag holonTag={holonTag} key={index} removeHolonTag={removeHolonTag} added={false} addSuggestedHolonTag={addSuggestedHolonTag}/>
                            )}
                        </ul>
                    </>
                }
                {holonErrorMessage && 
                    <div className="holon-error-message mb-20">Sorry, that holon doesn't exist yet. You'll need to create it first on the <Link to="/h/root/child-holons">Holons</Link> page.</div>
                }
                {holonTags.length !== 0 &&
                    <>
                        <div className="mb-10">Added holons: </div>
                        <ul className="holons mb-20">
                            {holonTags.map((holonTag, index) => 
                                <HolonTag holonTag={holonTag} key={index} removeHolonTag={removeHolonTag} added={true}/>
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
