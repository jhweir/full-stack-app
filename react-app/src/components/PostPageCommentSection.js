import React from 'react'
import styles from '../styles/components/PostPageCommentSection.module.scss'
import Comment from './Comment'

function PostPageCommentSection(props) {
    const {
        submitComment,
        commentError,
        newComment,
        setNewComment,
        setCommentError,
        post
    } = props
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
                {post && post.Comments.map((comment, index) => 
                    <Comment 
                        key={comment.id}
                        index={index}
                        comment={comment}
                    /> 
                )}
            </div>
        </div>
    )
}

export default PostPageCommentSection