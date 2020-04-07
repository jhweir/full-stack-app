import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/HolonTagInput.module.scss'
import HolonTag from './HolonTag'

function HolonTagInput(props) {
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
        <div className={styles.holonTagInput}>
            <div className={styles.holonTagInputTitle}>Add the names of spaces you want the post to appear in below:</div>
            <div className={styles.holonTagInputForm}>
                <input className={`${styles.holonTagInputFormInput} ${(holonError && styles.error)}`}
                    type="text" placeholder="Add spaces..." value={ props.newHolonTag }
                    onChange={(e) => {
                        setNewHolonTag(e.target.value)
                        setHolonError(false)
                        setHolonErrorMessage(false)
                    }}
                />
                <button className="button" style={{ flexShrink: 0 }} onClick={ addHolonTag }>Add space</button>
            </div>
            {holonErrorMessage && 
                <div className={styles.holonTagInputSubTitle}>
                    Sorry, that space doesn't exist yet. You'll need to create it first on the 
                    <Link to="/h/root/child-holons"> Spaces</Link> page.
                </div>
            }
            {(newHolonTag !== '' && suggestedHolonTags.length !== 0) &&
                <>
                    <div className={styles.holonTagInputSubTitle}>Suggested spaces: </div>
                    <ul className={styles.holonTagInputHolons}>
                        {suggestedHolonTags.map((holonTag, index) => 
                            <HolonTag holonTag={holonTag} key={index} removeHolonTag={removeHolonTag} added={false} addSuggestedHolonTag={addSuggestedHolonTag}/>
                        )}
                    </ul>
                </>
            }
            {holonTags.length !== 0 &&
                <>
                    <div className={styles.holonTagInputSubTitle}>Added spaces: </div>
                    <ul className={styles.holonTagInputHolons}>
                        {holonTags.map((holonTag, index) => 
                            <HolonTag holonTag={holonTag} key={index} removeHolonTag={removeHolonTag} added={true}/>
                        )}
                    </ul>
                </>
            }
        </div>
    )
}

export default HolonTagInput
