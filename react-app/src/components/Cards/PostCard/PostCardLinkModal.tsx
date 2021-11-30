import React, { useContext, useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/PostCardLinkModal.module.scss'
// import DropDownMenu from '@components/DropDownMenu'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'
import TextLink from '@src/components/TextLink'
import Input from '@components/Input'
import { pluralise, allValid, defaultErrorState } from '@src/Functions'

const PostCardLinkModal = (props: {
    close: () => void
    postData: any
    setPostData: (payload: any) => void
}): JSX.Element => {
    const { close, postData, setPostData } = props
    const {
        loggedIn,
        accountData,
        setLogInModalOpen,
        setAlertMessage,
        setAlertModalOpen,
    } = useContext(AccountContext)
    const { spaceData, spacePosts, setSpacePosts } = useContext(SpaceContext)
    const [formData, setFormData] = useState({
        linkTarget: {
            value: '',
            validate: (v) => (!v || !+v || +v === postData.id ? ['Must be a valid post ID'] : []),
            ...defaultErrorState,
        },
        linkDescription: {
            value: '',
            validate: (v) => (v.length > 50 ? ['Max 50 characters'] : []),
            ...defaultErrorState,
        },
    })
    const [loading, setLoading] = useState(false)
    const cookies = new Cookies()
    const { linkTarget, linkDescription } = formData
    const { IncomingLinks, OutgoingLinks } = postData
    const links = [...IncomingLinks, ...OutgoingLinks]
    const headerText = links.length
        ? `${links.length} link${pluralise(links.length)}`
        : 'No links yet...'

    function updateValue(name, value) {
        setFormData({ ...formData, [name]: { ...formData[name], value, state: 'default' } })
    }

    function addLink() {
        if (allValid(formData, setFormData)) {
            setLoading(true)
            const accessToken = cookies.get('accessToken')
            if (!accessToken) {
                close()
                setAlertMessage('Log in to link posts')
                setAlertModalOpen(true)
            } else {
                const data = {
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    spaceId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    description: linkDescription.value,
                    itemAId: postData.id,
                    itemBId: +linkTarget.value,
                }
                const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
                axios
                    .post(`${config.apiURL}/add-link`, data, authHeader)
                    .then((res) => {
                        const { link } = res.data
                        // update post state
                        const newPostData = {
                            ...postData,
                            totalReactions: postData.totalReactions + 1,
                            totalLinks: postData.totalLinks + 1,
                            accountLink: true,
                            OutgoingLinks: [
                                ...postData.OutgoingLinks,
                                {
                                    id: link.id,
                                    Creator: {
                                        id: accountData.id,
                                        handle: accountData.handle,
                                        name: accountData.name,
                                        flagImagePath: accountData.flagImagePath,
                                    },
                                    PostB: {
                                        id: +linkTarget.value,
                                        Creator: {
                                            id: postData.Creator.id,
                                            handle: postData.Creator.handle,
                                            name: postData.Creator.name,
                                            flagImagePath: postData.Creator.flagImagePath,
                                        },
                                    },
                                },
                            ],
                        }
                        setPostData(newPostData)
                        const newSpacePosts = [...spacePosts]
                        // update post
                        const postIndex = newSpacePosts.findIndex((p) => p.id === postData.id)
                        newSpacePosts[postIndex] = newPostData
                        // update linked post if in state
                        const linkedPost = newSpacePosts.find((p) => p.id === +linkTarget.value)
                        if (linkedPost) {
                            linkedPost.totalLinks += 1
                            linkedPost.accountLink = true
                            linkedPost.IncomingLinks = [
                                ...linkedPost.IncomingLinks,
                                {
                                    id: link.id,
                                    Creator: {
                                        id: accountData.id,
                                        handle: accountData.handle,
                                        name: accountData.name,
                                        flagImagePath: accountData.flagImagePath,
                                    },
                                    PostA: {
                                        id: postData.id,
                                        Creator: {
                                            id: postData.Creator.id,
                                            handle: postData.Creator.handle,
                                            name: postData.Creator.name,
                                            flagImagePath: postData.Creator.flagImagePath,
                                        },
                                    },
                                },
                            ]
                        }
                        setSpacePosts(newSpacePosts)
                        close()
                    })
                    .catch((error) => {
                        switch (error.response.data.message) {
                            case 'Item B not found':
                                setFormData({
                                    ...formData,
                                    linkTarget: {
                                        ...formData.linkTarget,
                                        state: 'invalid',
                                        errors: ['Post not found.'],
                                    },
                                })
                                setLoading(false)
                                break
                            default:
                                console.log(error)
                                setLoading(false)
                        }
                    })
            }
        }
    }

    function removeLink(direction, linkId, linkedPostId) {
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        if (!accessToken) {
            close()
            setAlertMessage('Log in to link posts')
            setAlertModalOpen(true)
        } else {
            const data = { linkId }
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/remove-link`, data, authHeader)
                .then(() => {
                    // filter out removed link
                    let newLinks =
                        direction === 'incoming'
                            ? [...postData.IncomingLinks]
                            : [...postData.OutgoingLinks]
                    newLinks = newLinks.filter((l) => l.id !== linkId)
                    // check if other account links still present
                    const otherAccountLinks = newLinks.find((l) => l.Creator.id === accountData.id)
                    // create new post data object
                    const newPostData = {
                        ...postData,
                        totalReactions: postData.totalReactions - 1,
                        totalLinks: postData.totalLinks - 1,
                        accountLink: !!otherAccountLinks,
                        OutgoingLinks: direction === 'outgoing' ? newLinks : postData.OutgoingLinks,
                        IncomingLinks: direction === 'incoming' ? newLinks : postData.IncomingLinks,
                    }
                    setPostData(newPostData)
                    const newSpacePosts = [...spacePosts]
                    // update post
                    const postIndex = newSpacePosts.findIndex((p) => p.id === postData.id)
                    newSpacePosts[postIndex] = newPostData
                    // find linked post if present in state
                    const linkedPost = newSpacePosts.find((p) => p.id === linkedPostId)
                    if (linkedPost) {
                        const otherLinkedPostAccountLinks =
                            direction === 'outgoing'
                                ? linkedPost.IncomingLinks.find(
                                      (l) => l.id !== linkId && l.Creator.id === accountData.id
                                  )
                                : linkedPost.OutgoingLinks.find(
                                      (l) => l.id !== linkId && l.Creator.id === accountData.id
                                  )
                        linkedPost.totalLinks -= 1
                        linkedPost.accountLink = !!otherLinkedPostAccountLinks
                        if (direction === 'outgoing') {
                            linkedPost.IncomingLinks = linkedPost.IncomingLinks.filter(
                                (l) => l.id !== linkId
                            )
                        } else {
                            linkedPost.OutgoingLinks = linkedPost.OutgoingLinks.filter(
                                (l) => l.id !== linkId
                            )
                        }
                    }
                    setSpacePosts(newSpacePosts)
                    close()
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <Modal close={close} centered style={{ minWidth: 400 }}>
            <h1>{headerText}</h1>
            {IncomingLinks.length > 0 && (
                <div className={styles.links}>
                    <h2>Incoming:</h2>
                    {IncomingLinks.map((link) => (
                        <Row key={link.id} centerY>
                            <ImageTitle
                                type='user'
                                imagePath={link.Creator.flagImagePath}
                                title={link.Creator.name}
                                link={`/u/${link.Creator.handle}`}
                            />
                            <p>linked from</p>
                            <ImageTitle
                                type='user'
                                imagePath={link.PostA.Creator.flagImagePath}
                                title={`${link.PostA.Creator.name}'s`}
                                link={`/u/${link.PostA.Creator.handle}`}
                            />
                            <TextLink text='post' link={`/p/${link.PostA.id}`} />
                            {link.Creator.id === accountData.id && (
                                <Button
                                    text='Delete'
                                    colour='blue'
                                    size='small'
                                    onClick={() => removeLink('incoming', link.id, link.PostA.id)}
                                />
                            )}
                        </Row>
                    ))}
                </div>
            )}
            {OutgoingLinks.length > 0 && (
                <div className={styles.links}>
                    <h2>Outgoing:</h2>
                    {OutgoingLinks.map((link) => (
                        <Row key={link.id} centerY>
                            <ImageTitle
                                type='user'
                                imagePath={link.Creator.flagImagePath}
                                title={link.Creator.name}
                                link={`/u/${link.Creator.handle}`}
                            />
                            <p>linked to</p>
                            <ImageTitle
                                type='user'
                                imagePath={link.PostB.Creator.flagImagePath}
                                title={`${link.PostB.Creator.name}'s`}
                                link={`/u/${link.PostB.Creator.handle}`}
                            />
                            <TextLink text='post' link={`/p/${link.PostB.id}`} />
                            {link.Creator.id === accountData.id && (
                                <Button
                                    text='Delete'
                                    colour='blue'
                                    size='small'
                                    onClick={() => removeLink('outgoing', link.id, link.PostB.id)}
                                />
                            )}
                        </Row>
                    ))}
                </div>
            )}
            {loggedIn ? (
                <Column centerX style={{ marginTop: links.length ? 20 : 0 }}>
                    <Input
                        title='Link to another post'
                        type='text'
                        prefix='p/'
                        value={linkTarget.value}
                        state={linkTarget.state}
                        errors={linkTarget.errors}
                        onChange={(v) => updateValue('linkTarget', v)}
                        style={{ marginBottom: 10 }}
                    />
                    <Input
                        title='Description (optional)'
                        type='text'
                        placeholder='link description...'
                        value={linkDescription.value}
                        state={linkDescription.state}
                        errors={linkDescription.errors}
                        onChange={(v) => updateValue('linkDescription', v)}
                        style={{ marginBottom: 30 }}
                    />
                    <Button text='Add link' colour='blue' onClick={addLink} loading={loading} />
                </Column>
            ) : (
                <Row centerY style={{ marginTop: links.length ? 20 : 0 }}>
                    <Button
                        text='Log in'
                        colour='blue'
                        style={{ marginRight: 5 }}
                        onClick={() => {
                            setLogInModalOpen(true)
                            close()
                        }}
                    />
                    <p>to link posts</p>
                </Row>
            )}
        </Modal>
    )
}

export default PostCardLinkModal
