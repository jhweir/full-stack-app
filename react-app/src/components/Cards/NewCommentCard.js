import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/NewCommentCard.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import { PostContext } from '../../contexts/PostContext'
import SmallFlagImage from '../../components/SmallFlagImage'
import { timeSinceCreated, dateCreated } from '../../GlobalFunctions'

function NewCommentCard(props) {
    const { comment, totalComments, setTotalComments, getPostComments } = props
    const { accountData, isLoggedIn, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)

    const [replyInputOpen, setReplyInputOpen] = useState(false)
    const [newReply, setNewReply] = useState('')
    const [newReplyError, setNewReplyError] = useState(false)

    const isOwnComment = accountData.id === comment.creator.id

    function deleteComment() {
        // TODO: add confirmation modal
        axios.delete(config.apiURL  + '/delete-comment', { data: { commentId: comment.id } })
            .then(setTimeout(() => {
                //getPostData(); getPostComments()
            }, 200))
            .catch(error => { console.log(error) })
    }

    function openReplyInput() {
        if (isLoggedIn) setReplyInputOpen(!replyInputOpen)
        else { setAlertModalOpen(true); setAlertMessage('Log in to reply') }
    }

    function submitReply(e) {
        e.preventDefault()
        const invalidReply = newReply.length < 1 || newReply.length > 10000
        if (invalidReply) { setNewReplyError(true) }
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
                        setNewReply('')
                        setTotalComments(totalComments + 1)
                        setTimeout(() => {
                            getPostComments()
                        }, 300)
                    }
                })
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.commentWrapper}>
                <Link to={ `/u/${comment.creator.handle}`} className={styles.user}>
                    <SmallFlagImage type='user' size={35} imagePath={comment.creator.flagImagePath}/>
                </Link>
                <div className={styles.comment}>
                    <div className={styles.content}>
                        <div className={styles.tags}>
                            <span className={styles.name}>{ comment.creator.name }</span>
                            <span className={styles.divider}>|</span>
                            <span className={styles.date} title={dateCreated(comment.createdAt)}>
                                { timeSinceCreated(comment.createdAt) }
                            </span>
                        </div>
                        <span className={styles.text}>{ comment.text }</span>
                    </div>
                    <div className={styles.interact}>
                        {/* <span className={styles.interactItem}>Like</span> */}
                        <div className={styles.interactItem} onClick={openReplyInput}>
                            <img className={`${styles.icon} ${styles.rotated}`} src="/icons/reply-solid.svg" alt=''/>
                            <span>Reply</span>
                        </div>
                        {isOwnComment &&
                            <div className={styles.interactItem} onClick={deleteComment}>
                                <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                <span>Delete</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {comment.replies.map((reply, index) => 
                <div className={styles.replyWrapper} key={index}>
                    <Link to={ `/u/${reply.creator.handle}`} className={styles.user}>
                        <SmallFlagImage type='user' size={35} imagePath={reply.creator.flagImagePath}/>
                    </Link>
                    <div className={styles.reply}>
                        <div className={styles.content}>
                            <div className={styles.tags}>
                                <span className={styles.name}>{ reply.creator.name }</span>
                                <span className={styles.divider}>|</span>
                                <span className={styles.date} title={dateCreated(reply.createdAt)}>
                                    { timeSinceCreated(reply.createdAt) }
                                </span>
                            </div>
                            <span className={styles.text}>{ reply.text }</span>
                        </div>
                        <div className={styles.interact}>
                            {/* <span className={styles.interactItem}>Like</span> */}
                            <div className={styles.interactItem} onClick={openReplyInput}>
                                <img className={`${styles.icon} ${styles.rotated}`} src="/icons/reply-solid.svg" alt=''/>
                                <span>Reply</span>
                            </div>
                            {accountData.id === reply.creator.id &&
                                <div className={styles.interactItem} onClick={deleteComment}>
                                    <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                    <span>Delete</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )}
            {replyInputOpen &&
                <div className={styles.replyInput}>
                    <SmallFlagImage type='user' size={35} imagePath={accountData.flagImagePath}/>
                    <form className={styles.inputWrapper} onSubmit={submitReply}>
                        <textarea 
                            className={`${styles.input} ${newReplyError && 'error'}`}
                            type="text"
                            rows='1'
                            value={newReply}
                            placeholder="Write a reply..."
                            onChange={(e) => {
                                setNewReply(e.target.value)
                                setNewReplyError(false)
                                e.target.style.height = ''
                                e.target.style.height = e.target.scrollHeight + 'px'
                            }}
                        />
                        <button className={styles.button}>Reply</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default NewCommentCard
