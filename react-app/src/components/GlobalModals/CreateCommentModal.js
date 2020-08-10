import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import styles from '../../styles/components/CreateCommentModal.module.scss'
// import HolonHandleInput from './HolonHandleInput'

function CreateCommentModal() {
    const { accountData, isLoggedIn, setCreateCommentModalOpen, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const { postData, getPostComments } = useContext(PostContext)
    
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)

    function submitComment(e) {
        e.preventDefault()
        const invalidComment = newComment.length < 1 || newComment.length > 10000
        if (!isLoggedIn) { setAlertMessage('Log in to comment'); setAlertModalOpen(true) }
        else {
            if (invalidComment) { setCommentError(true) }
            else {
                axios.post(config.environmentURL + '/add-comment', { creatorId: accountData.id, postId: postData.id, text: newComment })
                    .then(setCreateCommentModalOpen(false))
                    .then(setTimeout(() => { getPostComments() }, 200))
            }
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeButton}
                    src="/icons/close-01.svg"
                    onClick={() => setCreateCommentModalOpen(false)}
                />
                <span className={styles.title}>Add a new comment on {postData.creator.name}'s post</span>
                <form className={styles.form} onSubmit={submitComment}>
                    <textarea 
                        className={`wecoInput ${commentError && 'error'}`}
                        style={{ paddingTop: 10, marginBottom: 30 }}
                        placeholder="Comment" //rows="3"
                        type="text" value={newComment}
                        onChange={(e) => { setNewComment(e.target.value); setCommentError(false) }}
                    />
                    <button className='wecoButton'>Add comment</button>
                </form>
            </div>
        </div>
    )
}

export default CreateCommentModal

// const [flashMessage, setFlashMessage] = useState('')
// <span className={styles.flashMessage}>{ flashMessage }</span>
