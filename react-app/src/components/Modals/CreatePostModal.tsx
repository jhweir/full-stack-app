import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'

import { SpaceContext } from '@contexts/SpaceContext'
import { AccountContext } from '@contexts/AccountContext'
// import { PostContext } from '@contexts/PostContext'
import config from '@src/Config'
import styles from '@styles/components/CreatePostModal.module.scss'
// import UrlPreview from './UrlPreview'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Input from '@components/Input'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'
import SpaceInput from '@components/SpaceInput'
import DropDownMenu from '@components/DropDownMenu'
// import SmallFlagImage from '@components/SmallFlagImage'
import PostCardPreview from '@components/Cards/PostCard/PostCardPreview'
import { allValid, defaultErrorState } from '@src/Functions'
import GlassBeadGameTopics from '@src/GlassBeadGameTopics'

const CreatePostModal = (): JSX.Element => {
    const { setCreatePostModalOpen } = useContext(AccountContext)
    const { spaceData, getSpaceData, getSpacePosts } = useContext(SpaceContext)

    const [formData, setFormData] = useState({
        text: {
            value: '',
            validate: (v) => (!v || v.length > 5000 ? ['Must be less than 5K characters'] : []),
            ...defaultErrorState,
        },
    })
    const { text } = formData

    const [postType, setPostType] = useState('Text')
    const [subType, setSubType] = useState('')
    // const [text, setText] = useState('')
    const [url, setUrl] = useState<string | null>(null)
    const [urlLoading, setUrlLoading] = useState(false)
    const [urlImage, setUrlImage] = useState(null)
    const [urlDomain, setUrlDomain] = useState(null)
    const [urlTitle, setUrlTitle] = useState(null)
    const [urlDescription, setUrlDescription] = useState(null)
    const [addedSpaces, setAddedSpaces] = useState([])

    const [GBGTopic, setGBGTopic] = useState('Other')
    const [GBGCustomTopic, setGBGCustomTopic] = useState('')
    const [GBGCustomTopicError, setGBGCustomTopicError] = useState(false)

    const [textError, setTextError] = useState(false)
    const [urlError, setUrlError] = useState(false)
    const [newSpaceError, setNewSpaceError] = useState(false)

    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const errors = false // nameState === 'invalid' || handleState === 'invalid' || descriptionState === 'invalid'

    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')

    function updateValue(name, value) {
        setFormData({ ...formData, [name]: { ...formData[name], value, state: 'default' } })
    }

    function isValidUrl(string) {
        try {
            new URL(string)
        } catch (_) {
            return false
        }
        return true
    }

    const scrapeURL = (urlString: string): void => {
        // set up better url regex
        if (isValidUrl(urlString)) {
            setUrlLoading(true)
            axios
                .get(`${config.apiURL}/scrape-url?url=${urlString}`)
                .then((res) => {
                    console.log('res: ', res.data)
                    if (typeof res.data === 'string') {
                        setUrlDescription(null)
                        setUrlDomain(null)
                        setUrlImage(null)
                        setUrlTitle(null)
                        // setUrlFlashMessage(res.data)
                    } else {
                        const { description, domain, image, title } = res.data
                        setUrlDescription(description)
                        setUrlDomain(domain)
                        setUrlImage(image)
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

    function createPost(e) {
        e.preventDefault()
        if (allValid(formData, setFormData)) {
            console.log('all valid!')
        }
        // const invalidText = (!text || text.length > 5000) && !url
        // const invalidUrl = postType === 'Url' && !url
        // const invalidGBGCustomTopic =
        //     postType === 'Glass Bead Game' && GBGTopic === 'Other' && GBGCustomTopic === ''
        // if (invalidText) setTextError(true)
        // if (invalidUrl) setUrlError(true)
        // if (invalidGBGCustomTopic) setGBGCustomTopicError(true)
        // if (!invalidText && !invalidUrl && !invalidGBGCustomTopic && !urlLoading && accessToken) {
        //     setLoading(true)
        //     const postData = {
        //         type: postType.replace(/\s+/g, '-').toLowerCase(),
        //         subType,
        //         state: 'visible',
        //         text,
        //         url,
        //         urlImage,
        //         urlDomain,
        //         urlTitle,
        //         urlDescription,
        //         spaceHandles: addedSpaces.length
        //             ? [...addedSpaces, spaceData.handle]
        //             : [spaceData.handle],
        //         GBGTopic,
        //         GBGCustomTopic,
        //     }
        //     const options = { headers: { Authorization: `Bearer ${accessToken}` } }
        //     axios.post(`${config.apiURL}/create-post`, postData, options).then((res) => {
        //         setLoading(false)
        //         if (res.data === 'success') {
        //             setSuccessMessage('Post created!')
        //             // setCreatePostModalOpen(false)
        //             // resetForm()
        //             // todo: update state directly
        //             // setTimeout(() => {
        //             //     getSpaceData()
        //             //     getSpacePosts()
        //             // }, 300)
        //         }
        //     })
        // }
    }

    return (
        <Modal close={() => setCreatePostModalOpen(false)} centered>
            <h1>
                Create a new{' '}
                {['Text', 'Url'].includes(postType) ? `${postType.toLowerCase()} post` : postType}{' '}
                in{' '}
                <Link to={`/s/${spaceData.handle}`} onClick={() => setCreatePostModalOpen(false)}>
                    {spaceData.name}
                </Link>
            </h1>

            <form onSubmit={createPost}>
                <Column>
                    <div className={styles.dropDownOptions}>
                        <DropDownMenu
                            title='Post Type'
                            options={['Text', 'Url', 'Glass Bead Game']}
                            selectedOption={postType}
                            setSelectedOption={setPostType}
                            orientation='horizontal'
                        />
                        {postType === 'Glass Bead Game' && (
                            <>
                                <DropDownMenu
                                    title='Topic'
                                    options={['Other', ...GlassBeadGameTopics.map((t) => t.name)]}
                                    selectedOption={GBGTopic}
                                    setSelectedOption={setGBGTopic}
                                    orientation='horizontal'
                                />
                                {/* {GBGTopic === 'Other' && (
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
                                )} */}
                            </>
                        )}
                    </div>
                    <Input
                        type='text-area'
                        title='Text'
                        placeholder='text...'
                        margin='0 0 10px 0'
                        rows={3}
                        state={text.state}
                        errors={text.errors}
                        value={text.value}
                        onChange={(value) => updateValue('text', value)}
                    />
                    {/* <textarea
                        className={`wecoInput textArea white mb-10 ${textError && 'error'}`}
                        placeholder='Text (max 20,000 characters)'
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                            setTextError(false)
                            resizeTextArea(e.target)
                        }}
                    /> */}
                    {postType === 'Url' && (
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
                    )}
                    <SpaceInput
                        centered={false}
                        text='Add other spaces you want the post to appear in:'
                        blockedSpaces={[]}
                        addedSpaces={addedSpaces}
                        setAddedSpaces={setAddedSpaces}
                        newSpaceError={newSpaceError}
                        setNewSpaceError={setNewSpaceError}
                        setParentModalOpen={setCreatePostModalOpen}
                    />

                    <h2>Preview: </h2>
                    <PostCardPreview
                        type={postType}
                        spaces={[spaceData.handle, ...addedSpaces]}
                        text={text.value}
                        url={url}
                        urlImage={urlImage}
                        urlDomain={urlDomain}
                        urlTitle={urlTitle}
                        urlDescription={urlDescription}
                    />
                </Column>
                <div className={styles.footer}>
                    <Button
                        text='Create Post'
                        colour='blue'
                        size='medium'
                        margin='0 10px 0 0'
                        disabled={loading || successMessage.length > 0 || errors}
                        submit
                    />
                    {loading && <LoadingWheel />}
                    {successMessage.length > 0 && <SuccessMessage text={successMessage} />}
                </div>
            </form>
        </Modal>
    )
}

export default CreatePostModal

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
