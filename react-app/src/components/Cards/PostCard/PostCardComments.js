import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardComments.module.scss'
import { AccountContext } from '../../../contexts/AccountContext'
import CommentCard from '../../Cards/CommentCard'
import NewCommentCard from '../../Cards/NewCommentCard'

function PostCardComments(props) {
    const { postId } = props
    const { accountData, isLoggedIn } = useContext(AccountContext)

    const [postComments, setPostComments] = useState([])
    const [postCommentFiltersOpen, setPostCommentFiltersOpen] = useState(false)
    const [postCommentTimeRangeFilter, setPostCommentTimeRangeFilter] = useState('All Time')
    const [postCommentSortByFilter, setPostCommentSortByFilter] = useState('Likes')
    const [postCommentSortOrderFilter, setPostCommentSortOrderFilter] = useState('Descending')
    const [postCommentSearchFilter, setPostCommentSearchFilter] = useState('')
    const [postCommentPaginationLimit, setPostCommentPaginationLimit] = useState(10)
    const [postCommentPaginationOffset, setPostCommentPaginationOffset] = useState(0)
    const [postCommentPaginationHasMore, setPostCommentPaginationHasMore] = useState(true)

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
                console.log('postComments: ', postComments)
                setPostCommentPaginationOffset(postCommentPaginationLimit)
            })
    }

    useEffect(() => {
        getPostComments()
    }, [])

    return (
        <div className={styles.wrapper}>
            {postComments.length > 0 &&
                <div className={styles.comments}>
                    {postComments.map((comment, index) => 
                        <NewCommentCard
                            key={index}
                            index={index}
                            comment={comment}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default PostCardComments
