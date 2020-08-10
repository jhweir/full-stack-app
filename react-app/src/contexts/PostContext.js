import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import * as d3 from 'd3'
import { AccountContext } from './AccountContext'

export const PostContext = createContext()

function PostContextProvider({ children }) {
    const { accountContextLoading, accountData, isLoggedIn } = useContext(AccountContext)
    const [postContextLoading, setPostContextLoading] = useState(true)
    const [postId, setPostId] = useState('')
    const [postData, setPostData] = useState({ spaces: [], PollAnswers: [] })
    const [selectedSubPage, setSelectedSubPage] = useState('')
    const [selectedPollAnswers, setSelectedPollAnswers] = useState([])

    // to be moved... 
    const [voteCast, setVoteCast] = useState(false)

    const [postComments, setPostComments] = useState([])
    const [postCommentFiltersOpen, setPostCommentFiltersOpen] = useState(false)
    const [postCommentTimeRangeFilter, setPostCommentTimeRangeFilter] = useState('All Time')
    const [postCommentSortByFilter, setPostCommentSortByFilter] = useState('Likes')
    const [postCommentSortOrderFilter, setPostCommentSortOrderFilter] = useState('Descending')
    const [postCommentSearchFilter, setPostCommentSearchFilter] = useState('')
    const [postCommentPaginationLimit, setPostCommentPaginationLimit] = useState(10)
    const [postCommentPaginationOffset, setPostCommentPaginationOffset] = useState(0)
    const [postCommentPaginationHasMore, setPostCommentPaginationHasMore] = useState(true)

    const validVote = selectedPollAnswers.length !== 0 && (postData.subType !== 'weighted-choice' || totalUsedPoints == 100)
    const colorScale = d3.scaleSequential().domain([0, postData.PollAnswers.length]).interpolator(d3.interpolateViridis)
    const totalUsedPoints = selectedPollAnswers.map((answer) => { return answer.value }).reduce((a, b) => a + b, 0)
    const pollAnswersSortedById = postData.PollAnswers.map((a)=>a).sort((a, b) => a.id - b.id)
    let pollAnswersSortedByScore = postData.PollAnswers.map((a)=>a).sort((a, b) => b.total_votes - a.total_votes) 
    let totalPollVotes = postData.PollAnswers.map((answer) => { return answer.total_votes }).reduce((a, b) => a + b, 0)

    if (postData.subType === 'weighted-choice') { 
        totalPollVotes = postData.PollAnswers.map((answer) => { return answer.total_score }).reduce((a, b) => a + b, 0)
        pollAnswersSortedByScore = postData.PollAnswers.map((a)=>a).sort((a, b) => b.total_score - a.total_score) 
    }

    function getPostData() {
        console.log('PostContext: getPostData')
        setPostContextLoading(true)
        axios.get(config.environmentURL + `/post-data?accountId=${isLoggedIn ? accountData.id : null}&postId=${postId}`)
            .then(res => {
                setPostData(res.data)
                setPostContextLoading(false)
            })
    }

    function getPostComments() {
        setPostCommentPaginationHasMore(true)
        console.log(`PostContext: getPostComments (0 to ${postCommentPaginationLimit})`)
        axios.get(config.environmentURL + 
            `/post-comments?accountId=${isLoggedIn ? accountData.id : null
            }&postId=${postId
            }&sortBy=${postCommentSortByFilter
            }&sortOrder=${postCommentSortOrderFilter
            }&timeRange=${postCommentTimeRangeFilter
            }&searchQuery=${postCommentSearchFilter
            }&limit=${postCommentPaginationLimit
            }&offset=0`)
            .then(res => {
                if (res.data.length < postCommentPaginationLimit) { setPostCommentPaginationHasMore(false) }
                setPostComments(res.data)
                setPostCommentPaginationOffset(postCommentPaginationLimit)
            })
    }

    function getNextPostComments() {
        if (postCommentPaginationHasMore) {
            console.log(`PostContext: getNextPostComments (${postCommentPaginationOffset} to ${postCommentPaginationOffset + postCommentPaginationLimit})`)
            axios.get(config.environmentURL + 
                `/post-comments?accountId=${isLoggedIn ? accountData.id : null
                }&postId=${postId
                }&sortBy=${postCommentSortByFilter
                }&sortOrder=${postCommentSortOrderFilter
                }&timeRange=${postCommentTimeRangeFilter
                }&searchQuery=${postCommentSearchFilter
                }&limit=${postCommentPaginationLimit
                }&offset=${postCommentPaginationOffset}`)
                .then(res => { 
                    if (res.data.length < postCommentPaginationLimit) { setPostCommentPaginationHasMore(false) }
                    setPostComments([...postComments, ...res.data])
                    setPostCommentPaginationOffset(postCommentPaginationOffset + postCommentPaginationLimit)
                })
        }
    }

    // TODO: move to PostPagePollVote, set up infinite scroll for poll answers in 'vote' and 'results' sections
    function castVote() {
        if (validVote) {
            let voteData = { postId, pollType: postData.subType, selectedPollAnswers }
            console.log('voteData: ', voteData)
            axios.post(config.environmentURL + '/cast-vote', { voteData })
                .then(setSelectedPollAnswers([]))
                .then(setVoteCast(true))
        }
    }

    useEffect(() => {
        if (!accountContextLoading) { getPostData() }
    }, [postId, accountData])

    return (
        <PostContext.Provider value={{
            // state
            postContextLoading, setPostContextLoading,
            postId, setPostId,
            postData, setPostData,
            selectedSubPage, setSelectedSubPage,
            selectedPollAnswers, setSelectedPollAnswers,

            voteCast, setVoteCast,

            postComments, setPostComments,
            postCommentFiltersOpen, setPostCommentFiltersOpen,
            postCommentTimeRangeFilter, setPostCommentTimeRangeFilter,
            postCommentSortByFilter, setPostCommentSortByFilter,
            postCommentSortOrderFilter, setPostCommentSortOrderFilter,
            postCommentSearchFilter, setPostCommentSearchFilter,
            postCommentPaginationLimit, setPostCommentPaginationLimit,
            postCommentPaginationOffset, setPostCommentPaginationOffset,
            postCommentPaginationHasMore, setPostCommentPaginationHasMore,

            pollAnswersSortedById,
            pollAnswersSortedByScore,
            totalPollVotes,
            totalUsedPoints,
            validVote,
            colorScale,

            // functions
            getPostData,
            getPostComments,
            getNextPostComments,
            castVote
        }}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider
