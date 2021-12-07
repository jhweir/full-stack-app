/* eslint-disable no-param-reassign */
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { SpaceContext } from '@contexts/SpaceContext'
import { AccountContext } from '@contexts/AccountContext'
import config from '@src/Config'
import styles from '@styles/components/CreatePostModal.module.scss'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Input from '@components/Input'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'
import DropDownMenu from '@components/DropDownMenu'
import SearchSelector from '@components/SearchSelector'
import ImageTitle from '@components/ImageTitle'
import CloseButton from '@components/CloseButton'
import PostCard from '@components/Cards/PostCard/PostCard'
import { allValid, defaultErrorState } from '@src/Functions'
import GlassBeadGameTopics from '@src/GlassBeadGameTopics'

// todo: create custom regex and add to @src/Functions
function isValidUrl(string) {
    try {
        new URL(string)
    } catch (_) {
        return false
    }
    return true
}

const CreatePostModal = (): JSX.Element => {
    // todo: set create post modal open in page instead of account context
    const { setCreatePostModalOpen, accountData } = useContext(AccountContext)
    const { spaceData, spacePosts, setSpacePosts } = useContext(SpaceContext)
    const [formData, setFormData] = useState({
        postType: {
            value: 'Text',
            ...defaultErrorState,
        },
        text: {
            value: '',
            ...defaultErrorState,
        },
        url: {
            value: '',
            ...defaultErrorState,
        },
        topic: {
            value: '',
            ...defaultErrorState,
        },
    })
    const { postType, text, url, topic } = formData
    const [spaceOptions, setSpaceOptions] = useState<any[]>([])
    const [selectedSpaces, setSelectedSpaces] = useState<any[]>([])
    const [topicOptions, setTopicOptions] = useState<any[]>([])
    const [selectedArchetopic, setSelectedArchetopic] = useState<any>(null)
    const [urlLoading, setUrlLoading] = useState(false)
    const [urlImage, setUrlImage] = useState(null)
    const [urlDomain, setUrlDomain] = useState(null)
    const [urlTitle, setUrlTitle] = useState(null)
    const [urlDescription, setUrlDescription] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [previewRenderKey, setPreviewRenderKey] = useState(0)
    const cookies = new Cookies()

    function updateValue(name, value) {
        let resetState = {}
        if (name === 'postType') {
            resetState = {
                text: { ...formData.text, state: 'default' },
                url: { ...formData.url, value: '', state: 'default' },
                topic: { ...formData.topic, value: '', state: 'default' },
            }
            setUrlImage(null)
            setUrlDomain(null)
            setUrlTitle(null)
            setUrlDescription(null)
            setSelectedArchetopic(null)
        }
        setFormData({
            ...formData,
            [name]: { ...formData[name], value, state: 'default' },
            ...resetState,
        })
        setPreviewRenderKey((k) => k + 1)
    }

    function findSpaces(query) {
        if (!query) setSpaceOptions([])
        else {
            const blacklist = [spaceData.id, ...selectedSpaces.map((s) => s.id)]
            const data = { query, blacklist }
            axios
                .post(`${config.apiURL}/viable-post-spaces`, data)
                .then((res) => setSpaceOptions(res.data))
                .catch((error) => console.log(error))
        }
    }

    function addSpace(space) {
        setSpaceOptions([])
        setSelectedSpaces((s) => [...s, space])
        setPreviewRenderKey((k) => k + 1)
    }

    function removeSpace(spaceId) {
        setSelectedSpaces((s) => [...s.filter((space) => space.id !== spaceId)])
    }

    function findTopics(query) {
        const filteredTopics = GlassBeadGameTopics.filter((t) =>
            t.name.toLowerCase().includes(query.toLowerCase())
        )
        setTopicOptions(filteredTopics)
        updateValue('topic', query)
    }

    function selectTopic(selectedTopic) {
        setTopicOptions([])
        setSelectedArchetopic(selectedTopic)
        updateValue('topic', selectedTopic.name)
    }

    const scrapeURL = (urlString: string): void => {
        // set up better url regex
        if (isValidUrl(urlString)) {
            setUrlLoading(true)
            axios
                .get(`${config.apiURL}/scrape-url?url=${urlString}`)
                .then((res) => {
                    const { description, domain, image, title } = res.data
                    setUrlDescription(description)
                    setUrlDomain(domain)
                    setUrlImage(image)
                    setUrlTitle(title)
                    setUrlLoading(false)
                    setPreviewRenderKey((k) => k + 1)
                })
                .catch((error) => console.log(error))
        } else {
            console.log('invalid Url')
            // setUrlFlashMessage('invalid Url')
        }
    }

    function createPost(e) {
        e.preventDefault()
        // add validation with latest values to form data (is there a way around this?)
        const newFormData = {
            postType: {
                ...postType,
                required: false,
            },
            text: {
                ...text,
                required: postType.value !== 'Url',
                validate: (v) => {
                    const errors: string[] = []
                    if (!v) errors.push('Required')
                    if (v.length > 5000) errors.push('Must be less than 5K characters')
                    return errors
                },
            },
            url: {
                ...url,
                required: postType.value === 'Url',
                validate: (v) => (!isValidUrl(v) ? ['Must be a valid URL'] : []),
            },
            topic: {
                ...topic,
                required: postType.value === 'Glass Bead Game',
                validate: (v) => (!selectedArchetopic && !v ? ['Required'] : []),
            },
        }
        if (allValid(newFormData, setFormData)) {
            setLoading(true)
            const postData = {
                type: postType.value.replace(/\s+/g, '-').toLowerCase(),
                text: text.value,
                url: url.value,
                urlImage,
                urlDomain,
                urlTitle,
                urlDescription,
                topic: selectedArchetopic ? selectedArchetopic.name : topic.value,
                spaceHandles: [...selectedSpaces.map((s) => s.handle), spaceData.handle],
            }
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/create-post`, postData, authHeader)
                .then((res) => {
                    setLoading(false)
                    setSaved(true)
                    // todo: update direct spaces
                    const DirectSpaces = [spaceData, ...selectedSpaces]
                    DirectSpaces.forEach((s) => {
                        s.type = 'post'
                        s.state = 'active'
                    })
                    const newPost = {
                        ...res.data,
                        total_comments: 0,
                        total_reactions: 0,
                        creator: {
                            handle: accountData.handle,
                            name: accountData.name,
                            flagImagePath: accountData.flagImagePath,
                        },
                        DirectSpaces,
                        GlassBeadGame: { topic: topic.value },
                    }
                    setSpacePosts([newPost, ...spacePosts])
                    setTimeout(() => setCreatePostModalOpen(false), 1000)
                })
                .catch((error) => console.log(error))
        }
    }

    const postTypeName = ['Text', 'Url'].includes(postType.value)
        ? `${postType.value.toLowerCase()} post`
        : postType.value

    return (
        <Modal close={() => setCreatePostModalOpen(false)} centered>
            <h1>
                Create a new {postTypeName} in{' '}
                <Link to={`/s/${spaceData.handle}`} onClick={() => setCreatePostModalOpen(false)}>
                    {spaceData.name}
                </Link>
            </h1>

            <form onSubmit={createPost}>
                <Column style={{ width: 700 }}>
                    <DropDownMenu
                        title='Post Type'
                        options={['Text', 'Url', 'Glass Bead Game']}
                        selectedOption={postType.value}
                        setSelectedOption={(value) => updateValue('postType', value)}
                        orientation='horizontal'
                        style={{ marginBottom: 10 }}
                    />
                    {postType.value === 'Glass Bead Game' && (
                        <Column style={{ marginTop: 5 }}>
                            <SearchSelector
                                type='topic'
                                title='Choose a topic for the game'
                                placeholder={
                                    selectedArchetopic ? 'archetopic selected' : 'topic...'
                                }
                                style={{ marginBottom: 15 }}
                                state={topic.state}
                                disabled={!!selectedArchetopic}
                                errors={topic.errors}
                                onSearchQuery={(query) => findTopics(query)}
                                onOptionSelected={(selectedTopic) => selectTopic(selectedTopic)}
                                options={topicOptions}
                            />
                            {selectedArchetopic && (
                                <Row style={{ margin: '0 10px 10px 0' }} centerY>
                                    <div className={styles.archetopic}>
                                        <div>
                                            <selectedArchetopic.icon />
                                        </div>
                                        <p>{selectedArchetopic.name}</p>
                                    </div>
                                    <CloseButton
                                        size={17}
                                        onClick={() => {
                                            setSelectedArchetopic(null)
                                            updateValue('topic', '')
                                        }}
                                    />
                                </Row>
                            )}
                        </Column>
                    )}
                    {postType.value === 'Url' && (
                        <Input
                            title='Url'
                            type='text'
                            placeholder='url...'
                            style={{ marginBottom: 15 }}
                            loading={urlLoading}
                            state={url.state}
                            errors={url.errors}
                            value={url.value}
                            onChange={(value) => {
                                updateValue('url', value)
                                scrapeURL(value)
                            }}
                        />
                    )}
                    <Input
                        title={`Text${
                            postType.value === 'Url' ? ' (not required for url posts)' : ''
                        }`}
                        type='text-area'
                        placeholder='text...'
                        style={{ marginBottom: 15 }}
                        rows={3}
                        state={text.state}
                        errors={text.errors}
                        value={text.value}
                        onChange={(value) => updateValue('text', value)}
                    />
                    <SearchSelector
                        type='space'
                        title='Add any other spaces you want the post to appear in'
                        placeholder='space name or handle...'
                        style={{ marginBottom: 10 }}
                        onSearchQuery={(query) => findSpaces(query)}
                        onOptionSelected={(space) => addSpace(space)}
                        options={spaceOptions}
                    />
                    {selectedSpaces.length > 0 && (
                        <Row wrap>
                            {selectedSpaces.map((space) => (
                                <Row centerY style={{ margin: '0 10px 10px 0' }}>
                                    <ImageTitle
                                        type='user'
                                        imagePath={space.flagImagePath}
                                        title={`${space.name} (${space.handle})`}
                                        imageSize={27}
                                        style={{ marginRight: 3 }}
                                    />
                                    <CloseButton size={17} onClick={() => removeSpace(space.id)} />
                                </Row>
                            ))}
                        </Row>
                    )}
                    <Column style={{ margin: '20px 0 10px 0' }}>
                        <h2>Post preview</h2>
                        <PostCard
                            key={previewRenderKey}
                            location='preview'
                            post={{
                                text:
                                    postType.value === 'Url'
                                        ? text.value
                                        : text.value || '*sample text*',
                                type: postType.value.toLowerCase().split(' ').join('-'),
                                url: url.value,
                                urlImage,
                                urlDomain,
                                urlTitle,
                                urlDescription,
                                totalComments: 0,
                                totalLikes: 0,
                                totalRatings: 0,
                                totalReposts: 0,
                                totalLinks: 0,
                                Creator: {
                                    handle: accountData.handle,
                                    name: accountData.name,
                                    flagImagePath: accountData.flagImagePath,
                                },
                                DirectSpaces: [
                                    {
                                        ...spaceData,
                                        type: 'post',
                                        state: 'active',
                                    },
                                    ...selectedSpaces.map((s) => {
                                        return {
                                            ...s,
                                            type: 'post',
                                            state: 'active',
                                        }
                                    }),
                                ],
                                GlassBeadGame: {
                                    topic: topic.value,
                                },
                            }}
                        />
                    </Column>
                </Column>
                <Row>
                    <Button
                        text='Create Post'
                        colour='blue'
                        style={{ marginRight: 10 }}
                        disabled={urlLoading || loading || saved}
                        submit
                    />
                    {loading && <LoadingWheel />}
                    {saved && <SuccessMessage text='Post created!' />}
                </Row>
            </form>
        </Modal>
    )
}

export default CreatePostModal

// attempted to auto add archetopic space to selected spaces in selectTopic() function
// const newSelectedSpaces = [...selectedSpaces]
// newSelectedSpaces.filter((s) => s.handle !== `gbg${selectedArchetopic.toLowerCase()}`)
// newSelectedSpaces.push({ handle: `gbg${topic.name.toLowerCase()}` })
// setSelectedSpaces(newSelectedSpaces)

/* <DropDownMenu
        title='Topic'
        options={['Other', ...GlassBeadGameTopics.map((t) => t.name)]}
        selectedOption={GBGTopic}
        setSelectedOption={setGBGTopic}
        orientation='horizontal'
    /> */
/* {GBGTopic === 'Other' && (
        // <textarea
        //     className={`wecoInput textArea white mb-10 ${
        //         GBGCustomTopicError && 'error'
        //     }`}
        //     style={{ height: 30, width: 250 }}
        //     placeholder='title...'
        //     value={GBGCustomTopic}
        //     onChange={(e) => {
        //         setGBGCustomTopic(e.target.value)
        //         setGBGCustomTopicError(false)
        //     }}
        // />
        <Input
            type='text-area'
            // title='Handle (the unique identifier used in the spaces url):'
            // prefix='weco.io/s/'
            placeholder='custom topic...'
            state={handleState}
            errors={handleErrors}
            value={handle}
            onChange={(newValue) => {
                setHandleState('default')
                setHandle(newValue.toLowerCase().replace(/[^a-z0-9]/g, '-'))
            }}
        />
    )} */

/* <textarea
    className={`wecoInput textArea white mb-10 ${textError && 'error'}`}
    placeholder='Text (max 20,000 characters)'
    value={text}
    onChange={(e) => {
        setText(e.target.value)
        setTextError(false)
        resizeTextArea(e.target)
    }}
/> */

/* {postType === 'Url' && (
    <div className={styles.urlInput}>
        <input
            className={`wecoInput white mb-10 ${urlError && 'error'}`}
            placeholder='Url'
            type='url'
            value={url || undefined}
            onChange={(e) => {
                setUrlError(false)
                // setUrlFlashMessage('')
                setUrl(e.target.value)
                scrapeURL(e.target.value)
            }}
        />
        {urlLoading && <div className={styles.spinner} />}
    </div>
)} */

// import PollAnswerForm from '@components/PostPage/Poll/PollAnswerForm'

// useEffect(() => {
//     if (createPostFromTurn) setPostType('Glass Bead')
// }, [])

// useEffect(() => {
//     if (postType === 'Poll') setSubType('Single Choice')
//     else setSubType('')
//     setNumberOfPlotGraphAxes(0)
// }, [postType])

// const [pollAnswers, setPollAnswers] = useState([])
// const [newPollAnswer, setNewPollAnswer] = useState('')

// const [numberOfPrismPlayers, setNumberOfPrismPlayers] = useState(3)
// const [prismDuration, setPrismDuration] = useState('1 Month')
// const [prismPrivacy, setPrismPrivacy] = useState('Private')

// const [numberOfPlotGraphAxes, setNumberOfPlotGraphAxes] = useState(0)
// const [axis1Left, setAxis1Left] = useState('')
// const [axis1Right, setAxis1Right] = useState('')
// const [axis2Top, setAxis2Top] = useState('')
// const [axis2Bottom, setAxis2Bottom] = useState('')
// const [axis1LeftError, setAxis1LeftError] = useState(false)
// const [axis1RightError, setAxis1RightError] = useState(false)
// const [axis2TopError, setAxis2TopError] = useState(false)
// const [axis2BottomError, setAxis2BottomError] = useState(false)

// pollAnswers,
// numberOfPrismPlayers,
// prismDuration,
// prismPrivacy,
// numberOfPlotGraphAxes,
// axis1Left,
// axis1Right,
// axis2Top,
// axis2Bottom,
// createPostFromTurnData,

// {postType === 'Poll' && (
//     <DropDownMenu
//         title='Poll Type'
//         options={['Single Choice', 'Multiple Choice', 'Weighted Choice']}
//         selectedOption={subType}
//         setSelectedOption={setSubType}
//         orientation='horizontal'
//     />
// )}
// {postType === 'Prism' && (
//     <>
//         <DropDownMenu
//             title='Number Of Players'
//             options={[3, 6, 12]}
//             selectedOption={numberOfPrismPlayers}
//             setSelectedOption={setNumberOfPrismPlayers}
//             orientation='horizontal'
//         />
//         <DropDownMenu
//             title='Duration'
//             options={['1 Week', '1 Month', '1 Year']}
//             selectedOption={prismDuration}
//             setSelectedOption={setPrismDuration}
//             orientation='horizontal'
//         />
//         <DropDownMenu
//             title='Visibility'
//             options={['Private', 'Public']}
//             selectedOption={prismPrivacy}
//             setSelectedOption={setPrismPrivacy}
//             orientation='horizontal'
//         />
//     </>
// )}

// {postType === 'Poll' && (
//     <PollAnswerForm
//         pollAnswers={pollAnswers}
//         setPollAnswers={setPollAnswers}
//         newPollAnswer={newPollAnswer}
//         setNewPollAnswer={setNewPollAnswer}
//         newPollAnswerError={newPollAnswerError}
//         setNewPollAnswerError={setNewPollAnswerError}
//     />
// )}

// {postType === 'Plot Graph' && (
//     <DropDownMenu
//         title='Number Of Axes'
//         options={[0, 1, 2]}
//         selectedOption={numberOfPlotGraphAxes}
//         setSelectedOption={setNumberOfPlotGraphAxes}
//         orientation='horizontal'
//     />
// )}
// {numberOfPlotGraphAxes > 1 && (
//     <div className={styles.yAxesValues}>
//         <textarea
//             className={`wecoInput textArea mb-10 ${axis2TopError && 'error'}`}
//             style={{ height: 40, width: 250 }}
//             placeholder='Axis 2: top value...'
//             value={axis2Top}
//             onChange={(e) => {
//                 setAxis2Top(e.target.value)
//                 setAxis2TopError(false)
//             }}
//         />
//     </div>
// )}
// {numberOfPlotGraphAxes > 0 && (
//     <div className={styles.xAxesValues}>
//         <textarea
//             className={`wecoInput textArea mb-10 ${axis1LeftError && 'error'}`}
//             style={{ height: 40, width: 250 }}
//             placeholder='Axis 1: left value...'
//             value={axis1Left}
//             onChange={(e) => {
//                 setAxis1Left(e.target.value)
//                 setAxis1LeftError(false)
//             }}
//         />
//         <textarea
//             className={`wecoInput textArea mb-10 ${axis1RightError && 'error'}`}
//             style={{ height: 40, width: 250 }}
//             placeholder='Axis 1: right value...'
//             value={axis1Right}
//             onChange={(e) => {
//                 setAxis1Right(e.target.value)
//                 setAxis1RightError(false)
//             }}
//         />
//     </div>
// )}
// {numberOfPlotGraphAxes > 1 && (
//     <div className={styles.yAxesValues}>
//         <textarea
//             className={`wecoInput textArea mb-10 ${
//                 axis2BottomError && 'error'
//             }`}
//             style={{ height: 40, width: 250 }}
//             placeholder='Axis 2: bottom value...'
//             value={axis2Bottom}
//             onChange={(e) => {
//                 setAxis2Bottom(e.target.value)
//                 setAxis2BottomError(false)
//             }}
//         />
//     </div>
// )}

/* {createPostFromTurn && (
    <div className={styles.turnLink}>
        <span className='mr-10'>Linked from</span>
        <Link
            className={styles.imageTextLink}
            to={`/u/${createPostFromTurnData.creatorHandle}`}
            onClick={closeForm}
        >
            <FlagImage
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
)} */

/* <UrlPreview
    url={url}
    urlLoading={urlLoading}
    urlImage={urlImage}
    urlDomain={urlDomain}
    urlTitle={urlTitle}
    urlDescription={urlDescription}
    urlFlashMessage={urlFlashMessage}
/> */
