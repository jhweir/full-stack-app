import React, { useContext, useEffect } from 'react'
import styles from '../../styles/components/PostPageComments.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import CommentCard from '../Cards/CommentCard'
import SearchBar from '../SearchBar'
import PostPageCommentFilters from './PostPageCommentFilters'

function PostPageComments() {
    const { isLoggedIn, pageBottomReached, setAlertModalOpen, setCreateCommentModalOpen, setAlertMessage } = useContext(AccountContext)
    const {
        postContextLoading,
        postData,
        postComments, getPostComments, getNextPostComments,
        postCommentFiltersOpen, setPostCommentFiltersOpen,
        postCommentSearchFilter, setPostCommentSearchFilter,
        postCommentSortByFilter,
        postCommentSortOrderFilter,
        postCommentTimeRangeFilter
    } = useContext(PostContext)

    function openCreateCommentModal() {
        if (isLoggedIn) { setCreateCommentModalOpen(true) }
        else { setAlertModalOpen(true); setAlertMessage('Log in to add a comment') }
    }

    useEffect(() => {
        if (!postContextLoading && postData.id) { getPostComments() }
    },[
        postContextLoading,
        postCommentSearchFilter,
        postCommentSortByFilter,
        postCommentSortOrderFilter,
        postCommentTimeRangeFilter
    ])

    useEffect(() => {
        if (pageBottomReached && !postContextLoading && postData.id) { getNextPostComments() }
    }, [pageBottomReached])

    return (
        <div className={styles.postPageComments}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar setSearchFilter={setPostCommentSearchFilter} placeholder='Search comments...'/>
                    <button className='wecoButton mr-10' onClick={() => setPostCommentFiltersOpen(!postCommentFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                    <button className='wecoButton mr-10' onClick={() => openCreateCommentModal()}>
                        Add Comment
                    </button>
                </div>
                {postCommentFiltersOpen && <PostPageCommentFilters/>}
            </div>
            <div className={styles.comments}>
                {postComments.map((comment, index) => 
                    <CommentCard
                        key={index}
                        comment={comment}
                    /> 
                )}
            </div>
        </div>
    )
}

export default PostPageComments