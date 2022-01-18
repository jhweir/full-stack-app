import React, { useContext, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/NotificationCard.module.scss'
import ImageNameLink from '@components/ImageNameLink'
import TextLink from '@components/TextLink'
import Button from '@components/Button'
import config from '@src/Config'
import { timeSinceCreated, dateCreated } from '@src/Functions'
import { ReactComponent as EyeOpenIconSVG } from '@svgs/eye-solid.svg'
import { ReactComponent as EyeClosedIconSVG } from '@svgs/eye-slash-solid.svg'
import { ReactComponent as SuccessIconSVG } from '@svgs/check-circle-solid.svg'
import { ReactComponent as FailIconSVG } from '@svgs/times-circle-regular.svg'
import { ReactComponent as OverlappingCirclesIconSVG } from '@svgs/overlapping-circles-thick.svg'
import { ReactComponent as CommentIconSVG } from '@svgs/comment-solid.svg'
import { ReactComponent as LinkIconSVG } from '@svgs/link-solid.svg'
import { ReactComponent as StarIconSVG } from '@svgs/star-solid.svg'
import { ReactComponent as BabyIconSVG } from '@svgs/baby-solid.svg'
import { ReactComponent as EnvelopeIconSVG } from '@svgs/envelope-solid.svg'
import { ReactComponent as ThumbsUpIconSVG } from '@svgs/thumbs-up-solid.svg'
import { ReactComponent as RetweetIconSVG } from '@svgs/retweet-solid.svg'

const Content = (props: { typeIcon: JSX.Element; children: any }): JSX.Element => {
    const { typeIcon, children } = props
    return (
        <>
            <div className={styles.typeIcon}>{typeIcon}</div>
            <div className={styles.content}>{children}</div>
        </>
    )
}

const CreatedAt = (props: { date: string }): JSX.Element => {
    const { date } = props
    return <p title={dateCreated(date)}>• {timeSinceCreated(date)}</p>
}

const SuccessIcon = (): JSX.Element => {
    return (
        <div className={`${styles.inlineIcon} ${styles.green}`}>
            <SuccessIconSVG />
        </div>
    )
}

const FailIcon = (): JSX.Element => {
    return (
        <div className={`${styles.inlineIcon} ${styles.red}`}>
            <FailIconSVG />
        </div>
    )
}

const State = (props: {
    state: 'pending' | 'accepted' | 'rejected'
    respond: (response: 'accepted' | 'rejected') => void
}): JSX.Element => {
    const { state, respond } = props

    return (
        <div className={styles.state}>
            {state === 'pending' && (
                <>
                    <Button
                        text='Accept'
                        color='blue'
                        size='small'
                        style={{ marginRight: 5 }}
                        onClick={() => respond('accepted')}
                    />
                    <Button
                        text='Reject'
                        color='aqua'
                        size='small'
                        style={{ marginRight: 5 }}
                        onClick={() => respond('rejected')}
                    />
                </>
            )}
            {state === 'accepted' && (
                <>
                    <p>•</p>
                    <p className={styles.green}>Accepted</p>
                    <SuccessIcon />
                </>
            )}
            {state === 'rejected' && (
                <>
                    <p>•</p>
                    <p className={styles.red}>Rejected</p>
                    <FailIcon />
                </>
            )}
        </div>
    )
}

const NotificationCard = (props: {
    notification: any
    location: 'account' | 'space'
    updateNotification: (id, key, payload) => void
}): JSX.Element => {
    // todo: add location prop: 'account' | 'space'
    const { notification, location, updateNotification } = props
    const {
        id,
        type,
        state,
        postId,
        // commentId,
        triggerUser,
        triggerSpace,
        secondarySpace,
        createdAt,
    } = notification

    // console.log(notification)

    const { accountData, updateAccountData } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)

    const [seen, setSeen] = useState(notification.seen)

    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')
    const you = triggerUser && accountData.id === triggerUser.id

    // function toggleSeen() {
    //     const data = { notificationId: id, seen: !seen }
    //     const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
    //     setSeen(!seen)
    //     axios
    //         .post(`${config.apiURL}/toggle-notification-seen`, data, authHeader)
    //         .then((res) => {
    //             if (res.data === 'success') {
    //                 updateAccountData(
    //                     'unseen_notifications',
    //                     accountData.unseen_notifications + (data.seen ? -1 : 1)
    //                 )
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('POST toggle-notification-seen error: ', error)
    //         })
    // }

    function respondToModInvite(response) {
        if (!accessToken) {
            // todo: open alert modal, tell user to log in
        } else {
            const data = {
                notificationId: id,
                userId: triggerUser.id,
                spaceId: triggerSpace.id,
                response,
            }
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/respond-to-mod-invite`, data, authHeader)
                .then((res) => {
                    if (res.status === 200) {
                        // update account context
                        updateNotification(id, 'state', response)
                        if (response === 'accepted') {
                            const newModeratedSpaces = [
                                ...accountData.ModeratedHolons,
                                {
                                    handle: triggerSpace.handle,
                                    name: triggerSpace.name,
                                    flagImagePath: triggerSpace.flagImagePath,
                                },
                            ]
                            updateAccountData('ModeratedHolons', newModeratedSpaces)
                        }
                        if (!seen) {
                            setSeen(true)
                            // todo: remove updateNotification function when notifications fetched on component mount
                            updateNotification(id, 'seen', true)
                            updateAccountData(
                                'unseen_notifications',
                                accountData.unseen_notifications - 1
                            )
                        }
                    } else {
                        // handle errors
                        console.log(res.data.message)
                    }
                })
                .catch((res) => console.log('res: ', res))
        }
    }

    function respondToParentSpaceRequest(response) {
        if (!accessToken) {
            // todo: open alert modal, tell user to log in
        } else {
            const data = {
                notificationId: id,
                notificationType: 'account',
                accountHandle: accountData.handle,
                accountName: accountData.name,
                triggerUser,
                childSpace: triggerSpace,
                parentSpace: secondarySpace,
                response,
            }
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/respond-to-parent-space-request`, data, authHeader)
                .then((res) => {
                    if (res.data === 'success') {
                        updateNotification(id, 'state', response)
                        if (!seen) {
                            setSeen(true)
                            updateNotification(id, 'seen', true)
                            updateAccountData(
                                'unseen_notifications',
                                accountData.unseen_notifications - 1
                            )
                        }
                    } else {
                        // handle errors
                        console.log(res.data)
                    }
                })
                .catch((res) => console.log('res: ', res))
        }
    }

    // todo: use switch case to render different notification types

    return (
        <div className={styles.wrapper}>
            {location === 'account' && (
                <>
                    {type === 'welcome-message' && (
                        <Content typeIcon={<BabyIconSVG />}>
                            <p>Account created</p>
                            <SuccessIcon />
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'email-verified' && (
                        <Content typeIcon={<EnvelopeIconSVG />}>
                            <p>Email verified</p>
                            <SuccessIcon />
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'post-like' && (
                        <Content typeIcon={<ThumbsUpIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>liked your</p>
                            <TextLink text='post' link={`/p/${postId}`} />
                            {triggerSpace && <p>in</p>}
                            {triggerSpace && <ImageNameLink type='space' data={triggerSpace} />}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'post-comment' && (
                        <Content typeIcon={<CommentIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>commented on your</p>
                            <TextLink text='post' link={`/p/${postId}`} />
                            {triggerSpace && <p>in</p>}
                            {triggerSpace && <ImageNameLink type='space' data={triggerSpace} />}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'post-repost' && (
                        <Content typeIcon={<RetweetIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>reposted your</p>
                            <TextLink text='post' link={`/p/${postId}`} />
                            {triggerSpace && <p>in</p>}
                            {triggerSpace && <ImageNameLink type='space' data={triggerSpace} />}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'post-rating' && (
                        <Content typeIcon={<StarIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>rated your</p>
                            <TextLink text='post' link={`/p/${postId}`} />
                            {triggerSpace && <p>in</p>}
                            {triggerSpace && <ImageNameLink type='space' data={triggerSpace} />}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'post-link' && (
                        <Content typeIcon={<LinkIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>linked your</p>
                            <TextLink text='post' link={`/p/${postId}`} />
                            {/* todo: add postAId and postBId columns in the database so secondary post can be linked */}
                            <p>to another post</p>
                            {triggerSpace && <p>in</p>}
                            {triggerSpace && <ImageNameLink type='space' data={triggerSpace} />}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'comment-reply' && (
                        <Content typeIcon={<CommentIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>replied to your</p>
                            <TextLink text='comment' link={`/p/${postId}`} />
                            {triggerSpace && <p>in</p>}
                            {triggerSpace && <ImageNameLink type='space' data={triggerSpace} />}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'parent-space-request' && (
                        <Content typeIcon={<OverlappingCirclesIconSVG />}>
                            <ImageNameLink type='user' data={triggerUser} />
                            <p>wants to make</p>
                            <ImageNameLink type='space' data={triggerSpace} />
                            <p>a child space of</p>
                            <ImageNameLink type='space' data={secondarySpace} />
                            <CreatedAt date={createdAt} />
                            <State
                                state={state}
                                respond={(response) => respondToParentSpaceRequest(response)}
                            />
                        </Content>
                    )}

                    {type === 'parent-space-request-response' && (
                        <Content typeIcon={<OverlappingCirclesIconSVG />}>
                            <ImageNameLink type='user' data={triggerUser} />
                            <p>{state} your request to make</p>
                            <ImageNameLink type='space' data={triggerSpace} />
                            <p>a child space of</p>
                            <ImageNameLink type='space' data={secondarySpace} />
                            {/* {state === 'accepted' ? <SuccessIcon /> : <FailIcon />} */}
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'mod-invite' && (
                        <Content typeIcon={<OverlappingCirclesIconSVG />}>
                            <ImageNameLink type='user' data={triggerUser} />
                            <p>invited you to moderate</p>
                            <ImageNameLink type='space' data={triggerSpace} />
                            <CreatedAt date={createdAt} />
                            <State
                                state={state}
                                respond={(response) => respondToModInvite(response)}
                            />
                        </Content>
                    )}

                    {type === 'mod-invite-response' && (
                        <Content typeIcon={<OverlappingCirclesIconSVG />}>
                            <ImageNameLink type='user' data={triggerUser} />
                            <p>{state} your invitation to moderate</p>
                            <ImageNameLink type='space' data={triggerSpace} />
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {type === 'mod-removed' && (
                        <Content typeIcon={<OverlappingCirclesIconSVG />}>
                            {you ? <p>You</p> : <ImageNameLink type='user' data={triggerUser} />}
                            <p>just removed you from moderating</p>
                            <ImageNameLink type='space' data={triggerSpace} />
                            <CreatedAt date={createdAt} />
                        </Content>
                    )}

                    {/* <button
                        className={styles.seenButton}
                        type='button'
                        onClick={() => toggleSeen()}
                    >
                        {seen ? <EyeOpenIconSVG /> : <EyeClosedIconSVG />}
                    </button> */}
                </>
            )}

            {location === 'space' && (
                <>
                    {type === 'parent-space-request' && (
                        <Content typeIcon={<OverlappingCirclesIconSVG />}>
                            <ImageNameLink type='user' data={triggerUser} />
                            <p>wants to make</p>
                            <ImageNameLink type='space' data={triggerSpace} />
                            <p>a child space of</p>
                            <ImageNameLink type='space' data={spaceData} />
                            <CreatedAt date={createdAt} />
                            <State
                                state={state}
                                respond={(response) => respondToParentSpaceRequest(response)}
                            />
                        </Content>
                    )}
                </>
            )}
        </div>
    )
}

export default NotificationCard
