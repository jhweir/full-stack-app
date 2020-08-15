import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/HolonHandleInput.module.scss'

function HolonHandleInput(props) {
    const { 
        holonHandles, setHolonHandles,
        newHandle, setNewHandle,
        suggestedHandlesOpen, setSuggestedHandlesOpen,
        suggestedHandles, setSuggestedHandles,
        newHandleError, setNewHandleError,
        flashMessage, setflashMessage,
        setCreatePostModalOpen
    } = props

    function getSuggestedHandles() {
        axios.get(config.environmentURL + `/suggested-holon-handles?searchQuery=${newHandle}`)
            .then(res => {
                let handles = res.data.filter(handle => !holonHandles.includes(handle.handle) )
                setSuggestedHandles(handles)
            })
    }

    function addHolonHandle(e) {
        e.preventDefault()
        axios.get(config.environmentURL + `/validate-holon-handle?searchQuery=${newHandle}`)
            .then(res => {
                if (res.data.length > 0) { setHolonHandles([...holonHandles, res.data.handle]) }
                else { setSuggestedHandlesOpen(false); setflashMessage(true); setNewHandleError(true) }
            })
    }

    function removeHolonHandle(handle) {
        let updatedHandles = holonHandles.filter((h) => { return h !== handle })
        setHolonHandles(updatedHandles)
    }

    useEffect(() => {
        if (newHandle.length > 0) { getSuggestedHandles(); setSuggestedHandlesOpen(true) } 
        else { setSuggestedHandlesOpen(false) }
    }, [newHandle])

    return (
        <div className={styles.holonHandleInput}>
            <div className={styles.text}>Tag the spaces you want the post to appear in:</div>
            <div className={styles.form}>
                <input className={`wecoInput mr-10 ${newHandleError && 'error'}`} style={{width: 200}}
                    type="text" placeholder="Add spaces..." value={newHandle}
                    onChange={(e) => {
                        setNewHandle(e.target.value)
                        setNewHandleError(false)
                        setflashMessage(false)
                    }}
                />
                {suggestedHandlesOpen && suggestedHandles.length > 0 &&
                    <div className={styles.dropDown}>
                        {suggestedHandles.map((handle, index) =>
                            <div className={styles.dropDownOption} key={index} onClick={() => { 
                                setHolonHandles([...holonHandles, handle.handle])
                                setSuggestedHandlesOpen(false)
                                setNewHandle('')}}>
                                {handle.handle}
                            </div>
                        )}
                    </div>
                }
                <button className="wecoButton" style={{flexShrink: 0}} onClick={addHolonHandle}>Add</button>
            </div>
            {flashMessage && 
                <div className={styles.flashMessage}>
                    Sorry, that space doesn't exist yet. You'll need to create it first on the 
                    <Link to="/s/all/spaces" onClick={() => setCreatePostModalOpen(false)}> <b>Spaces</b></Link> page.
                </div>
            }
            {holonHandles.length > 0 &&
                <div className={styles.addedSpaces}>
                    <div className={styles.text}>Added spaces: </div>
                    <ul className={styles.handles}>
                        {holonHandles.map((holonHandle, index) => 
                            <div className={styles.handle} key={index}>
                                <div className={styles.handleText}>{ holonHandle }</div>
                                <div className={styles.handleCloseIcon} onClick={() => removeHolonHandle(holonHandle)}></div>
                            </div>
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}

export default HolonHandleInput

// Find holons that match the search filter
//const filteredHolonHandles = globalData.filter(handle => handle.includes(newHandle))

// Suggest holons that haven't already been added to the post
//const suggestedHolonHandles = filteredHolonHandles.filter(handle => !holonHandles.find(b2 => handle === b2))

// function addHolonHandle(e) {
//     e.preventDefault()
//     const validHolonHandle = globalData.filter(holonHandle => (holonHandle === newHandle))
//     if (newHandle === '') {
//         setNewHandleError(true)
//     } else if (validHolonHandle.length === 0) {
//         setNewHandleError(true)
//         setflashMessage(true)
//     } else if (validHolonHandle.length && !holonHandles.includes(validHolonHandle[0]) ) {
//         setHolonHandles([...holonHandles, validHolonHandle[0]])
//         setNewHandle('')
//     }
// }

// function addSuggestedHolonHandle(holonHandle) {
//     setHolonHandles([...holonHandles, holonHandle])
// }
