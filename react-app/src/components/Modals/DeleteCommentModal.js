import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/DeleteCommentModal.module.scss'
import CloseButton from '../CloseButton'

function DeleteCommentModal(props) {
    const { commentId, totalComments, setTotalComments, setDeleteCommentModalOpen, getPostComments } = props

    function deleteComment() {
        axios
            .delete(config.apiURL  + '/delete-comment', { data: { commentId } })
            .then(res => {
                if (res.data === 'success') {
                    setDeleteCommentModalOpen(false)
                    setTotalComments(totalComments - 1)
                    setTimeout(() => {
                        getPostComments()
                    }, 300)
                }
            })
            .catch(error => { console.log(error) })
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setDeleteCommentModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setDeleteCommentModalOpen(false)}/>
                <span className={styles.text}>Are you sure you want to delete your comment?</span>
                <div
                    className="wecoButton"
                    onClick={deleteComment}>
                    Yes
                </div>
            </div>
        </div>
    )
}

export default DeleteCommentModal