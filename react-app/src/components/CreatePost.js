import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/CreatePost.module.scss'
import HolonTagInput from './HolonTagInput'
import PollAnswerForm from './PollAnswerForm'

function CreatePost(props) {
    const { holonData, globalData, isLoading } = useContext(HolonContext)
    const [type, setPostType] = useState('')
    // const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [holonTags, setHolonTags] = useState([])
    const [newHolonTag, setNewHolonTag] = useState('')
    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [holonError, setHolonError] = useState(false)
    const [holonErrorMessage, setHolonErrorMessage] = useState(false)

    // TODO: look into whether it would be better to strip out the unnecissary data included in 'HolonData' when passing it into the holonTags:
    useEffect(() => {
        setHolonTags([...holonTags, holonData])
    }, [isLoading])

    function submitPost(e) {
        e.preventDefault()
        let invalidTitle = title.length === 0 || title.length > 200
        let invalidDescription = description.length > 20000
        let invalidHolons = holonTags.length === 0
        if (invalidTitle) { setTitleError(true) }
        if (invalidDescription) { setDescriptionError(true) }
        if (invalidHolons) { setHolonError(true) }
        if (!invalidTitle && !invalidDescription && !invalidHolons) {
            let post = { type, title, description, url, holonTags, pollAnswers }
            axios.post(config.environmentURL + '/createPost', { post })
                .then(res => { console.log(res) })
                .then(props.toggleModal)
                // .then(setTimeout(() => { getBranchContent() }, 100))
        }
    }

    return (
        <div className={styles.createPostModalWrapper}>
            <div className={styles.createPostModal}>
            {/* use 'hide-scrollbars' class on createPostModal ? */}
                <div className={styles.createPostModalTitle}>
                    Create a new {type} post in '{ holonData.name }'
                </div>
                {!type &&
                    <>
                        <div className={styles.createPostModalSubTitle}>Chose a post type:</div>
                        <div className={styles.createPostModalTypeSelector}>
                            <div className={styles.createPostModalTypeSelectorButton} onClick={() => { setPostType('text') }}>Text</div>
                            <div className={styles.createPostModalTypeSelectorButton} onClick={() => { setPostType('poll') }}>Poll</div>
                        </div>
                    </>
                }
                {type &&
                    <form className={styles.createPostModalForm} onSubmit={ submitPost }>
                        <input className={`${styles.createPostModalFormInput} ${(titleError && styles.error)}`}
                            placeholder="Title... (required, max 200 characters)"
                            type="text" value={title}
                            onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}
                        />
                        <textarea className={`${styles.createPostModalFormInput} ${styles.textArea} ${(descriptionError && styles.error)}`}
                            placeholder="Description... (optional, max 20,000 characters)"
                            rows="5" type="text" value={description}
                            onChange={(e) => { setDescription(e.target.value); setDescriptionError(false) }}
                        />
                        <input className={styles.createPostModalFormInput}
                            placeholder="URL... (optional)"
                            type="text" value={url}
                            onChange={(e) => { setUrl(e.target.value) }}
                        />
                        <HolonTagInput 
                            globalData={globalData}
                            holonTags={holonTags}
                            setHolonTags={setHolonTags}
                            newHolonTag={newHolonTag}
                            setNewHolonTag={setNewHolonTag}
                            holonError={holonError}
                            setHolonError={setHolonError}
                            holonErrorMessage={holonErrorMessage}
                            setHolonErrorMessage={setHolonErrorMessage}
                        />
                        {type === 'poll' &&
                            <PollAnswerForm
                                pollAnswers={pollAnswers}
                                setPollAnswers={setPollAnswers}
                                newPollAnswer={newPollAnswer}
                                setNewPollAnswer={setNewPollAnswer}
                            />
                        }
                        <div className={styles.createPostModalFormButtons}>
                            <button className="button">Post</button>
                            <div className="button" onClick={ props.toggleModal }>Cancel</div>
                        </div>
                    </form>
                }
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

