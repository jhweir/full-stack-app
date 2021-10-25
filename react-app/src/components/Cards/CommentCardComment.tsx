import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/CommentCardComment.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import SmallFlagImage from '../SmallFlagImage'
import DeleteItemModal from '../Modals/DeleteItemModal'
import { timeSinceCreated, dateCreated } from '../../Functions'

const CommentCardComment = (props: {
    comment: any
    totalComments: number
    openReplyInput: () => void
    setTotalComments: (payload: number) => void
    getPostComments: () => void
}): JSX.Element => {
    const { comment, openReplyInput, totalComments, setTotalComments, getPostComments } = props
    const { accountData, loggedIn } = useContext(AccountContext)

    const [commentOverflow, setCommentOverflow] = useState(false)
    const [showFullComment, setShowFullComment] = useState(false)
    const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false)

    const isOwnComment = accountData.id === comment.creator.id
    const isReply = comment.parentCommentId !== null
    const commentText = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (commentText.current && commentText.current.scrollHeight > 100) {
            setCommentOverflow(true)
        } else {
            setCommentOverflow(false)
        }
    }, [props])

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.commentWrapper} ${isReply && styles.indented} ${
                    !loggedIn && styles.marginBottom
                }`}
            >
                <Link to={`/u/${comment.creator.handle}`} className={styles.user}>
                    <SmallFlagImage
                        type='user'
                        size={30}
                        imagePath={comment.creator.flagImagePath}
                    />
                </Link>
                <div className={styles.comment}>
                    <div className={styles.content}>
                        <div className={styles.tags}>
                            <Link to={`/u/${comment.creator.handle}`}>
                                <span className={styles.name}>{comment.creator.name}</span>
                            </Link>
                            <span className={styles.date} title={dateCreated(comment.createdAt)}>
                                {`• ${timeSinceCreated(comment.createdAt)}`}
                            </span>
                        </div>
                        <div
                            ref={commentText}
                            className={`${styles.text} ${showFullComment && styles.expanded}`}
                        >
                            {comment.text}
                        </div>
                        {commentOverflow && (
                            <div
                                className={styles.showMoreLessText}
                                role='button'
                                tabIndex={0}
                                onClick={() => setShowFullComment(!showFullComment)}
                                onKeyDown={() => setShowFullComment(!showFullComment)}
                            >
                                {showFullComment ? 'Show less' : 'Show more'}
                            </div>
                        )}
                    </div>
                    {loggedIn && (
                        <div className={styles.interact}>
                            <div
                                className={styles.interactItem}
                                role='button'
                                tabIndex={0}
                                onClick={openReplyInput}
                                onKeyDown={openReplyInput}
                            >
                                {/* <img className={`${styles.icon} ${styles.rotated}`} src="/icons/reply-solid.svg" alt=''/> */}
                                <span>Reply</span>
                            </div>
                            {isOwnComment && (
                                <div
                                    className={styles.interactItem}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => setDeleteCommentModalOpen(true)}
                                    onKeyDown={() => setDeleteCommentModalOpen(true)}
                                >
                                    {/* <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/> */}
                                    <span>Delete</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {deleteCommentModalOpen && (
                <DeleteItemModal
                    text='Are you sure you want to delete your comment?'
                    endpoint='delete-comment'
                    itemId={comment.id}
                    totalItems={totalComments}
                    setTotalItems={setTotalComments}
                    getItems1={getPostComments}
                    setDeleteItemModalOpen={setDeleteCommentModalOpen}
                />
            )}
        </div>
    )
}

export default CommentCardComment
