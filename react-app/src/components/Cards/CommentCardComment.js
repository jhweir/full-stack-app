import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/CommentCardComment.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import SmallFlagImage from '../../components/SmallFlagImage'
import DeleteCommentModal from '../../components/Modals/DeleteCommentModal'
import { timeSinceCreated, dateCreated } from '../../GlobalFunctions'

function CommentCardComment(props) {
    const { comment, openReplyInput, totalComments, setTotalComments, getPostComments } = props
    const { accountData, isLoggedIn } = useContext(AccountContext)

    const [commentOverflow, setCommentOverflow] = useState(false)
    const [showFullComment, setShowFullComment] = useState(false)
    const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false)

    const isOwnComment = accountData.id === comment.creator.id
    const isReply = comment.parentCommentId !== null
    const commentText = useRef()

    useEffect(() => {
        if (commentText.current && commentText.current.scrollHeight > 100) {
            setCommentOverflow(true)
        } else {
            setCommentOverflow(false)
        }
    }, [props])

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.commentWrapper} ${isReply && styles.indented} ${!isLoggedIn && styles.marginBottom}`}>
                <Link to={ `/u/${comment.creator.handle}`} className={styles.user}>
                    <SmallFlagImage type='user' size={35} imagePath={comment.creator.flagImagePath}/>
                </Link>
                <div className={styles.comment}>
                    <div className={styles.content}>
                        <div className={styles.tags}>
                            <Link to={ `/u/${comment.creator.handle}`}>
                                <span className={styles.name}>{ comment.creator.name }</span>
                            </Link>
                            <span className={styles.date} title={dateCreated(comment.createdAt)}>
                                { `| ${timeSinceCreated(comment.createdAt)}` }
                            </span>
                        </div>
                        <span ref={commentText} className={`${styles.text} ${showFullComment && styles.expanded}`}>{ comment.text }</span>
                        {commentOverflow &&
                            <span
                                className={styles.showMoreLessText}
                                onClick={() => setShowFullComment(!showFullComment)}>
                                {showFullComment ? 'Show less' : 'Show more'}
                            </span>
                        }
                    </div>
                    {isLoggedIn &&
                        <div className={styles.interact}>
                            <div className={styles.interactItem} onClick={openReplyInput}>
                                <img className={`${styles.icon} ${styles.rotated}`} src="/icons/reply-solid.svg" alt=''/>
                                <span>Reply</span>
                            </div>
                            {isOwnComment &&
                                <div className={styles.interactItem} onClick={() => setDeleteCommentModalOpen(true)}>
                                    <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                    <span>Delete</span>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
            {deleteCommentModalOpen &&
                <DeleteCommentModal
                    commentId={comment.id}
                    totalComments={totalComments}
                    setTotalComments={setTotalComments}
                    getPostComments={getPostComments}
                    setDeleteCommentModalOpen={setDeleteCommentModalOpen}
                />
            }
        </div>
    )
}

export default CommentCardComment
