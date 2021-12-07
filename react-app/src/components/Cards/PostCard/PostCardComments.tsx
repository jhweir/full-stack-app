import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardComments.module.scss'
import { AccountContext } from '../../../contexts/AccountContext'
import { SpaceContext } from '../../../contexts/SpaceContext'
import CommentCard from '../CommentCard'
import FlagImage from '@components/FlagImage'
import { resizeTextArea } from '../../../Functions'

const PostCardComments = (props: {
    postId: number | undefined
    totalComments: number | undefined
    setTotalComments: (payload: number) => void
}): JSX.Element => {
    const { postId, totalComments, setTotalComments } = props
    const { accountData, loggedIn } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)

    const [postComments, setPostComments] = useState([])
    // const [postCommentFiltersOpen, setPostCommentFiltersOpen] = useState(false)
    const [postCommentTimeRangeFilter, setPostCommentTimeRangeFilter] = useState('All Time')
    const [postCommentSortByFilter, setPostCommentSortByFilter] = useState('Date')
    const [postCommentSortOrderFilter, setPostCommentSortOrderFilter] = useState('Ascending')
    const [postCommentSearchFilter, setPostCommentSearchFilter] = useState('')
    const [postCommentPaginationLimit, setPostCommentPaginationLimit] = useState(10)
    // const [postCommentPaginationOffset, setPostCommentPaginationOffset] = useState(0)
    // const [postCommentPaginationHasMore, setPostCommentPaginationHasMore] = useState(true)

    const [newComment, setNewComment] = useState('')
    const [newCommentError, setNewCommentError] = useState(false)

    function getPostComments() {
        // setPostCommentPaginationHasMore(true)
        console.log(`PostContext: getPostComments (0 to ${postCommentPaginationLimit})`)
        axios
            .get(
                `${config.apiURL}/post-comments?accountId=${
                    loggedIn ? accountData.id : null
                }&postId=${postId}&sortBy=${postCommentSortByFilter}&sortOrder=${postCommentSortOrderFilter}&timeRange=${postCommentTimeRangeFilter}&searchQuery=${postCommentSearchFilter}&limit=${postCommentPaginationLimit}&offset=0`
            )
            .then((res) => {
                if (res.data.length < postCommentPaginationLimit) {
                    // setPostCommentPaginationHasMore(false)
                }
                setPostComments(res.data)
                // setPostCommentPaginationOffset(postCommentPaginationLimit)
            })
    }

    function submitComment(e) {
        e.preventDefault()
        const invalidComment = newComment.length < 1 || newComment.length > 10000
        if (invalidComment) {
            setNewCommentError(true)
        } else {
            axios
                .post(`${config.apiURL}/submit-comment`, {
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    postId,
                    text: newComment,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setNewComment('')
                        setTimeout(() => {
                            getPostComments()
                        }, 300)
                    }
                })
        }
    }

    useEffect(() => {
        getPostComments()
    }, [])

    return (
        <div className={styles.wrapper}>
            {/* TODO: create comment input component */}
            {loggedIn && (
                <div className={styles.commentInput}>
                    <FlagImage type='user' size={35} imagePath={accountData.flagImagePath} />
                    <form className={styles.inputWrapper} onSubmit={submitComment}>
                        <textarea
                            className={`${styles.input} ${newCommentError && styles.error}`}
                            rows={1}
                            placeholder='Write a comment...'
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value)
                                setNewCommentError(false)
                                resizeTextArea(e.target)
                            }}
                        />
                        <button className={styles.button} type='submit'>
                            Comment
                        </button>
                    </form>
                </div>
            )}
            {postComments.length > 0 && (
                <div className={styles.comments}>
                    {postComments.map((comment) => (
                        // todo: change uuid to comment.id when interface set up
                        <CommentCard
                            key={uuidv4()}
                            comment={comment}
                            totalComments={totalComments}
                            setTotalComments={setTotalComments}
                            getPostComments={getPostComments}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default PostCardComments
