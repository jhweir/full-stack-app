import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../../contexts/HolonContext'
import { AccountContext } from '../../contexts/AccountContext'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CreatePostModal.module.scss'
import UrlPreview from './UrlPreview'
import SpaceInput from '../SpaceInput'
import PollAnswerForm from '../PostPage/Poll/PollAnswerForm'
import DropDownMenu from '../DropDownMenu'

function CreatePostModal() {
    const { accountData, setCreatePostModalOpen } = useContext(AccountContext)
    const { holonData, getHolonPosts } = useContext(HolonContext)

    const [postType, setPostType] = useState('Url')
    const [pollType, setPollType] = useState('Single Choice')
    const [text, setText] = useState('')
    const [textError, setTextError] = useState(false)
    const [url, setUrl] = useState(null)
    const [urlLoading, setUrlLoading] = useState(false)
    const [urlImage, setUrlImage] = useState(null)
    const [urlDomain, setUrlDomain] = useState(null)
    const [urlTitle, setUrlTitle] = useState(null)
    const [urlDescription, setUrlDescription] = useState(null)
    const [urlFlashMessage, setUrlFlashMessage] = useState('')

    const [addedSpaces, setAddedSpaces] = useState([])
    const [newSpaceError, setNewSpaceError] = useState(false)

    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')
    const [newPollAnswerError, setNewPollAnswerError] = useState(false)

    const [numberOfPrismPlayers, setNumberOfPrismPlayers] = useState(3)
    const [prismDuration, setPrismDuration] = useState('1 Month')
    const [prismVisibility, setPrismVisibility] = useState('Private')

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
                    } else {
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
        setPostType('Url')
        setPollType('Single Choice')
        setText(null)
        setUrl(null)
        setUrlImage(null)
        setUrlDomain(null)
        setUrlTitle(null)
        setUrlDescription(null)
        setPollAnswers([])
    }

    function submitPost() {
        let invalidText = ((text === null || text.length < 1 || text.length > 2000) && url === null)
        let invalidHolons = addedSpaces.length < 1
        let invalidPollAnswers = postType === 'Poll' && pollAnswers.length < 1
        if (invalidText) { setTextError(true) }
        if (invalidHolons) { setNewSpaceError(true) }
        if (invalidPollAnswers) { setNewPollAnswerError(true) }
        if (!invalidText && !invalidHolons && !invalidPollAnswers && !urlLoading) {
            let subType, answers
            if (postType === 'Poll') {
                if (pollType === 'Single Choice') { subType = 'single-choice' }
                if (pollType === 'Multiple Choice') { subType = 'multiple-choice' }
                if (pollType === 'Weighted Choice') { subType = 'weighted-choice' }
                answers = pollAnswers
            }
            else { subType = null; answers = null }
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
                holonHandles: addedSpaces,
                pollAnswers: answers
            }
            axios.post(config.environmentURL + '/create-post', { post })
                .then(() => { setCreatePostModalOpen(false); resetForm() })
                .then(setTimeout(() => { getHolonPosts() }, 200))
        }
    }

    // useEffect(() => {
    //     if (holonData && holonData.id) { setAddedSpaces([holonData.handle]) }
    // }, [holonData])

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setCreatePostModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <img 
                    className={styles.closeModalButton}
                    src="/icons/close-01.svg"
                    onClick={() => {setCreatePostModalOpen(false); resetForm()}}
                />
                <div className={styles.title}>
                    Create a new post in 
                    {/* '{holonData.name}' */}
                    <Link to={`/s/${holonData.handle}`}
                        className='ml-5 blueText'
                        onClick={() => {setCreatePostModalOpen(false); resetForm()}}>
                        {holonData.name}
                    </Link>
                </div>
                <div className={styles.dropDownOptions}>
                    <DropDownMenu
                        title='Post Type'
                        options={['Text', 'Url', 'Poll', 'Prism']}
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
                    {postType === 'Prism' &&
                        <>
                            <DropDownMenu
                                title='Number Of Players'
                                options={[3, 6, 12]}
                                selectedOption={numberOfPrismPlayers}
                                setSelectedOption={setNumberOfPrismPlayers}
                                style='horizontal'
                            />
                            <DropDownMenu
                                title='Duration'
                                options={['1 Week', '1 Month', '1 Year']}
                                selectedOption={prismDuration}
                                setSelectedOption={setPrismDuration}
                                style='horizontal'
                            />
                            <DropDownMenu
                                title='Visibility'
                                options={['Private', 'Public']}
                                selectedOption={prismVisibility}
                                setSelectedOption={setPrismVisibility}
                                style='horizontal'
                            />
                        </>
                    }
                </div>
                <form className={styles.form}>
                    <textarea className={`wecoInput textArea mb-10 ${textError && 'error'}`}
                        placeholder="Text (max 20,000 characters)"
                        type="text" value={text}
                        onChange={(e) => { setText(e.target.value); setTextError(false) }}
                    />
                    {postType === 'Url' && <input className={`wecoInput mb-10`}
                        placeholder="Url"
                        type="url" value={url}
                        onChange={(e) => {
                            setUrlFlashMessage('')
                            setUrl(e.target.value)
                            scrapeURL(e.target.value)
                        }}
                    />}
                    <UrlPreview
                        url={url}
                        urlLoading={urlLoading}
                        urlImage={urlImage}
                        urlDomain={urlDomain}
                        urlTitle={urlTitle}
                        urlDescription={urlDescription}
                        urlFlashMessage={urlFlashMessage}
                    />
                    <SpaceInput
                        text='Tag other spaces you want the post to appear in:'
                        blockedSpaces={[]}
                        addedSpaces={addedSpaces} setAddedSpaces={setAddedSpaces}
                        newSpaceError={newSpaceError} setNewSpaceError={setNewSpaceError}
                        setParentModalOpen={setCreatePostModalOpen}
                    />
                    {postType === 'Poll' && <PollAnswerForm
                        pollAnswers={pollAnswers}
                        setPollAnswers={setPollAnswers}
                        newPollAnswer={newPollAnswer}
                        setNewPollAnswer={setNewPollAnswer}
                        newPollAnswerError={newPollAnswerError}
                        setNewPollAnswerError={setNewPollAnswerError}
                    />}
                    <div
                        className={`wecoButton centered ${postType === 'Prism' && 'disabled'}`}
                        onClick={() => { if (postType !== 'Prism') submitPost() }}>
                        Submit Post
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePostModal
