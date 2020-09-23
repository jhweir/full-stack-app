import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/SpaceInput.module.scss'
import { HolonContext } from '../contexts/HolonContext'

function SpaceInput(props) {
    const {
        text,
        blockedSpaces,
        addedSpaces, setAddedSpaces,
        newSpaceError, setNewSpaceError,
        setParentModalOpen
    } = props

    const { holonData } = useContext(HolonContext)

    const [newSpace, setNewSpace] = useState('')
    const [suggestedSpacesOpen, setSuggestedSpacesOpen] = useState(false)
    const [suggestedSpaces, setSuggestedSpaces] = useState([])
    const [flashMessage, setflashMessage] = useState(false)

    function getSuggestedSpaces() {
        axios
            .get(config.environmentURL + `/suggested-space-handles?searchQuery=${newSpace}`)
            .then(res => {
                let spaces = res.data.filter(space => !addedSpaces.includes(space.handle) && !blockedSpaces.includes(space.handle))
                setSuggestedSpaces(spaces)
            })
    }

    function addSpace(e) {
        e.preventDefault()
        axios
            .get(config.environmentURL + `/validate-space-handle?searchQuery=${newSpace}`)
            .then(res => {
                if (res.data === 'success') { 
                    setAddedSpaces([...addedSpaces, newSpace])
                    setSuggestedSpacesOpen(false)
                    setNewSpace('')
                }
                else { 
                    setSuggestedSpacesOpen(false)
                    setflashMessage(true)
                    setNewSpaceError(true)
                }
            })
    }

    function removeSpace(space) {
        const updatedSpaces = addedSpaces.filter((s) => { return s !== space })
        setAddedSpaces(updatedSpaces)
    }

    useEffect(() => {
        if (newSpace.length > 0) { getSuggestedSpaces(); setSuggestedSpacesOpen(true) } 
        else { setSuggestedSpacesOpen(false) }
    }, [newSpace])

    return (
        <div className={styles.spaceInput}>
            {text && <div className={styles.text}>{text}</div>}
            <div className={styles.form}>
                <input className={`wecoInput mr-10 ${newSpaceError && 'error'}`} style={{width: 200}}
                    type="text" placeholder="Add spaces..." value={newSpace}
                    onChange={(e) => {
                        setNewSpace(e.target.value)
                        setNewSpaceError(false)
                        setflashMessage(false)
                    }}
                />
                {suggestedSpacesOpen && suggestedSpaces.length > 0 &&
                    <div className={styles.dropDown}>
                        {suggestedSpaces.map((handle, index) =>
                            <div className={styles.dropDownOption} key={index} onClick={() => { 
                                setAddedSpaces([...addedSpaces, handle.handle])
                                setSuggestedSpacesOpen(false)
                                setNewSpace('')}}>
                                {handle.handle}
                            </div>
                        )}
                    </div>
                }
                <button className="wecoButton" style={{flexShrink: 0}} onClick={addSpace}>Add</button>
            </div>
            {flashMessage &&
                <div className={styles.flashMessage}>
                    No space with that name. Create it
                    <Link to="/s/all/spaces" onClick={() => setParentModalOpen(false)}><b> here</b></Link>.
                </div>
            }
            {addedSpaces.length > 0 &&
                <div className={styles.spacesWrapper}>
                    {/* <div className={styles.text}>Added spaces: </div> */}
                    <ul className={styles.spaces}>
                        {addedSpaces.map((space, index) =>
                            <div className={styles.space} key={index}>
                                <div className={styles.spaceText}>{space}</div>
                                {space !== holonData.handle && // prevent users from removing the space they are currently in
                                    <div
                                        className={styles.spaceCloseIcon}
                                        onClick={() => removeSpace(space)}
                                    />
                                }
                            </div>
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}

export default SpaceInput
