import React, { useContext } from 'react'
import { PostContext } from '../../contexts/PostContext'
import DropDownMenu from '../DropDownMenu'

const PostPageCommentFilters = (): JSX.Element => {
    const {
        postCommentSortByFilter,
        setPostCommentSortByFilter,
        postCommentSortOrderFilter,
        setPostCommentSortOrderFilter,
        postCommentTimeRangeFilter,
        setPostCommentTimeRangeFilter,
    } = useContext(PostContext)

    return (
        <div className='wecoFilters'>
            <DropDownMenu
                title='Sort By'
                options={['Date', 'Likes', 'Replies']}
                selectedOption={postCommentSortByFilter}
                setSelectedOption={setPostCommentSortByFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Sort Order'
                options={['Descending', 'Ascending']}
                selectedOption={postCommentSortOrderFilter}
                setSelectedOption={setPostCommentSortOrderFilter}
                orientation='vertical'
            />
            <DropDownMenu
                title='Time Range'
                options={[
                    'All Time',
                    'Last Year',
                    'Last Month',
                    'Last Week',
                    'Last 24 Hours',
                    'Last Hour',
                ]}
                selectedOption={postCommentTimeRangeFilter}
                setSelectedOption={setPostCommentTimeRangeFilter}
                orientation='vertical'
            />
        </div>
    )
}

export default PostPageCommentFilters
