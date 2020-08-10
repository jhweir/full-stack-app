import React, { useContext, useEffect } from 'react'
import styles from '../../styles/components/PostPageComments.module.scss'
import CommentCard from '../Cards/CommentCard'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'

function PostPageComments() {
    const { pageBottomReached } = useContext(AccountContext)
    const {
        postContextLoading,
        postData,
        postComments, getPostComments, getNextPostComments,
        submitComment,
        commentError, setCommentError,
        newComment, setNewComment
    } = useContext(PostContext)

    useEffect(() => {
        if (!postContextLoading && postData.id) { getPostComments() }
    }, [postContextLoading])

    useEffect(() => {
        if (pageBottomReached && !postContextLoading && postData.id) { getNextPostComments() }
    }, [pageBottomReached])

    return (
        <div className={styles.postPageComments}>
            <form className={styles.commentForm} onSubmit={submitComment}> 
                <textarea className={`${styles.commentFormTextArea} ${(commentError && styles.error)}`}
                    placeholder="Leave a comment..."
                    rows="1" type="text" value={newComment}
                    onChange={(e) => { setNewComment(e.target.value); setCommentError(false) }}
                />
                <div className="button-container">
                    <button className={styles.commentFormButton}>Post comment</button>
                </div>
            </form>
            <div className={styles.comments}>
                {postComments.map((comment, index) => 
                    <CommentCard
                        key={index}
                        index={index}
                        comment={comment}
                    /> 
                )}
            </div>
        </div>
    )
}

export default PostPageComments