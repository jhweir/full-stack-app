import React from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/DeleteCommentModal.module.scss'
import CloseButton from '../CloseButton'
import CloseOnClickOutside from '../CloseOnClickOutside'

const DeleteCommentModal = (props: {
    commentId: number
    totalComments: number
    setTotalComments: (payload: number) => void
    setDeleteCommentModalOpen: (payload: boolean) => void
    getPostComments: () => void
}): JSX.Element => {
    const {
        commentId,
        totalComments,
        setTotalComments,
        setDeleteCommentModalOpen,
        getPostComments,
    } = props

    function deleteComment() {
        axios
            .delete(`${config.apiURL}/delete-comment`, { data: { commentId } })
            .then((res) => {
                if (res.data === 'success') {
                    setDeleteCommentModalOpen(false)
                    setTotalComments(totalComments - 1)
                    setTimeout(() => {
                        getPostComments()
                    }, 300)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={() => setDeleteCommentModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setDeleteCommentModalOpen(false)} />
                    <span className={styles.text}>
                        Are you sure you want to delete your comment?
                    </span>
                    <div
                        className='wecoButton'
                        role='button'
                        tabIndex={0}
                        onClick={deleteComment}
                        onKeyDown={deleteComment}
                    >
                        Yes
                    </div>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default DeleteCommentModal
