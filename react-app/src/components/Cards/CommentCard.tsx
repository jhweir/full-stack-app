import React, { useContext, useState, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CommentCard.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import SmallFlagImage from '../SmallFlagImage'
import CommentCardComment from './CommentCardComment'
import { resizeTextArea } from '../../Functions'

const CommentCard = (props: {
    comment: any
    totalComments: number | undefined
    setTotalComments: (payload: number) => void
    getPostComments: () => void
}): JSX.Element => {
    const { comment, totalComments, setTotalComments, getPostComments } = props
    const { accountData, loggedIn, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)

    const [replyInputOpen, setReplyInputOpen] = useState(false)
    const [newReply, setNewReply] = useState('')
    const [newReplyError, setNewReplyError] = useState(false)

    const replyInput = useRef<HTMLTextAreaElement>(null)

    function openReplyInput() {
        if (loggedIn) {
            Promise.all([setReplyInputOpen(!replyInputOpen)]).then(() => {
                const { current } = replyInput
                if (current && !replyInputOpen) {
                    const yOffset = window.screen.height / 2.3
                    const top = current.getBoundingClientRect().top + window.pageYOffset - yOffset
                    window.scrollTo({ top, behavior: 'smooth' })
                }
            })
        } else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to reply')
        }
    }

    function submitReply(e) {
        e.preventDefault()
        const invalidReply = newReply.length < 1 || newReply.length > 10000
        if (invalidReply) setNewReplyError(true)
        else {
            axios
                .post(`${config.apiURL}/submit-reply`, {
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    postId: comment.postId,
                    parentCommentId: comment.id,
                    text: newReply,
                })
                .then((res) => {
                    if (res.data === 'success' && totalComments) {
                        setTotalComments(totalComments + 1)
                        setReplyInputOpen(false)
                        setNewReply('')
                        setTimeout(() => {
                            getPostComments()
                        }, 300)
                    }
                })
        }
    }

    return (
        <div className={styles.wrapper}>
            <CommentCardComment
                comment={comment}
                totalComments={totalComments || 0}
                setTotalComments={setTotalComments}
                getPostComments={getPostComments}
                openReplyInput={openReplyInput}
            />
            {comment.replies.map((reply) => (
                <CommentCardComment
                    key={reply.id}
                    comment={reply}
                    totalComments={totalComments || 0}
                    setTotalComments={setTotalComments}
                    getPostComments={getPostComments}
                    openReplyInput={openReplyInput}
                />
            ))}
            {replyInputOpen && (
                <div className={styles.replyInput}>
                    <SmallFlagImage type='user' size={35} imagePath={accountData.flagImagePath} />
                    <form className={styles.inputWrapper} onSubmit={submitReply}>
                        <textarea
                            ref={replyInput}
                            className={`${styles.input} ${newReplyError && styles.error}`}
                            rows={1}
                            value={newReply}
                            placeholder='Write a reply...'
                            onChange={(e) => {
                                setNewReply(e.target.value)
                                setNewReplyError(false)
                                resizeTextArea(e.target)
                            }}
                        />
                        <button className={styles.button} type='submit'>
                            Reply
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CommentCard
