import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/SpaceInput.module.scss'
import { SpaceContext } from '../contexts/SpaceContext'

const SpaceInput = (props: {
    text?: string
    blockedSpaces: string[]
    addedSpaces: string[]
    setAddedSpaces: (payload: any) => void
    newSpaceError: boolean
    setNewSpaceError: (payload: boolean) => void
    setParentModalOpen: (payload: boolean) => void
    centered: boolean
}): JSX.Element => {
    const {
        text,
        blockedSpaces,
        addedSpaces,
        setAddedSpaces,
        newSpaceError,
        setNewSpaceError,
        setParentModalOpen,
        centered,
    } = props

    const { spaceData } = useContext(SpaceContext)

    const [newSpace, setNewSpace] = useState('')
    const [suggestedSpacesOpen, setSuggestedSpacesOpen] = useState(false)
    const [suggestedSpaces, setSuggestedSpaces] = useState([])
    const [flashMessage, setflashMessage] = useState(false)

    function getSuggestedSpaces() {
        axios
            .get(`${config.apiURL}/suggested-space-handles?searchQuery=${newSpace}`)
            .then((res) => {
                const spaces = res.data
                    .filter(
                        (space) =>
                            !addedSpaces.includes(space.handle) &&
                            !blockedSpaces.includes(space.handle) &&
                            space.handle !== spaceData.handle
                    )
                    .map((space) => space.handle)
                setSuggestedSpaces(spaces)
            })
    }

    function addSpace(e) {
        e.preventDefault()
        axios.get(`${config.apiURL}/validate-space-handle?searchQuery=${newSpace}`).then((res) => {
            if (res.data === 'success') {
                setAddedSpaces([...addedSpaces, newSpace])
                setSuggestedSpacesOpen(false)
                setNewSpace('')
            } else {
                setSuggestedSpacesOpen(false)
                setflashMessage(true)
                setNewSpaceError(true)
            }
        })
    }

    function removeSpace(space) {
        const updatedSpaces = addedSpaces.filter((s) => {
            return s !== space
        })
        setAddedSpaces(updatedSpaces)
    }

    useEffect(() => {
        if (newSpace.length > 0) {
            getSuggestedSpaces()
            setSuggestedSpacesOpen(true)
        } else {
            setSuggestedSpacesOpen(false)
        }
    }, [newSpace])

    return (
        <div className={`${styles.spaceInput} ${centered && styles.centered}`}>
            {text && <div className={styles.text}>{text}</div>}
            <div className={styles.form}>
                <input
                    className={`wecoInput mr-10 ${newSpaceError && 'error'}`}
                    style={{ width: 200 }}
                    type='text'
                    placeholder='Add spaces...'
                    value={newSpace}
                    onChange={(e) => {
                        setNewSpace(e.target.value)
                        setNewSpaceError(false)
                        setflashMessage(false)
                    }}
                />
                {suggestedSpacesOpen && suggestedSpaces.length > 0 && (
                    <div className={styles.dropDown}>
                        {suggestedSpaces.map((handle) => (
                            <div
                                className={styles.dropDownOption}
                                key={handle}
                                onClick={() => {
                                    setAddedSpaces([...addedSpaces, handle])
                                    setSuggestedSpacesOpen(false)
                                    setNewSpace('')
                                }}
                                onKeyDown={() => {
                                    setAddedSpaces([...addedSpaces, handle])
                                    setSuggestedSpacesOpen(false)
                                    setNewSpace('')
                                }}
                                role='button'
                                tabIndex={0}
                            >
                                {handle}
                            </div>
                        ))}
                    </div>
                )}
                <button
                    className='wecoButton'
                    style={{ flexShrink: 0 }}
                    onClick={addSpace}
                    onKeyDown={addSpace}
                    type='button'
                    tabIndex={0}
                >
                    Add
                </button>
            </div>
            {flashMessage && (
                <div className={styles.flashMessage}>
                    No space with that name. Create it
                    <Link to='/s/all/spaces' onClick={() => setParentModalOpen(false)}>
                        <b> here</b>
                    </Link>
                    .
                </div>
            )}
            {addedSpaces.length > 0 && (
                <div className={styles.spacesWrapper}>
                    {/* <div className={styles.text}>Added spaces: </div> */}
                    <ul className={styles.spaces}>
                        {addedSpaces.map((space) => (
                            <div className={styles.space} key={space}>
                                <div className={styles.spaceText}>{space}</div>
                                <div
                                    className={styles.spaceCloseIcon}
                                    onClick={() => removeSpace(space)}
                                    role='button'
                                    onKeyDown={() => removeSpace(space)}
                                    tabIndex={0}
                                    aria-label='remove space'
                                />
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

SpaceInput.defaultProps = {
    text: null,
}

export default SpaceInput
