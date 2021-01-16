import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardComments.module.scss'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'
import CommentCard from '../../Cards/CommentCard'
import NewCommentCard from '../../Cards/NewCommentCard'
import SmallFlagImage from '../../../components/SmallFlagImage'

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
        console.log('add comment: ', newComment)
        const invalid = newComment.length < 1 || newComment.length > 10000
        if (invalid) { setNewCommentError(true) }
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
                        getPostComments()
                    }
                })
                //.then(setTimeout(() => { getPostData(); getPostComments() }, 200))
        }
    }

    function resizeTextArea(target) {
        target.style.height = ''
        target.style.height = target.scrollHeight + 'px'
    }

    useEffect(() => {
        getPostComments()
    }, [])

    useEffect(() => {
        console.log('postComments: ', postComments)
    }, [postComments])

    return (
        <div className={styles.wrapper}>
            {/* TODO: create comment input component */}
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
            {postComments.map((comment, index) => 
                <NewCommentCard
                    key={index}
                    comment={comment}
                    totalComments={totalComments}
                    setTotalComments={setTotalComments}
                    getPostComments={getPostComments}
                />
            )}
        </div>
    )
}

export default PostCardComments
