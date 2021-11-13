import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/PostCardLinkModal.module.scss'
// import CloseButton from '../../CloseButton'
import SmallFlagImage from '@components/SmallFlagImage'
import DropDownMenu from '@components/DropDownMenu'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import { PostContext } from '@contexts/PostContext'
import { IPost } from '@src/Interfaces'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'

const PostCardLinkModal = (props: {
    postData: Partial<IPost>
    links: {
        outgoingLinks: any[]
        incomingLinks: any[]
    }
    setLinkModalOpen: (payload: boolean) => void
    getReactionData: () => void
    totalReactions: number
    setTotalReactions: (payload: number) => void
    totalLinks: number
    setTotalLinks: (payload: number) => void
    setAccountLink: (payload: number) => void
}): JSX.Element => {
    const {
        postData,
        links,
        setLinkModalOpen,
        getReactionData,
        totalReactions,
        setTotalReactions,
        totalLinks,
        setTotalLinks,
        setAccountLink,
    } = props

    const { accountData } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)
    // const { setPostId } = useContext(PostContext)

    const [linkTo, setLinkTo] = useState('Post')
    const [linkType, setLinkType] = useState('Text')
    const [linkDescription, setLinkDescription] = useState('')
    const [linkDescriptionError, setLinkDescriptionError] = useState(false)
    const [targetUrl, setTargetUrl] = useState('')
    const [targetUrlError, setTargetUrlError] = useState(false)

    let prefix
    let placeholder
    let inputWidth
    if (linkTo === 'Post') {
        prefix = 'p/'
        placeholder = 'id'
        inputWidth = 40
    }
    if (linkTo === 'Comment') {
        prefix = 'c/'
        placeholder = 'id'
        inputWidth = 40
    }
    if (linkTo === 'Space') {
        prefix = 's/'
        placeholder = 'handle'
        inputWidth = 70
    }
    if (linkTo === 'User') {
        prefix = 'u/'
        placeholder = 'handle'
        inputWidth = 70
    }

    function addLink() {
        const validTargetUrl = targetUrl.length > 0
        const validLinkDescription = linkDescription.length > 0
        if (validTargetUrl && validLinkDescription) {
            console.log('PostCardLinkModal: addLink')
            axios
                .post(`${config.apiURL}/add-link`, {
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    type: `post-${linkTo.toLowerCase()}`,
                    relationship: linkType.toLowerCase(),
                    description: linkDescription,
                    itemAId: postData.id,
                    itemBId: +targetUrl,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setLinkModalOpen(false)
                        setTotalReactions(totalReactions + 1)
                        setTotalLinks(totalLinks + 1)
                        setAccountLink(1)
                        setTimeout(() => {
                            getReactionData()
                        }, 200)
                    } else {
                        console.log('error: ', res)
                    }
                })
                .catch(() => {
                    setTargetUrlError(true)
                })
        }
    }

    function removeLink(linkId) {
        console.log('PostCardLinkModal: removeLink')
        axios
            .post(`${config.apiURL}/remove-link`, {
                // accountId: accountData.id,
                linkId,
            })
            .then((res) => {
                if (res.data === 'success') {
                    setLinkModalOpen(false)
                    setTotalReactions(totalReactions - 1)
                    setTotalLinks(totalLinks - 1)
                    setAccountLink(0)
                    setTimeout(() => {
                        getReactionData()
                    }, 200)
                } else {
                    console.log('error: ', res)
                }
            })
    }

    return (
        <Modal close={() => setLinkModalOpen(false)} centered>
            <span className={styles.title}>Links</span>
            {!links.outgoingLinks.length && !links.incomingLinks.length && (
                <span className={`${styles.text} mb-20`}>
                    <i>No links yet...</i>
                </span>
            )}
            {links.incomingLinks.length > 0 && (
                <div className={styles.links}>
                    <span className={styles.subTitle}>Incoming:</span>
                    {links.incomingLinks.map((link) => (
                        <div className={styles.link} key={link}>
                            <Link className={styles.imageTextLink} to={`/u/${link.creator.handle}`}>
                                <SmallFlagImage
                                    type='user'
                                    size={30}
                                    imagePath={link.creator.flagImagePath}
                                />
                                <span>
                                    {accountData.id === link.creator.id ? 'You' : link.creator.name}
                                </span>
                            </Link>
                            <div className={`${styles.text} greyText mr-10`}>linked from</div>
                            <Link
                                className={styles.imageTextLink}
                                to={`/u/${link.postA.creator.handle}`}
                            >
                                <SmallFlagImage
                                    type='user'
                                    size={30}
                                    imagePath={link.postA.creator.flagImagePath}
                                />
                                <span>
                                    {accountData.id === link.postA.creatorId
                                        ? 'Your'
                                        : `${link.postA.creator.name}'s`}
                                </span>
                            </Link>
                            <Link
                                className={styles.imageTextLink}
                                to={`/p/${link.postA.id}`}
                                // onClick={() => setPostId(link.postA.id)}
                            >
                                <span className='blueText m-0'>post</span>
                            </Link>
                            {accountData.id === link.creator.id && (
                                <div
                                    className={styles.deleteLink}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => removeLink(link.id)}
                                    onKeyDown={() => removeLink(link.id)}
                                >
                                    <img
                                        className={styles.icon}
                                        src='/icons/trash-alt-solid.svg'
                                        alt=''
                                    />
                                    <span className='greyText'>Delete</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {links.outgoingLinks.length > 0 && (
                <div className={styles.links}>
                    <span className={styles.subTitle}>Outgoing:</span>
                    {links.outgoingLinks.map((link) => (
                        <div className={styles.link} key={link}>
                            <Link className={styles.imageTextLink} to={`/u/${link.creator.handle}`}>
                                <SmallFlagImage
                                    type='user'
                                    size={30}
                                    imagePath={link.creator.flagImagePath}
                                />
                                <span>
                                    {accountData.id === link.creator.id ? 'You' : link.creator.name}
                                </span>
                            </Link>
                            <div className={`${styles.text} greyText mr-10`}>linked to</div>
                            <Link
                                className={styles.imageTextLink}
                                to={`/u/${link.postB.creator.handle}`}
                            >
                                <SmallFlagImage
                                    type='user'
                                    size={30}
                                    imagePath={link.postB.creator.flagImagePath}
                                />
                                <span>
                                    {accountData.id === link.postB.creatorId
                                        ? 'Your'
                                        : `${link.postB.creator.name}'s`}
                                </span>
                            </Link>
                            <Link
                                className={styles.imageTextLink}
                                to={`/p/${link.postB.id}`}
                                // onClick={() => setPostId(link.postB.id)}
                            >
                                <span className='blueText m-0'>post</span>
                            </Link>
                            {accountData.id === link.creator.id && (
                                <div
                                    className={styles.deleteLink}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => removeLink(link.id)}
                                    onKeyDown={() => removeLink(link.id)}
                                >
                                    <img
                                        className={styles.icon}
                                        src='/icons/trash-alt-solid.svg'
                                        alt=''
                                    />
                                    <span className='greyText'>Delete</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className={`${styles.settingsText} mt-10`}>
                <span className={styles.text} style={{ marginBottom: 10 }}>
                    Link this post to another
                </span>
                <DropDownMenu
                    title=''
                    options={['Post']} // 'Comment', 'User', 'Space'
                    selectedOption={linkTo}
                    setSelectedOption={setLinkTo}
                    orientation='horizontal'
                />
                <span className='greyText' style={{ marginBottom: 10, marginRight: 5 }}>
                    {prefix}
                </span>
                <input
                    className={`wecoInput mb-10 ${targetUrlError && 'error'}`}
                    style={{ height: 30, width: inputWidth, padding: 10 }}
                    placeholder={placeholder}
                    type='text'
                    value={targetUrl}
                    onChange={(e) => {
                        setTargetUrl(e.target.value)
                        setTargetUrlError(false)
                    }}
                />
            </div>
            {targetUrlError && <p className='error'>No post found that matches that id</p>}
            {/* <div className={styles.settingsText}>
                        <span className={styles.text} style={{marginBottom: 10}}>Link type</span>
                        <DropDownMenu
                            title=''
                            options={['Text', 'Turn']}
                            selectedOption={linkType}
                            setSelectedOption={setLinkType}
                            orientation='horizontal'
                        />
                    </div> */}
            {/* {linkType === 'Text' && */}
            <textarea
                className={`wecoInput textArea mb-10 ${linkDescriptionError && 'error'}`}
                style={{ height: 40, width: 350 }}
                placeholder='Describe the relationship...'
                value={linkDescription}
                onChange={(e) => {
                    setLinkDescription(e.target.value)
                    setLinkDescriptionError(false)
                }}
            />
            {/* } */}

            <div
                className={`wecoButton mt-20 ${
                    (!targetUrl.length || !linkDescription.length) && 'disabled'
                }`}
                role='button'
                tabIndex={0}
                onClick={addLink}
                onKeyDown={addLink}
            >
                Add Link
            </div>
            {/* {accountLink === 0
                        ? <div
                            className='wecoButton'
                            onClick={addLink}>
                            Add Link
                        </div>
                        : <div
                            className='wecoButton'
                            onClick={removeLink}>
                            Remove Link
                        </div>
                    } */}
        </Modal>
    )
}

export default PostCardLinkModal
