import React, { useContext, useState, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CommentCard.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import SmallFlagImage from '../../components/SmallFlagImage'
import CommentCardComment from './CommentCardComment'
import { resizeTextArea } from '../../GlobalFunctions'

function CommentCard(props) {
    const { comment, totalComments, setTotalComments, getPostComments } = props
    const { accountData, isLoggedIn, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)

    const [replyInputOpen, setReplyInputOpen] = useState(false)
    const [newReply, setNewReply] = useState('')
    const [newReplyError, setNewReplyError] = useState(false)

    const replyInput = useRef()

    function openReplyInput() {
        if (isLoggedIn) {
            Promise
                .all([setReplyInputOpen(!replyInputOpen)])
                .then(() => {
                    if (!replyInputOpen) {
                        const yOffset = (window.screen.height / 2.3)
                        const top = replyInput.current.getBoundingClientRect().top + window.pageYOffset - yOffset
                        window.scrollTo({ top, behavior: 'smooth' })
                    }
                })
        }
        else { setAlertModalOpen(true); setAlertMessage('Log in to reply') }
    }

    function submitReply(e) {
        e.preventDefault()
        const invalidReply = newReply.length < 1 || newReply.length > 10000
        if (invalidReply) setNewReplyError(true)
        else {
            axios
                .post(config.apiURL + '/submit-reply', { 
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    holonId: window.location.pathname.includes('/s/') ? holonData.id : null,
                    postId: comment.postId,
                    parentCommentId: comment.id,
                    text: newReply
                })
                .then(res => {
                    if (res.data === 'success') {
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
                totalComments={totalComments}
                setTotalComments={setTotalComments}
                getPostComments={getPostComments}
                openReplyInput={openReplyInput}
            />
            {comment.replies.map((reply, index) => 
                <CommentCardComment
                    key={index}
                    comment={reply}
                    totalComments={totalComments}
                    setTotalComments={setTotalComments}
                    getPostComments={getPostComments}
                    openReplyInput={openReplyInput}
                />
            )}
            {replyInputOpen &&
                <div className={styles.replyInput}>
                    <SmallFlagImage type='user' size={35} imagePath={accountData.flagImagePath}/>
                    <form className={styles.inputWrapper} onSubmit={submitReply}>
                        <textarea
                            ref={replyInput}
                            className={`${styles.input} ${newReplyError && styles.error}`}
                            type="text"
                            rows='1'
                            value={newReply}
                            placeholder="Write a reply..."
                            onChange={(e) => {
                                setNewReply(e.target.value)
                                setNewReplyError(false)
                                resizeTextArea(e.target)
                            }}
                        />
                        <button className={styles.button}>Reply</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default CommentCard
