import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/HolonHandleInput.module.scss'
import CreatePostModalHolonHandle from './CreatePostModalHolonHandle'

function HolonHandleInput(props) {
    const { 
        //globalData,
        holonHandles, setHolonHandles,
        newHandle, setNewHandle,
        suggestedHandlesOpen, setSuggestedHandlesOpen,
        suggestedHandles, setSuggestedHandles,
        handleError, setHandleError,
        flashMessage, setflashMessage
    } = props

    

    function getSuggestedHandles() {
        axios.get(config.environmentURL + `/suggested-holon-handles?searchQuery=${newHandle}`)
            .then(res => setSuggestedHandles(res.data))
    }

    useEffect(() => {
        if (newHandle.length > 0) { getSuggestedHandles(); setSuggestedHandlesOpen(true) } 
        else { setSuggestedHandlesOpen(false) }
    }, [newHandle])

    function addHolonHandle(e) {
        e.preventDefault()
    }

    // Find holons that match the search filter
    //const filteredHolonHandles = globalData.filter(handle => handle.includes(newHandle))
    
    // Suggest holons that haven't already been added to the post
    //const suggestedHolonHandles = filteredHolonHandles.filter(handle => !holonHandles.find(b2 => handle === b2))

    // function addHolonHandle(e) {
    //     e.preventDefault()
    //     const validHolonHandle = globalData.filter(holonHandle => (holonHandle === newHandle))
    //     if (newHandle === '') {
    //         setHandleError(true)
    //     } else if (validHolonHandle.length === 0) {
    //         setHandleError(true)
    //         setflashMessage(true)
    //     } else if (validHolonHandle.length && !holonHandles.includes(validHolonHandle[0]) ) {
    //         setHolonHandles([...holonHandles, validHolonHandle[0]])
    //         setNewHandle('')
    //     }
    // }

    // function addSuggestedHolonHandle(holonHandle) {
    //     setHolonHandles([...holonHandles, holonHandle])
    // }

    function removeHolonHandle(holonHandle) {
        const updatedHolonHandles = holonHandles.filter((holonHandles) => { return holonHandles !== holonHandle })
        setHolonHandles(updatedHolonHandles)
    }

    return (
        <div className={styles.holonHandleInput}>
            <div className={styles.text}>Add the names of spaces you want the post to appear in below:</div>
            <div className={styles.form}>
                <input className={`wecoInput mr-10 ${handleError && 'error'}`} style={{width: 200}}
                    type="text" placeholder="Add spaces..." value={newHandle}
                    onChange={(e) => {
                        setNewHandle(e.target.value)
                        setHandleError(false)
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
                <button className="wecoButton" style={{flexShrink: 0}} onClick={addHolonHandle}>Add space</button>
            </div>
            {flashMessage && 
                <div className={styles.flashMessage}>
                    Sorry, that space doesn't exist yet. You'll need to create it first on the 
                    <Link to="/h/root/spaces"> Spaces</Link> page.
                </div>
            }
            {holonHandles.length > 0 &&
                <>
                    <div className={styles.text}>Added spaces: </div>
                    <ul className={styles.handles}>
                        {holonHandles.map((holonHandle, index) => 
                            <CreatePostModalHolonHandle holonHandle={holonHandle} key={index} removeHolonHandle={removeHolonHandle} added={true}/>
                        )}
                    </ul>
                </>
            }
        </div>
    )
}

export default HolonHandleInput
