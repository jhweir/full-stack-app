import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import config from '../Config'
import { AccountContext } from './AccountContext'
import { IPostContext, IPost, IPollAnswer, IComment } from '../Interfaces'

export const PostContext = createContext<IPostContext>({
    postContextLoading: true,
    postId: undefined,
    postData: {},
    selectedSubPage: '',
    selectedPollAnswers: [],
    voteCast: false,
    postComments: [],
    postCommentFiltersOpen: false,
    postCommentTimeRangeFilter: '',
    postCommentSortByFilter: '',
    postCommentSortOrderFilter: '',
    postCommentSearchFilter: '',
    postCommentPaginationLimit: 0,
    postCommentPaginationOffset: 0,
    postCommentPaginationHasMore: false,
    totalUsedPoints: 0,
    validVote: true,
    colorScale: undefined,
    setPostContextLoading: () => null,
    setPostId: () => null,
    setPostData: () => null,
    setSelectedSubPage: () => null,
    setSelectedPollAnswers: () => null,
    setVoteCast: () => null,
    setPostComments: () => null,
    setPostCommentFiltersOpen: () => null,
    setPostCommentTimeRangeFilter: () => null,
    setPostCommentSortByFilter: () => null,
    setPostCommentSortOrderFilter: () => null,
    setPostCommentSearchFilter: () => null,
    setPostCommentPaginationLimit: () => null,
    setPostCommentPaginationOffset: () => null,
    setPostCommentPaginationHasMore: () => null,
    getPostData: () => null,
    getPostComments: () => null,
    getNextPostComments: () => null,
    castVote: () => null,
})

const PostContextProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const { accountContextLoading, accountData, isLoggedIn } = useContext(AccountContext)
    const [postContextLoading, setPostContextLoading] = useState(true)
    const [postId, setPostId] = useState<number>()
    const [postData, setPostData] = useState<Partial<IPost>>({ spaces: [], PollAnswers: [] })
    const [selectedSubPage, setSelectedSubPage] = useState('')
    const [selectedPollAnswers, setSelectedPollAnswers] = useState<IPollAnswer[]>([])

    // to be moved...
    const [voteCast, setVoteCast] = useState(false)

    const [postComments, setPostComments] = useState<IComment[]>([])
    const [postCommentFiltersOpen, setPostCommentFiltersOpen] = useState(false)
    const [postCommentTimeRangeFilter, setPostCommentTimeRangeFilter] = useState('All Time')
    const [postCommentSortByFilter, setPostCommentSortByFilter] = useState('Likes')
    const [postCommentSortOrderFilter, setPostCommentSortOrderFilter] = useState('Descending')
    const [postCommentSearchFilter, setPostCommentSearchFilter] = useState('')
    const [postCommentPaginationLimit, setPostCommentPaginationLimit] = useState(10)
    const [postCommentPaginationOffset, setPostCommentPaginationOffset] = useState(0)
    const [postCommentPaginationHasMore, setPostCommentPaginationHasMore] = useState(true)

    const totalUsedPoints = selectedPollAnswers
        .map((answer) => answer.value)
        .reduce((a, b) => a + b, 0)
    const validVote =
        selectedPollAnswers.length !== 0 &&
        (postData.subType !== 'weighted-choice' || Number(totalUsedPoints) === 100)
    const colorScale = d3
        .scaleSequential()
        .domain([0, postData.PollAnswers && postData.PollAnswers.length])
        .interpolator(d3.interpolateViridis)

    const pollAnswersSortedById =
        postData.PollAnswers && postData.PollAnswers.map((a) => a).sort((a, b) => a.id - b.id)
    let pollAnswersSortedByScore =
        postData.PollAnswers &&
        postData.PollAnswers.map((a) => a).sort((a, b) => b.total_votes - a.total_votes)
    let totalPollVotes =
        postData.PollAnswers &&
        postData.PollAnswers.map((answer) => {
            return answer.total_votes
        }).reduce((a, b) => a + b, 0)

    if (postData.subType === 'weighted-choice') {
        totalPollVotes =
            postData.PollAnswers &&
            postData.PollAnswers.map((answer) => {
                return answer.total_score
            }).reduce((a, b) => a + b, 0)
        pollAnswersSortedByScore =
            postData.PollAnswers &&
            postData.PollAnswers.map((a) => a).sort((a, b) => b.total_score - a.total_score)
    }

    function getPostData() {
        console.log('PostContext: getPostData')
        setPostContextLoading(true)
        axios
            .get(
                // prettier-ignore
                `${config.apiURL}/post-data?accountId=${isLoggedIn ? accountData.id : null
                }&postId=${postId}`
            )
            .then((res) => {
                setPostData(res.data)
                setPostContextLoading(false)
            })
    }

    function getPostComments() {
        setPostCommentPaginationHasMore(true)
        console.log(`PostContext: getPostComments (0 to ${postCommentPaginationLimit})`)
        axios
            .get(
                // prettier-ignore
                `${config.apiURL}/post-comments?accountId=${isLoggedIn ? accountData.id : null
                }&postId=${postId
                }&sortBy=${postCommentSortByFilter
                }&sortOrder=${postCommentSortOrderFilter
                }&timeRange=${postCommentTimeRangeFilter
                }&searchQuery=${postCommentSearchFilter
                }&limit=${postCommentPaginationLimit
                }&offset=0`
            )
            .then((res) => {
                if (res.data.length < postCommentPaginationLimit)
                    setPostCommentPaginationHasMore(false)
                setPostComments(res.data)
                setPostCommentPaginationOffset(postCommentPaginationLimit)
            })
    }

    function getNextPostComments() {
        if (postCommentPaginationHasMore) {
            console.log(
                `PostContext: getNextPostComments (${postCommentPaginationOffset} to ${
                    postCommentPaginationOffset + postCommentPaginationLimit
                })`
            )
            axios
                .get(
                    // prettier-ignore
                    `${config.apiURL}/post-comments?accountId=${isLoggedIn ? accountData.id : null
                    }&postId=${postId
                    }&sortBy=${postCommentSortByFilter
                    }&sortOrder=${postCommentSortOrderFilter
                    }&timeRange=${postCommentTimeRangeFilter
                    }&searchQuery=${postCommentSearchFilter
                    }&limit=${postCommentPaginationLimit
                    }&offset=${postCommentPaginationOffset}`
                )
                .then((res) => {
                    if (res.data.length < postCommentPaginationLimit)
                        setPostCommentPaginationHasMore(false)
                    setPostComments([...postComments, ...res.data])
                    setPostCommentPaginationOffset(
                        postCommentPaginationOffset + postCommentPaginationLimit
                    )
                })
        }
    }

    // TODO: move to PostPagePollVote, set up infinite scroll for poll answers in 'vote' and 'results' sections
    function castVote() {
        if (validVote) {
            const voteData = { postId, pollType: postData.subType, selectedPollAnswers }
            console.log('voteData: ', voteData)
            axios
                .post(`${config.apiURL}/cast-vote`, { voteData })
                .then(() => setSelectedPollAnswers([]))
                .then(() => setVoteCast(true))
        }
    }

    useEffect(() => {
        if (postId && !accountContextLoading) {
            getPostData()
        }
    }, [postId, accountData.id])

    return (
        <PostContext.Provider
            value={{
                postContextLoading,
                postId,
                postData,
                selectedSubPage,
                selectedPollAnswers,
                voteCast,
                postComments,
                postCommentFiltersOpen,
                postCommentTimeRangeFilter,
                postCommentSortByFilter,
                postCommentSortOrderFilter,
                postCommentSearchFilter,
                postCommentPaginationLimit,
                postCommentPaginationOffset,
                postCommentPaginationHasMore,
                pollAnswersSortedById,
                pollAnswersSortedByScore,
                totalPollVotes,
                totalUsedPoints,
                validVote,
                colorScale,
                setPostContextLoading,
                setPostId,
                setPostData,
                setSelectedSubPage,
                setSelectedPollAnswers,
                setVoteCast,
                setPostComments,
                setPostCommentFiltersOpen,
                setPostCommentTimeRangeFilter,
                setPostCommentSortByFilter,
                setPostCommentSortOrderFilter,
                setPostCommentSearchFilter,
                setPostCommentPaginationLimit,
                setPostCommentPaginationOffset,
                setPostCommentPaginationHasMore,
                getPostData,
                getPostComments,
                getNextPostComments,
                castVote,
            }}
        >
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider
