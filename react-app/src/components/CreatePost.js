import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/CreatePost.module.scss'
import HolonHandleInput from './HolonHandleInput'
import PollAnswerForm from './PollAnswerForm'

function CreatePost(props) {
    const { holonData, globalData, isLoading, updateHolonContext } = useContext(HolonContext)
    const { accountData } = useContext(AccountContext)
    const { toggleModal } = props
    const [type, setPostType] = useState('')
    // const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [holonHandles, setHolonHandles] = useState([])
    const [newHolonHandle, setNewHolonHandle] = useState('')
    const [pollType, setPollType] = useState('single-choice')
    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [holonError, setHolonError] = useState(false)
    const [holonErrorMessage, setHolonErrorMessage] = useState(false)

    // TODO: look into whether it would be better to strip out the unnecissary data included in 'HolonData' when passing it into the holonHandles
    // Also may be possible to move this use of state into a simpler variable
    useEffect(() => {
        setHolonHandles([...holonHandles, holonData.handle]) //holonData.HolonTags...
    }, [isLoading])

    function submitPost(e) {
        e.preventDefault()
        let invalidTitle = title.length === 0 || title.length > 200
        let invalidDescription = description.length > 20000
        let invalidHolons = holonHandles.length === 0
        if (invalidTitle) { setTitleError(true) }
        if (invalidDescription) { setDescriptionError(true) }
        if (invalidHolons) { setHolonError(true) }
        if (!invalidTitle && !invalidDescription && !invalidHolons) {
            //console.log('accountData.name:', accountData.name)
            let post = { type, subType: pollType, creatorId: accountData.id, title, description, url, holonHandles, pollAnswers }
            axios.post(config.environmentURL + '/create-post', { post })
                //.then(res => { console.log(res) })
                .then(toggleModal)
                .then(setTimeout(() => { updateHolonContext(holonData.handle) }, 200))
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
                        {type === 'poll' &&
                            <div className={styles.pollTypeSelector}>
                                <span className={styles.pollTypeSelectorText}>Choose a poll type</span>
                                <div className={styles.pollTypeSelectorOptions}>
                                    <div className="button" onClick={() => { setPollType('single-choice') }}>Single Choice</div>
                                    <div className="button" onClick={() => { setPollType('multiple-choice') }}>Multiple Choice</div>
                                    <div className="button" onClick={() => { setPollType('weighted-choice') }}>Weighted Choice</div>
                                </div>
                                <span className={styles.pollTypeSelectorText}>Selected poll type: {pollType}</span>
                            </div>
                        }
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
                        <HolonHandleInput 
                            globalData={globalData}
                            holonHandles={holonHandles}
                            setHolonHandles={setHolonHandles}
                            newHolonHandle={newHolonHandle}
                            setNewHolonHandle={setNewHolonHandle}
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

