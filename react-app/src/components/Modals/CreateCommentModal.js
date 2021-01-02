import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/CreateCommentModal.module.scss'
// import HandleInput from './HandleInput'

function CreateCommentModal() {
    const { accountData, isLoggedIn, setCreateCommentModalOpen, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const { postData, getPostData, getPostComments } = useContext(PostContext)
    const { holonData } = useContext(HolonContext)
    
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)

    function submitComment(e) {
        e.preventDefault()
        const invalidComment = newComment.length < 1 || newComment.length > 10000
        if (!isLoggedIn) { setAlertMessage('Log in to comment'); setAlertModalOpen(true) }
        else {
            if (invalidComment) { setCommentError(true) }
            else {
                axios
                    .post(config.apiURL + '/add-comment', { 
                        accountId: accountData.id,
                        accountHandle: accountData.handle,
                        accountName: accountData.name,
                        postId: postData.id,
                        holonId: window.location.pathname.includes('/s/') ? holonData.id : null,
                        text: newComment
                    })
                    .then(res => {
                        //console.log('res: ', res)
                        if (res.data === 'success') {
                            setCreateCommentModalOpen(false)
                            getPostData()
                            getPostComments()
                        }
                    })
                    //.then(setTimeout(() => { getPostData(); getPostComments() }, 200))
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
                <span className={styles.title}>Comment on {postData.creator.name}'s post</span>
                <form className={styles.form} onSubmit={submitComment}>
                    <textarea 
                        className={`wecoInput ${commentError && 'error'}`}
                        style={{ paddingTop: 10, marginBottom: 30 }}
                        placeholder="Comment..." //rows="3"
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
