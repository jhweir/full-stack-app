import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import { AccountContext } from '../../contexts/AccountContext'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CreatePostModal.module.scss'
import UrlPreview from './UrlPreview'
import HandleInput from './HandleInput'
import PollAnswerForm from './../PostPage/Poll/PollAnswerForm'
import DropDownMenu from '../DropDownMenu'

function CreatePostModal() {
    const { accountData, setCreatePostModalOpen } = useContext(AccountContext)
    const { holonData, getHolonPosts } = useContext(HolonContext)

    const [postType, setPostType] = useState('Text')
    const [pollType, setPollType] = useState('Single Choice')
    const [text, setText] = useState(null)
    const [url, setUrl] = useState(null)
    const [urlLoading, setUrlLoading] = useState(false)
    const [urlImage, setUrlImage] = useState(null)
    const [urlDomain, setUrlDomain] = useState(null)
    const [urlTitle, setUrlTitle] = useState(null)
    const [urlDescription, setUrlDescription] = useState(null)
    const [urlFlashMessage, setUrlFlashMessage] = useState('')
    const [holonHandles, setHolonHandles] = useState([])
    const [newHandle, setNewHandle] = useState('')
    const [suggestedHandlesOpen, setSuggestedHandlesOpen] = useState(false)
    const [suggestedHandles, setSuggestedHandles] = useState([])
    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')
    const [textError, setTextError] = useState(false)
    const [newHandleError, setNewHandleError] = useState(false)
    const [newPollAnswerError, setNewPollAnswerError] = useState(false)
    const [flashMessage, setflashMessage] = useState(false)

    function isValidUrl(string) {
        try { new URL(string) }
        catch (_) { return false }
        return true
    }
    
    function scrapeURL(url) {
        if (isValidUrl(url)) {
            setUrlLoading(true)
            axios
                .post(config.environmentURL + '/scrape-url', { url })
                .then(res => {
                    console.log('res: ', res.data)
                    if (typeof res.data === 'string') {
                        setUrlDescription(null)
                        setUrlDomain(null)
                        setUrlImage(null)
                        setUrlTitle(null)
                        setUrlFlashMessage(res.data)
                    }
                    else {
                        const { description, domain, img, title } = res.data
                        setUrlDescription(description)
                        setUrlDomain(domain)
                        setUrlImage(img)
                        setUrlTitle(title)
                    }
                })
                .then(() => { setUrlLoading(false) })
        } else {
            console.log('invalid Url')
            setUrlFlashMessage('invalid Url')
        }
    }

    function resetForm() {
        setPostType('Text')
        setPollType('Single Choice')
        setText(null)
        setUrl(null)
        setUrlImage(null)
        setUrlDomain(null)
        setUrlTitle(null)
        setUrlDescription(null)
        setPollAnswers([])
    }

    function submitPost(e) {
        e.preventDefault()
        let invalidText = ((text === null || text.length < 1 || text.length > 2000) && url === null)
        let invalidHolons = holonHandles.length < 1
        let invalidPollAnswers = postType === 'Poll' && pollAnswers.length < 1
        if (invalidText) { setTextError(true) }
        if (invalidHolons) { setNewHandleError(true) }
        if (invalidPollAnswers) { setNewPollAnswerError(true) }
        if (!invalidText && !invalidHolons && !invalidPollAnswers && !urlLoading) {
            let subType, answers
            if (postType === 'Poll') { subType = pollType.toLowerCase(); answers = pollAnswers } else { subType = null; answers = null }
            let post = { 
                type: postType.toLowerCase(),
                subType,
                state: 'visible',
                creatorId: accountData.id,
                text,
                url,
                urlImage,
                urlDomain,
                urlTitle,
                urlDescription,
                holonHandles,
                pollAnswers: answers
            }
            axios.post(config.environmentURL + '/create-post', { post })
                .then(() => { setCreatePostModalOpen(false); resetForm() })
                .then(setTimeout(() => { getHolonPosts() }, 200))
        }
    }

    useEffect(() => {
        if (holonData && holonData.id) { setHolonHandles([holonData.handle]) }
    }, [holonData])

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeModalButton}
                    src="/icons/close-01.svg"
                    onClick={() => { setCreatePostModalOpen(false); resetForm() }}
                />
                <div className={styles.title}>
                    Create a new post
                </div>
                <div className={styles.dropDownOptions}>
                    <DropDownMenu
                        title='Post Type'
                        options={['Text', 'Poll', 'Url']}
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
                <form className={styles.form} onSubmit={ submitPost }>
                    <textarea className={`wecoInput textArea mb-10 ${textError && 'error'}`}
                        placeholder="Text (max 20,000 characters)"
                        type="text" value={text}
                        onChange={(e) => { setText(e.target.value); setTextError(false) }}
                    />
                    {postType === 'Url' &&
                        <input className={`wecoInput mb-10`}
                            placeholder="Url"
                            type="url" value={url}
                            onChange={(e) => {
                                setUrlFlashMessage('')
                                setUrl(e.target.value)
                                scrapeURL(e.target.value)
                            }}
                        />
                    }
                    <UrlPreview
                        url={url}
                        urlLoading={urlLoading}
                        urlImage={urlImage}
                        urlDomain={urlDomain}
                        urlTitle={urlTitle}
                        urlDescription={urlDescription}
                        urlFlashMessage={urlFlashMessage}
                    />
                    <HandleInput 
                        holonHandles={holonHandles}
                        setHolonHandles={setHolonHandles}
                        newHandle={newHandle}
                        setNewHandle={setNewHandle}
                        suggestedHandlesOpen={suggestedHandlesOpen}
                        setSuggestedHandlesOpen={setSuggestedHandlesOpen}
                        suggestedHandles={suggestedHandles}
                        setSuggestedHandles={setSuggestedHandles}
                        newHandleError={newHandleError}
                        setNewHandleError={setNewHandleError}
                        flashMessage={flashMessage}
                        setflashMessage={setflashMessage}
                        setCreatePostModalOpen={setCreatePostModalOpen}
                    />
                    {postType === 'Poll' &&
                        <PollAnswerForm
                            pollAnswers={pollAnswers}
                            setPollAnswers={setPollAnswers}
                            newPollAnswer={newPollAnswer}
                            setNewPollAnswer={setNewPollAnswer}
                            newPollAnswerError={newPollAnswerError}
                            setNewPollAnswerError={setNewPollAnswerError}
                        />
                    }
                    <button className="wecoButton centered">Submit Post</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePostModal

// {postType.toLowerCase()}


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