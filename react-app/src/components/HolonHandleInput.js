import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/HolonHandleInput.module.scss'
import HolonHandle from './HolonHandle'

function HolonHandleInput(props) {
    const { 
        globalData,
        holonHandles,
        setHolonHandles,
        newHolonHandle,
        setNewHolonHandle,
        holonError,
        setHolonError,
        holonErrorMessage,
        setHolonErrorMessage,
    } = props

    // Find holons that match the search filter
    const filteredHolonHandles = globalData.filter(handle => handle.includes(newHolonHandle))
    
    // Suggest holons that haven't already been added to the post
    const suggestedHolonHandles = filteredHolonHandles.filter(handle => !holonHandles.find(b2 => handle === b2))

    function addHolonHandle(e) {
        e.preventDefault()
        const validHolonHandle = globalData.filter(holonHandle => (holonHandle === newHolonHandle))
        if (newHolonHandle === '') {
            setHolonError(true)
        } else if (validHolonHandle.length === 0) {
            setHolonError(true)
            setHolonErrorMessage(true)
        } else if (validHolonHandle.length && !holonHandles.includes(validHolonHandle[0]) ) {
            setHolonHandles([...holonHandles, validHolonHandle[0]])
            setNewHolonHandle('')
        }
    }

    function addSuggestedHolonHandle(holonHandle) {
        setHolonHandles([...holonHandles, holonHandle])
    }

    function removeHolonHandle(holonHandle) {
        const updatedHolonHandles = holonHandles.filter((holonHandles) => { return holonHandles !== holonHandle })
        setHolonHandles(updatedHolonHandles)
    }

    return (
        <div className={styles.holonHandleInput}>
            <div className={styles.holonHandleInputTitle}>Add the names of spaces you want the post to appear in below:</div>
            <div className={styles.holonHandleInputForm}>
                <input className={`${styles.holonHandleInputFormInput} ${(holonError && styles.error)}`}
                    type="text" placeholder="Add spaces..." value={ props.newHolonHandle }
                    onChange={(e) => {
                        setNewHolonHandle(e.target.value)
                        setHolonError(false)
                        setHolonErrorMessage(false)
                    }}
                />
                <button className="button" style={{ flexShrink: 0 }} onClick={ addHolonHandle }>Add space</button>
            </div>
            {holonErrorMessage && 
                <div className={styles.holonHandleInputSubTitle}>
                    Sorry, that space doesn't exist yet. You'll need to create it first on the 
                    <Link to="/h/root/child-holons"> Spaces</Link> page.
                </div>
            }
            {(newHolonHandle !== '' && suggestedHolonHandles.length !== 0) &&
                <>
                    <div className={styles.holonHandleInputSubTitle}>Suggested spaces: </div>
                    <ul className={styles.holonHandleInputHolons}>
                        {suggestedHolonHandles.map((holonHandle, index) => 
                            <HolonHandle 
                                key={index}
                                holonHandle={holonHandle}
                                removeHolonHandle={removeHolonHandle}
                                added={false}
                                addSuggestedHolonHandle={addSuggestedHolonHandle}
                            />
                        )}
                    </ul>
                </>
            }
            {holonHandles.length !== 0 &&
                <>
                    <div className={styles.holonHandleInputSubTitle}>Added spaces: </div>
                    <ul className={styles.holonHandleInputHolons}>
                        {holonHandles.map((holonHandle, index) => 
                            <HolonHandle holonHandle={holonHandle} key={index} removeHolonHandle={removeHolonHandle} added={true}/>
                        )}
                    </ul>
                </>
            }
        </div>
    )
}

export default HolonHandleInput
