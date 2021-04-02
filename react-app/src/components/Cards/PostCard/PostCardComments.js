import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardComments.module.scss'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'
import CommentCard from '../../Cards/CommentCard'
import SmallFlagImage from '../../../components/SmallFlagImage'
import { resizeTextArea } from '../../../GlobalFunctions'

const test = "test";
console.log(test)

function PostCardComments(props) {
    const { postId, totalComments, setTotalComments } = props
    const { accountData, isLoggedIn } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)

    const [postComments, setPostComments] = useState([])
    const [postCommentFiltersOpen, setPostCommentFiltersOpen] = useState(false)
    const [postCommentTimeRangeFilter, setPostCommentTimeRangeFilter] = useState('All Time')
    const [postCommentSortByFilter, setPostCommentSortByFilter] = useState('Date')
    const [postCommentSortOrderFilter, setPostCommentSortOrderFilter] = useState('Ascending')
    const [postCommentSearchFilter, setPostCommentSearchFilter] = useState('')
    const [postCommentPaginationLimit, setPostCommentPaginationLimit] = useState(10)
    const [postCommentPaginationOffset, setPostCommentPaginationOffset] = useState(0)
    const [postCommentPaginationHasMore, setPostCommentPaginationHasMore] = useState(true)

    const [newComment, setNewComment] = useState('')
    const [newCommentError, setNewCommentError] = useState(false)

    function getPostComments() {
        setPostCommentPaginationHasMore(true)
        console.log(`PostContext: getPostComments (0 to ${postCommentPaginationLimit})`)
        axios
            .get(config.apiURL + 
                `/post-comments?accountId=${isLoggedIn ? accountData.id : null
                }&postId=${postId
                }&sortBy=${postCommentSortByFilter
                }&sortOrder=${postCommentSortOrderFilter
                }&timeRange=${postCommentTimeRangeFilter
                }&searchQuery=${postCommentSearchFilter
                }&limit=${postCommentPaginationLimit
                }&offset=0`
            )
            .then(res => {
                if (res.data.length < postCommentPaginationLimit) { setPostCommentPaginationHasMore(false) }
                setPostComments(res.data)
                setPostCommentPaginationOffset(postCommentPaginationLimit)
            })
    }
    
    function submitComment(e) {
        e.preventDefault()
        const invalidComment = newComment.length < 1 || newComment.length > 10000
        if (invalidComment) { setNewCommentError(true) }
        else {
            axios
                .post(config.apiURL + '/submit-comment', { 
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    holonId: window.location.pathname.includes('/s/') ? holonData.id : null,
                    postId,
                    text: newComment
                })
                .then(res => {
                    //console.log('res: ', res)
                    if (res.data === 'success') {
                        //getPostData() update reactions
                        setNewComment('')
                        setTimeout(() => { getPostComments() }, 300)
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
            {isLoggedIn &&
                <div className={styles.commentInput}>
                    <SmallFlagImage type='user' size={35} imagePath={accountData.flagImagePath}/>
                    <form className={styles.inputWrapper} onSubmit={submitComment}>
                        <textarea 
                            className={`${styles.input} ${newCommentError && styles.error}`}
                            type="text" rows='1' placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => {
                                setNewComment(e.target.value)
                                setNewCommentError(false)
                                resizeTextArea(e.target)
                            }}
                        />
                        <button className={styles.button}>Comment</button>
                    </form>
                </div>
            }
            {postComments.length > 0 &&
                <div className={styles.comments}>
                    {postComments.map((comment, index) => 
                        <CommentCard
                            key={index}
                            comment={comment}
                            totalComments={totalComments}
                            setTotalComments={setTotalComments}
                            getPostComments={getPostComments}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default PostCardComments
