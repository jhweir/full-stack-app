import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/NewCommentCard.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import { PostContext } from '../../contexts/PostContext'
import SmallFlagImage from '../../components/SmallFlagImage'

function NewCommentCard(props) {
    const { index, comment } = props
    const { postId, commentCreator, text, createdAt } = comment
    const { accountData, isLoggedIn, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)
    const { getPostData, getPostComments } = useContext(PostContext)

    const [replyInputOpen, setReplyInputOpen] = useState(false)
    const [reply, setReply] = useState('')
    const [replyError, setReplyError] = useState(false)

    const isOwnComment = accountData.id === commentCreator.id

    function openReply() {
        if (isLoggedIn) setReplyInputOpen(!replyInputOpen)
        else { setAlertModalOpen(true); setAlertMessage('Log in to reply') }
    }

    function submitReply(e) {
        e.preventDefault()
        const invalidReply = reply.length < 1 || reply.length > 10000
        if (invalidReply) { setReplyError(true) }
        else {
            axios
                .post(config.apiURL + '/submit-reply', { 
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    holonId: window.location.pathname.includes('/s/') ? holonData.id : null,
                    postId,
                    parentCommentId: comment.id,
                    text: reply
                })
                .then(res => {
                    //console.log('res: ', res)
                    if (res.data === 'success') {
                        getPostData()
                        getPostComments()
                    }
                })
                //.then(setTimeout(() => { getPostData(); getPostComments() }, 200))
        }
    }

    function deleteComment() {
        // TODO: add confirmation modal
        axios.delete(config.apiURL  + '/delete-comment', { data: { commentId: comment.id } })
            .then(setTimeout(() => { getPostData(); getPostComments() }, 200))
            .catch(error => { console.log(error) })
    }

    function parsedDate() {
        const t = createdAt.split(/[-.T :]/)
        let parsedDate = t[3]+':'+t[4]+' on '+t[2]+'-'+t[1]+'-'+t[0]
        return parsedDate
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.contentWrapper}>
                <Link to={ `/u/${commentCreator.handle}`} className={styles.user}>
                    <SmallFlagImage type='user' size={30} imagePath={commentCreator.flagImagePath}/>
                    {/* <span className={styles.subText}>{ commentCreator.name }</span> */}
                </Link>
                <div className={styles.content}>
                    <div className={styles.grey}>
                        <div className={styles.tags}>
                            <span className={styles.name}>{ commentCreator.name }</span>
                            <span className={styles.divider}>|</span>
                            <span className={styles.date}>{ parsedDate() }</span>
                        </div>
                        <span className={styles.text}>{ text }</span>
                    </div>
                    <div className={styles.interact}>
                        {/* <span className={styles.interactItem}>Like</span> */}
                        <div className={styles.interactItem} onClick={openReply}>
                            <img className={`${styles.icon} ${styles.rotated}`} src="/icons/reply-solid.svg" alt=''/>
                            <span>Reply</span>
                        </div>
                        {/* <span className={styles.interactItem}>Reply</span> */}
                        {isOwnComment &&
                            <div className={styles.interactItem} onClick={deleteComment}>
                                <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                <span>Delete</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {replyInputOpen &&
                <div className={styles.reply}>
                    <SmallFlagImage type='user' size={30} imagePath={accountData.flagImagePath}/>
                    <form className={styles.inputWrapper} onSubmit={submitReply}>
                        <textarea 
                            className={`${styles.input} ${replyError && 'error'}`}
                            type="text"
                            value={reply}
                            placeholder="Reply..."
                            onChange={(e) => { setReply(e.target.value); setReplyError(false) }}
                        />
                        <button className='wecoButton'>Reply</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default NewCommentCard