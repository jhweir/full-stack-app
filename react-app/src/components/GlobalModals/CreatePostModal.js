import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import { AccountContext } from '../../contexts/AccountContext'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CreatePostModal.module.scss'
import HolonHandleInput from './HolonHandleInput'
import PollAnswerForm from './../PostPage/Poll/PollAnswerForm'
import DropDownMenu from '../DropDownMenu'

function CreatePostModal() {
    const { globalData, accountData, createPostModalOpen, setCreatePostModalOpen } = useContext(AccountContext)
    const { holonData, getHolonPosts } = useContext(HolonContext)

    const [postType, setPostType] = useState('Text')
    const [pollType, setPollType] = useState('Single-Choice')
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')
    const [holonHandles, setHolonHandles] = useState([])
    const [newHandle, setNewHandle] = useState('')
    const [suggestedHandlesOpen, setSuggestedHandlesOpen] = useState(false)
    const [suggestedHandles, setSuggestedHandles] = useState([])
    const [textError, setTextError] = useState(false)
    const [handleError, setHandleError] = useState(false)
    const [flashMessage, setflashMessage] = useState(false)
    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')

    useEffect(() => {
        if (holonData.id) { setHolonHandles([holonData.handle]) }
    }, [holonData])

    function submitPost(e) {
        e.preventDefault()
        let invalidText = text.length === 0 || text.length > 2000
        let invalidHolons = holonHandles.length === 0
        if (invalidText) { setTextError(true) }
        if (invalidHolons) { setHandleError(true) }
        if (!invalidText && !invalidHolons) {
            let subType, answers
            if (postType === 'Poll') { subType = pollType.toLowerCase(); answers = pollAnswers } else { subType = null; answers = null }
            let post = { type: postType.toLowerCase(), subType, creatorId: accountData.id, text, url, holonHandles, pollAnswers: answers }
            axios.post(config.environmentURL + '/create-post', { post })
                .then(() => { 
                    setCreatePostModalOpen(false)
                    setPostType('Text')
                    setPollType('Single-Choice')
                    setText('')
                    setUrl('')
                    setPollAnswers([])
                })
                .then(setTimeout(() => { getHolonPosts() }, 200))
        }
    }

    if (createPostModalOpen) {
        return (
            <div className={styles.modalWrapper}>
                <div className={styles.modal}>
                    <img 
                        className={styles.closeModalButton}
                        src="/icons/close-01.svg"
                        onClick={() => setCreatePostModalOpen(false)}
                    />
                    <div className={styles.title}>
                        Create a new {postType} post in '{holonData.name}'
                    </div>
                    <div className={styles.dropDownOptions}>
                        <DropDownMenu
                            title='Post Type'
                            options={['Text', 'Poll', 'Task']}
                            selectedOption={postType}
                            setSelectedOption={setPostType}
                            style='horizontal'
                        />
                        {postType === 'Poll' &&
                            <DropDownMenu
                                title='Poll Type'
                                options={['Single Choice', 'Multiple Choice', 'Weighted Choice']}
                                selectedOption={pollType}
                                setSelectedOption={setPollType}
                                style='horizontal'
                            />
                        }
                    </div>
                    <form className={styles.createPostModalForm} onSubmit={ submitPost }>
                        <textarea className={`wecoInput textArea mb-10 ${textError && 'error'}`}
                            placeholder="Text (max 20,000 characters)"
                            type="text" value={text}
                            onChange={(e) => { setText(e.target.value); setTextError(false) }}
                        />
                        <input className={`wecoInput mb-20`}
                            placeholder="URL"
                            type="text" value={url}
                            onChange={(e) => { setUrl(e.target.value) }}
                        />
                        <HolonHandleInput 
                            //globalData={globalData}
                            holonHandles={holonHandles}
                            setHolonHandles={setHolonHandles}
                            newHandle={newHandle}
                            setNewHandle={setNewHandle}
                            suggestedHandlesOpen={suggestedHandlesOpen}
                            setSuggestedHandlesOpen={setSuggestedHandlesOpen}
                            suggestedHandles={suggestedHandles}
                            setSuggestedHandles={setSuggestedHandles}
                            handleError={handleError}
                            setHandleError={setHandleError}
                            flashMessage={flashMessage}
                            setflashMessage={setflashMessage}
                        />
                        {postType === 'Poll' &&
                            <PollAnswerForm
                                pollAnswers={pollAnswers}
                                setPollAnswers={setPollAnswers}
                                newPollAnswer={newPollAnswer}
                                setNewPollAnswer={setNewPollAnswer}
                            />
                        }
                        <button className="wecoButton centered">Post</button>
                    </form>
                </div>
            </div>
        )
    } else { return null }
}

export default CreatePostModal

// {postType === 'Poll' &&
// <div className={styles.pollTypeSelector}>
//     <span className={styles.pollTypeSelectorText}>Choose a poll type</span>
//     <div className={styles.pollTypeSelectorOptions}>
//         <div className="button" onClick={() => { setPollType('single-choice') }}>Single Choice</div>
//         <div className="button" onClick={() => { setPollType('multiple-choice') }}>Multiple Choice</div>
//         <div className="button" onClick={() => { setPollType('weighted-choice') }}>Weighted Choice</div>
//     </div>
//     <span className={styles.pollTypeSelectorText}>Selected poll type: {pollType}</span>
// </div>
// }

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