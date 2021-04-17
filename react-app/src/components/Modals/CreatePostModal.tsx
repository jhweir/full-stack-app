import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { SpaceContext } from '../../contexts/SpaceContext'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import config from '../../Config'
import styles from '../../styles/components/CreatePostModal.module.scss'
// import UrlPreview from './UrlPreview'
import SpaceInput from '../SpaceInput'
import PollAnswerForm from '../PostPage/Poll/PollAnswerForm'
import DropDownMenu from '../DropDownMenu'
import SmallFlagImage from '../SmallFlagImage'
import PostCardPreview from '../Cards/PostCard/PostCardPreview'
import { resizeTextArea } from '../../Functions'
import CloseOnClickOutside from '../CloseOnClickOutside'
import CloseButton from '../CloseButton'

const CreatePostModal = (): JSX.Element => {
    const {
        setCreatePostModalOpen,
        createPostFromTurn,
        setCreatePostFromTurn,
        createPostFromTurnData,
        setCreatePostFromTurnData,
    } = useContext(AccountContext)
    const { spaceData, getSpaceData, getSpacePosts } = useContext(SpaceContext)
    const { setPostId } = useContext(PostContext)

    const [postType, setPostType] = useState('Url')
    const [subType, setSubType] = useState('')
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')
    const [urlLoading, setUrlLoading] = useState(false)
    const [urlImage, setUrlImage] = useState('')
    const [urlDomain, setUrlDomain] = useState('')
    const [urlTitle, setUrlTitle] = useState('')
    const [urlDescription, setUrlDescription] = useState('')
    // const [urlFlashMessage, setUrlFlashMessage] = useState('')
    const [addedSpaces, setAddedSpaces] = useState([])

    const [pollAnswers, setPollAnswers] = useState([])
    const [newPollAnswer, setNewPollAnswer] = useState('')

    const [numberOfPrismPlayers, setNumberOfPrismPlayers] = useState(3)
    const [prismDuration, setPrismDuration] = useState('1 Month')
    const [prismPrivacy, setPrismPrivacy] = useState('Private')

    const [numberOfPlotGraphAxes, setNumberOfPlotGraphAxes] = useState(0)
    const [axis1Left, setAxis1Left] = useState('')
    const [axis1Right, setAxis1Right] = useState('')
    const [axis2Top, setAxis2Top] = useState('')
    const [axis2Bottom, setAxis2Bottom] = useState('')
    const [axis1LeftError, setAxis1LeftError] = useState(false)
    const [axis1RightError, setAxis1RightError] = useState(false)
    const [axis2TopError, setAxis2TopError] = useState(false)
    const [axis2BottomError, setAxis2BottomError] = useState(false)

    const [textError, setTextError] = useState(false)
    const [urlError, setUrlError] = useState(false)
    const [newSpaceError, setNewSpaceError] = useState(false)
    const [newPollAnswerError, setNewPollAnswerError] = useState(false)

    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')

    function isValidUrl(string) {
        try {
            new URL(string)
        } catch (_) {
            return false
        }
        return true
    }

    const scrapeURL = (urlString: string): void => {
        if (isValidUrl(urlString)) {
            setUrlLoading(true)
            axios
                .get(`${config.apiURL}/scrape-url?url=${urlString}`)
                .then((res) => {
                    console.log('res: ', res.data)
                    if (typeof res.data === 'string') {
                        setUrlDescription('')
                        setUrlDomain('')
                        setUrlImage('')
                        setUrlTitle('')
                        // setUrlFlashMessage(res.data)
                    } else {
                        const { description, domain, img, title } = res.data
                        setUrlDescription(description)
                        setUrlDomain(domain)
                        setUrlImage(img)
                        setUrlTitle(title)
                    }
                })
                .then(() => {
                    setUrlLoading(false)
                })
        } else {
            console.log('invalid Url')
            // setUrlFlashMessage('invalid Url')
        }
    }

    function resetForm() {
        setPostType('Url')
        setSubType('')
        setText('')
        setUrl('')
        setUrlImage('')
        setUrlDomain('')
        setUrlTitle('')
        setUrlDescription('')
        setPollAnswers([])
        setCreatePostFromTurn(false)
        setCreatePostFromTurnData(null)
    }

    function createPost() {
        console.log('create post!')
        const invalidText = (!text.length || text.length > 2000) && !url.length
        const invalidUrl = postType === 'Url' && !url.length
        const invalidPollAnswers = postType === 'Poll' && pollAnswers.length < 2
        if (invalidText) {
            setTextError(true)
        }
        if (invalidUrl) {
            setUrlError(true)
        }
        if (invalidPollAnswers) {
            setNewPollAnswerError(true)
        }
        if (!invalidText && !invalidUrl && !invalidPollAnswers && !urlLoading && accessToken) {
            const post = {
                type: postType.replace(/\s+/g, '-').toLowerCase(),
                subType,
                state: 'visible',
                text,
                url,
                urlImage,
                urlDomain,
                urlTitle,
                urlDescription,
                spaceHandles: addedSpaces.length
                    ? [...addedSpaces, spaceData.handle]
                    : [spaceData.handle],
                pollAnswers,
                numberOfPrismPlayers,
                prismDuration,
                prismPrivacy,
                numberOfPlotGraphAxes,
                axis1Left,
                axis1Right,
                axis2Top,
                axis2Bottom,
                createPostFromTurnData,
            }
            axios
                .post(
                    `${config.apiURL}/create-post`,
                    { post },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                .then((res) => {
                    if (res.data === 'success') {
                        setCreatePostModalOpen(false)
                        resetForm()
                        setTimeout(() => {
                            getSpaceData()
                            getSpacePosts()
                        }, 300)
                    }
                })
        }
    }

    useEffect(() => {
        if (createPostFromTurn) setPostType('Glass Bead')
    }, [])

    useEffect(() => {
        if (postType === 'Poll') {
            setSubType('Single Choice')
        } else {
            setSubType('')
        }
        setNumberOfPlotGraphAxes(0)
    }, [postType])

    const closeForm = () => {
        setCreatePostModalOpen(false)
        resetForm()
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={closeForm}>
                <div className={styles.modal}>
                    <CloseButton onClick={closeForm} />
                    <div className={styles.title}>
                        Create a new{' '}
                        {postType !== 'Url' && postType !== 'Text'
                            ? postType.toLowerCase()
                            : 'post'}{' '}
                        in
                        <Link
                            to={`/s/${spaceData.handle}`}
                            className='ml-5 blueText'
                            onClick={closeForm}
                        >
                            {spaceData.name}
                        </Link>
                    </div>
                    {createPostFromTurn && (
                        <div className={styles.turnLink}>
                            <span className='mr-10'>Linked from</span>
                            <Link
                                className={styles.imageTextLink}
                                to={`/u/${createPostFromTurnData.creatorHandle}`}
                                onClick={closeForm}
                            >
                                <SmallFlagImage
                                    type='user'
                                    size={30}
                                    imagePath={createPostFromTurnData.creatorFlagImagePath}
                                />
                                <span className={styles.linkText}>
                                    {`${createPostFromTurnData.creatorName}'s`}
                                </span>
                            </Link>
                            <Link
                                className={styles.imageTextLink}
                                to={`/p/${createPostFromTurnData.postId}`}
                                onClick={() => {
                                    closeForm()
                                    setPostId(createPostFromTurnData.postId)
                                }}
                            >
                                <span className='blueText'>post</span>
                            </Link>
                        </div>
                    )}
                    <PostCardPreview
                        type={postType}
                        spaces={[spaceData.handle, ...addedSpaces]}
                        text={text}
                        url={url}
                        urlImage={urlImage}
                        urlDomain={urlDomain}
                        urlTitle={urlTitle}
                        urlDescription={urlDescription}
                    />
                    <div className={styles.dropDownOptions}>
                        <DropDownMenu
                            title='Post Type'
                            options={['Text', 'Url', 'Poll', 'Glass Bead', 'Plot Graph', 'Prism']}
                            selectedOption={postType}
                            setSelectedOption={setPostType}
                            orientation='horizontal'
                        />
                        {postType === 'Poll' && (
                            <DropDownMenu
                                title='Poll Type'
                                options={['Single Choice', 'Multiple Choice', 'Weighted Choice']}
                                selectedOption={subType}
                                setSelectedOption={setSubType}
                                orientation='horizontal'
                            />
                        )}
                        {postType === 'Prism' && (
                            <>
                                <DropDownMenu
                                    title='Number Of Players'
                                    options={[3, 6, 12]}
                                    selectedOption={numberOfPrismPlayers}
                                    setSelectedOption={setNumberOfPrismPlayers}
                                    orientation='horizontal'
                                />
                                <DropDownMenu
                                    title='Duration'
                                    options={['1 Week', '1 Month', '1 Year']}
                                    selectedOption={prismDuration}
                                    setSelectedOption={setPrismDuration}
                                    orientation='horizontal'
                                />
                                <DropDownMenu
                                    title='Visibility'
                                    options={['Private', 'Public']}
                                    selectedOption={prismPrivacy}
                                    setSelectedOption={setPrismPrivacy}
                                    orientation='horizontal'
                                />
                            </>
                        )}
                        {postType === 'Plot Graph' && (
                            <DropDownMenu
                                title='Number Of Axes'
                                options={[0, 1, 2]}
                                selectedOption={numberOfPlotGraphAxes}
                                setSelectedOption={setNumberOfPlotGraphAxes}
                                orientation='horizontal'
                            />
                        )}
                        {numberOfPlotGraphAxes > 1 && (
                            <div className={styles.yAxesValues}>
                                <textarea
                                    className={`wecoInput textArea mb-10 ${
                                        axis2TopError && 'error'
                                    }`}
                                    style={{ height: 40, width: 250 }}
                                    placeholder='Axis 2: top value...'
                                    value={axis2Top}
                                    onChange={(e) => {
                                        setAxis2Top(e.target.value)
                                        setAxis2TopError(false)
                                    }}
                                />
                            </div>
                        )}
                        {numberOfPlotGraphAxes > 0 && (
                            <div className={styles.xAxesValues}>
                                <textarea
                                    className={`wecoInput textArea mb-10 ${
                                        axis1LeftError && 'error'
                                    }`}
                                    style={{ height: 40, width: 250 }}
                                    placeholder='Axis 1: left value...'
                                    value={axis1Left}
                                    onChange={(e) => {
                                        setAxis1Left(e.target.value)
                                        setAxis1LeftError(false)
                                    }}
                                />
                                <textarea
                                    className={`wecoInput textArea mb-10 ${
                                        axis1RightError && 'error'
                                    }`}
                                    style={{ height: 40, width: 250 }}
                                    placeholder='Axis 1: right value...'
                                    value={axis1Right}
                                    onChange={(e) => {
                                        setAxis1Right(e.target.value)
                                        setAxis1RightError(false)
                                    }}
                                />
                            </div>
                        )}
                        {numberOfPlotGraphAxes > 1 && (
                            <div className={styles.yAxesValues}>
                                <textarea
                                    className={`wecoInput textArea mb-10 ${
                                        axis2BottomError && 'error'
                                    }`}
                                    style={{ height: 40, width: 250 }}
                                    placeholder='Axis 2: bottom value...'
                                    value={axis2Bottom}
                                    onChange={(e) => {
                                        setAxis2Bottom(e.target.value)
                                        setAxis2BottomError(false)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <form className={styles.form}>
                        <textarea
                            className={`wecoInput textArea white mb-10 ${textError && 'error'}`}
                            placeholder='Text (max 20,000 characters)'
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                setTextError(false)
                                resizeTextArea(e.target)
                            }}
                        />
                        {(postType === 'Url' || postType === 'Glass Bead') && (
                            <input
                                className={`wecoInput mb-10 ${urlError && 'error'}`}
                                placeholder='Url'
                                type='url'
                                value={url}
                                onChange={(e) => {
                                    setUrlError(false)
                                    // setUrlFlashMessage('')
                                    setUrl(e.target.value)
                                    scrapeURL(e.target.value)
                                }}
                            />
                        )}
                        {/* <UrlPreview
                            url={url}
                            urlLoading={urlLoading}
                            urlImage={urlImage}
                            urlDomain={urlDomain}
                            urlTitle={urlTitle}
                            urlDescription={urlDescription}
                            urlFlashMessage={urlFlashMessage}
                        /> */}
                        <SpaceInput
                            centered={false}
                            text='Tag other spaces you want the post to appear in:'
                            blockedSpaces={[]}
                            addedSpaces={addedSpaces}
                            setAddedSpaces={setAddedSpaces}
                            newSpaceError={newSpaceError}
                            setNewSpaceError={setNewSpaceError}
                            setParentModalOpen={setCreatePostModalOpen}
                        />
                        {postType === 'Poll' && (
                            <PollAnswerForm
                                pollAnswers={pollAnswers}
                                setPollAnswers={setPollAnswers}
                                newPollAnswer={newPollAnswer}
                                setNewPollAnswer={setNewPollAnswer}
                                newPollAnswerError={newPollAnswerError}
                                setNewPollAnswerError={setNewPollAnswerError}
                            />
                        )}
                        <div
                            className='wecoButton centered' // ${postType === 'Prism' && 'disabled'}
                            role='button'
                            tabIndex={0}
                            onClick={createPost}
                            onKeyDown={createPost}
                        >
                            Submit Post
                        </div>
                    </form>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default CreatePostModal
