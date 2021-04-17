import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/CreateCommentModal.module.scss'
// import HandleInput from './HandleInput'
import CloseOnClickOutside from '../CloseOnClickOutside'
import CloseButton from '../CloseButton'

const CreateCommentModal = (): JSX.Element => {
    const {
        accountData,
        isLoggedIn,
        setCreateCommentModalOpen,
        setAlertMessage,
        setAlertModalOpen,
    } = useContext(AccountContext)
    const { postData, getPostData, getPostComments } = useContext(PostContext)
    const { spaceData } = useContext(SpaceContext)

    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)

    function submitComment(e) {
        e.preventDefault()
        const invalidComment = newComment.length < 1 || newComment.length > 10000
        if (!isLoggedIn) {
            setAlertMessage('Log in to comment')
            setAlertModalOpen(true)
        } else if (invalidComment) {
            setCommentError(true)
        } else {
            axios
                .post(`${config.apiURL}/add-comment`, {
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    postId: postData.id,
                    holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    text: newComment,
                })
                .then((res) => {
                    // console.log('res: ', res)
                    if (res.data === 'success') {
                        setCreateCommentModalOpen(false)
                        getPostData()
                        getPostComments()
                    }
                })
            // .then(setTimeout(() => { getPostData(); getPostComments() }, 200))
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={() => setCreateCommentModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setCreateCommentModalOpen(false)} />
                    <span className={styles.title}>
                        {`Comment on ${
                            postData && postData.creator ? postData.creator.name : ''
                        }'s post`}
                    </span>
                    <form className={styles.form} onSubmit={submitComment}>
                        <textarea
                            className={`wecoInput ${commentError && 'error'}`}
                            style={{ paddingTop: 10, marginBottom: 30 }}
                            placeholder='Comment...'
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value)
                                setCommentError(false)
                            }}
                        />
                        <button type='submit' className='wecoButton'>
                            Add comment
                        </button>
                    </form>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default CreateCommentModal

// const [flashMessage, setFlashMessage] = useState('')
// <span className={styles.flashMessage}>{ flashMessage }</span>
