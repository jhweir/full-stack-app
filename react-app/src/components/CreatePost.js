import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/CreatePost.module.scss'
import HolonTagInput from './HolonTagInput'

function CreatePost(props) {
    const { holonData, globalData, isLoading } = useContext(HolonContext);
    // const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [holonTags, setHolonTags] = useState([])
    const [newHolonTag, setNewHolonTag] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [holonError, setHolonError] = useState(false)
    const [holonErrorMessage, setHolonErrorMessage] = useState(false)

    // TODO: look into whether it would be better to strip out the unnecissary data included in 'HolonData' when passing this in
    // Add the current holon the user is in to the holonTag list when HolonContext has loaded
    useEffect(() => {
        setHolonTags([...holonTags, holonData])
    }, [isLoading])

    function addHolonTag(e) {
        e.preventDefault()
        const validHolonTag = globalData.filter(holonTag => (holonTag.handle === newHolonTag))
        if (newHolonTag === '') {
            setHolonError(true)
        } else if (validHolonTag.length === 0) {
            setHolonError(true)
            setHolonErrorMessage(true)
        } else if (validHolonTag.length && !holonTags.includes(validHolonTag[0]) ) {
            setHolonTags([...holonTags, validHolonTag[0]])
            setNewHolonTag('')
        }
    }

    function addSuggestedHolonTag(holonTag) {
        setHolonTags([...holonTags, holonTag])
    }

    function removeHolonTag(holonTag) {
        const updatedHolonTags = holonTags.filter((holonTags) => { return holonTags !== holonTag })
        setHolonTags(updatedHolonTags)
    }

    function submitPost(e) {
        e.preventDefault()
        if (title === '') { setTitleError(true) }
        if (description === '') { setDescriptionError(true) }
        // TODO: prevent submit if no spaces have been tagged and display error around holon tag input field
        if (title && description !== '') {
            let post = { title, description, holonTags }
            // TODO: update axios syntax below
            axios({ method: 'post', url: config.environmentURL + `/createPost`, data: { post } })
                .then(res => { console.log(res) })
                .then(props.toggleModal)
                // .then(setTimeout(() => { getBranchContent() }, 100))
        }
    }

    return (
        <div className={styles.createPostModalWrapper}>
            <div className={styles.createPostModal}>
            {/* use 'hide-scrollbars' class on createPostModal ? */}
                <form className={styles.createPostModalForm} onSubmit={ submitPost }>
                    <div className={styles.createPostModalTitle}>
                        Create a new post in '{ holonData.name }'
                    </div>
                    <input className={`${styles.createPostModalFormInput} ${(titleError && styles.error)}`}
                        type="text" placeholder="Title..." value={title}
                        onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}/>
                    <textarea className={`${styles.createPostModalFormInput} ${styles.textArea} ${(descriptionError && styles.error)}`}
                        rows="5" type="text" placeholder="Description..." value={description}
                        onChange={(e) => { setDescription(e.target.value); setDescriptionError(false) }}/>
                    <HolonTagInput 
                        globalData={globalData}
                        addHolonTag={addHolonTag}
                        removeHolonTag={removeHolonTag}
                        holonTags={holonTags}
                        newHolonTag={newHolonTag}
                        setNewHolonTag={setNewHolonTag}
                        holonError={holonError}
                        setHolonError={setHolonError}
                        holonErrorMessage={holonErrorMessage}
                        setHolonErrorMessage={setHolonErrorMessage}
                        addSuggestedHolonTag={addSuggestedHolonTag}/>
                    <div className={styles.createPostModalFormButtons}>
                        <button className="button">Post</button>
                        <div className="button" onClick={ props.toggleModal }>Cancel</div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost

{/* <div className={styles.createPostModalSubTitle}>Chose a post type:</div>
<div className={styles.createPostModalTypeSelector}>
    <div className={styles.createPostModalTypeSelectorButton}>Text</div>
    <div className={styles.createPostModalTypeSelectorButton}>Video</div>
    <div className={styles.createPostModalTypeSelectorButton}>Audio</div>
    <div className={styles.createPostModalTypeSelectorButton}>Poll</div>
</div> */}

{/* <input className="input-wrapper modal mb-20"
    type="text" placeholder="Username..." value={ user }
    onChange={(e) => setUser(e.target.value)}/> */}

