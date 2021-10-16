import React, { useContext, useEffect, useState } from 'react'
import styles from '@styles/components/PostPageComments.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { PostContext } from '@contexts/PostContext'
// import CommentCard from '../Cards/CommentCard'
import SearchBar from '@components/SearchBar'
import PostPageCommentFilters from '@components/PostPage/PostPageCommentFilters'
import { onPageBottomReached } from '@src/Functions'

const PostPageComments = (): JSX.Element => {
    const {
        isLoggedIn,
        // pageBottomReached,
        setAlertModalOpen,
        setCreateCommentModalOpen,
        setAlertMessage,
    } = useContext(AccountContext)
    const {
        postDataLoading,
        postData,
        postComments,
        getPostComments,
        getNextPostComments,
        postCommentFiltersOpen,
        setPostCommentFiltersOpen,
        postCommentSearchFilter,
        setPostCommentSearchFilter,
        postCommentSortByFilter,
        postCommentSortOrderFilter,
        postCommentTimeRangeFilter,
        postCommentPaginationOffset,
    } = useContext(PostContext)

    const [pageBottomReached, setPageBottomReached] = useState(false)

    function openCreateCommentModal() {
        if (isLoggedIn) {
            setCreateCommentModalOpen(true)
        } else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to add a comment')
        }
    }

    useEffect(() => {
        if (!postDataLoading && postData.id) {
            getPostComments()
        }
    }, [
        postDataLoading,
        postCommentSearchFilter,
        postCommentSortByFilter,
        postCommentSortOrderFilter,
        postCommentTimeRangeFilter,
    ])

    useEffect(() => {
        if (pageBottomReached && !postDataLoading && postData.id) {
            getNextPostComments()
        }
    }, [pageBottomReached])

    useEffect(() => {
        const scrollHandler = () => onPageBottomReached(setPageBottomReached)
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    return (
        <div className={styles.postPageComments}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar
                        setSearchFilter={setPostCommentSearchFilter}
                        placeholder='Search comments...'
                    />
                    <button
                        type='button'
                        className='wecoButton mr-10'
                        onClick={() => setPostCommentFiltersOpen(!postCommentFiltersOpen)}
                    >
                        <img
                            className='wecoButtonIcon'
                            src='/icons/sliders-h-solid.svg'
                            aria-label='filters'
                        />
                    </button>
                    <button
                        type='button'
                        className='wecoButton mr-10'
                        onClick={() => openCreateCommentModal()}
                    >
                        Add Comment
                    </button>
                </div>
                {postCommentFiltersOpen && <PostPageCommentFilters />}
            </div>
            {/* {postComments.length > 0 && (
                <div className={styles.comments}>
                    {postComments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                </div>
            )} */}
            {postComments.length < 1 && postCommentPaginationOffset > 0 && (
                <div className='wecoNoContentPlaceholder'>
                    No comments yet that match those settings...
                </div>
            )}
        </div>
    )
}

export default PostPageComments
