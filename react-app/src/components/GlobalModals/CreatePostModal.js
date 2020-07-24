import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import { AccountContext } from '../../contexts/AccountContext'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CreatePostModal.module.scss'
import CreatePostModalHolonHandleInput from './CreatePostModalHolonHandleInput'
import PollAnswerForm from './../PostPage/Poll/PollAnswerForm'

function CreatePostModal(props) {
    const { globalData, accountData, createPostModalOpen, setCreatePostModalOpen } = useContext(AccountContext)
    const { holonData, holonContextLoading, getHolonPosts } = useContext(HolonContext)
    const [type, setPostType] = useState('')
    // const [user, setUser] = useState('')
    const [text, setText] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [holonHandles, setHolonHandles] = useState([])
    const [newHolonHandle, setNewHolonHandle] = useState('')
    const [pollType, setPollType] = useState('single-choice')
    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')
    const [textError, setTextError] = useState(false)
    const [holonError, setHolonError] = useState(false)
    const [holonErrorMessage, setHolonErrorMessage] = useState(false)

    // TODO: look into whether it would be better to strip out the unnecissary data included in 'HolonData' when passing it into the holonHandles
    // Also may be possible to move this use of state into a simpler variable
    useEffect(() => {
        setHolonHandles([...holonHandles, holonData.handle]) //holonData.HolonTags...
    }, [])

    function submitPost(e) {
        e.preventDefault()
        let invalidText = text.length === 0 || text.length > 2000
        let invalidHolons = holonHandles.length === 0
        if (invalidText) { setTextError(true) }
        if (invalidHolons) { setHolonError(true) }
        if (!invalidText && !invalidHolons) {
            //console.log('accountData.name:', accountData.name)
            let post = { type, subType: pollType, creatorId: accountData.id, text, url, holonHandles, pollAnswers }
            axios.post(config.environmentURL + '/create-post', { post })
                //.then(res => { console.log(res) })
                .then(setCreatePostModalOpen(false))
                .then(setTimeout(() => { getHolonPosts() }, 200))
        }
    }

    if (createPostModalOpen) {
        return (
            <div className={styles.createPostModalWrapper}>
                <div className={styles.createPostModal}>
                    <div className={styles.createPostModalTitle}>
                        Create a new {type} post in '{ holonData.name }'
                    </div>
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
                        <input className={`wecoInput mb-10 ${textError && 'error'}`}
                            placeholder="Text (max 20,000 characters)"
                            type="text" value={ text }
                            onChange={(e) => { setText(e.target.value); setTextError(false) }}
                        />
                        {/* <textarea className={`${styles.createPostModalFormInput} ${styles.textArea} ${(descriptionError && styles.error)}`}
                            placeholder="Description... (optional, max 20,000 characters)"
                            rows="5" type="text" value={description}
                            onChange={(e) => { setDescription(e.target.value); setDescriptionError(false) }}
                        /> */}
                        <input className={styles.createPostModalFormInput}
                            placeholder="URL"
                            type="text" value={url}
                            onChange={(e) => { setUrl(e.target.value) }}
                        />
                        <CreatePostModalHolonHandleInput 
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
                            <div className="button" onClick={() => setCreatePostModalOpen(false)}>Cancel</div>
                        </div>
                    </form>
                </div>
            </div>
        )
    } else { return null }
}

export default CreatePostModal

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

// {!type &&
//     <>
//         <div className={styles.createPostModalSubTitle}>Chose a post type:</div>
//         <div className={styles.createPostModalTypeSelector}>
//             <div className={styles.createPostModalTypeSelectorButton} onClick={() => { setPostType('text') }}>Text</div>
//             <div className={styles.createPostModalTypeSelectorButton} onClick={() => { setPostType('poll') }}>Poll</div>
//         </div>
//     </>
// }