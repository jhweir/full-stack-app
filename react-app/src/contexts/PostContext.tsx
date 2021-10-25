import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { IPostContext, IPost } from '@src/Interfaces'

export const PostContext = createContext<IPostContext>({} as IPostContext)

const defaults = {
    postData: {
        id: null,
        type: '',
        subType: null,
        state: '',
        text: '',
        url: null,
        urlImage: null,
        urlDomain: null,
        urlTitle: null,
        urlDescription: null,
        createdAt: '',
        // todo: change account_ values to booleans
        account_like: 0,
        account_link: 0,
        account_rating: 0,
        account_repost: 0,
        total_comments: 0,
        total_likes: 0,
        total_links: 0,
        total_rating_points: 0,
        total_ratings: 0,
        total_reactions: 0,
        total_reposts: 0,
        creator: {
            id: null,
            handle: '',
            name: '',
            flagImagePath: '',
        },
        DirectSpaces: [],
        IndirectSpaces: [],
        PollAnswers: [],
    },
}

const PostContextProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const { accountData } = useContext(AccountContext)

    const [selectedSubPage, setSelectedSubPage] = useState('')
    const [postData, setPostData] = useState(defaults.postData)
    const [postDataLoading, setPostDataLoading] = useState(true)

    function getPostData(postId) {
        console.log('PostContext: getPostData')
        setPostDataLoading(true)
        axios
            .get(`${config.apiURL}/post-data?accountId=${accountData.id}&postId=${postId}`)
            .then((res) => {
                if (res.data) setPostData(res.data)
                setPostDataLoading(false)
            })
            .catch((error) => console.log('GET post-data error: ', error))
    }

    function resetPostContext() {
        console.log('PostContext: resetPostContext')
        setPostData(defaults.postData)
    }

    return (
        <PostContext.Provider
            value={{
                selectedSubPage,
                setSelectedSubPage,
                postData,
                postDataLoading,
                // functions
                getPostData,
                resetPostContext,
            }}
        >
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider

// // to be moved...

// const [selectedPollAnswers, setSelectedPollAnswers] = useState<IPollAnswer[]>([])
// const [voteCast, setVoteCast] = useState(false)

// // TODO: move to PostPagePollVote, set up infinite scroll for poll answers in 'vote' and 'results' sections
// function castVote() {
//     if (validVote) {
//         const voteData = { postId, pollType: postData.subType, selectedPollAnswers }
//         console.log('voteData: ', voteData)
//         axios
//             .post(`${config.apiURL}/cast-vote`, { voteData })
//             .then(() => setSelectedPollAnswers([]))
//             .then(() => setVoteCast(true))
//     }
// }

// const totalUsedPoints = selectedPollAnswers
// .map((answer) => answer.value)
// .reduce((a, b) => a + b, 0)
// const validVote =
// selectedPollAnswers.length !== 0 &&
// (postData.subType !== 'weighted-choice' || Number(totalUsedPoints) === 100)
// const colorScale = d3
// .scaleSequential()
// .domain([0, postData.PollAnswers && postData.PollAnswers.length])
// .interpolator(d3.interpolateViridis)

// const pollAnswersSortedById =
// postData.PollAnswers && postData.PollAnswers.map((a) => a).sort((a, b) => a.id - b.id)
// let pollAnswersSortedByScore =
// postData.PollAnswers &&
// postData.PollAnswers.map((a) => a).sort((a, b) => b.total_votes - a.total_votes)
// let totalPollVotes =
// postData.PollAnswers &&
// postData.PollAnswers.map((answer) => {
//     return answer.total_votes
// }).reduce((a, b) => a + b, 0)

// if (postData.subType === 'weighted-choice') {
// totalPollVotes =
//     postData.PollAnswers &&
//     postData.PollAnswers.map((answer) => {
//         return answer.total_score
//     }).reduce((a, b) => a + b, 0)
// pollAnswersSortedByScore =
//     postData.PollAnswers &&
//     postData.PollAnswers.map((a) => a).sort((a, b) => b.total_score - a.total_score)
// }

// function getPostComments() {
//     setPostCommentPaginationHasMore(true)
//     console.log(`PostContext: getPostComments (0 to ${postCommentPaginationLimit})`)
//     axios
//         .get(
//             // prettier-ignore
//             `${config.apiURL}/post-comments?accountId=${accountData.id
//             }&postId=${postId
//             }&sortBy=${postCommentSortByFilter
//             }&sortOrder=${postCommentSortOrderFilter
//             }&timeRange=${postCommentTimeRangeFilter
//             }&searchQuery=${postCommentSearchFilter
//             }&limit=${postCommentPaginationLimit
//             }&offset=0`
//         )
//         .then((res) => {
//             if (res.data.length < postCommentPaginationLimit)
//                 setPostCommentPaginationHasMore(false)
//             setPostComments(res.data)
//             setPostCommentPaginationOffset(postCommentPaginationLimit)
//         })
//         .catch((error) => console.log('GET post-comments error: ', error))
// }

// function getNextPostComments() {
//     if (postCommentPaginationHasMore) {
//         console.log(
//             `PostContext: getNextPostComments (${postCommentPaginationOffset} to ${
//                 postCommentPaginationOffset + postCommentPaginationLimit
//             })`
//         )
//         axios
//             .get(
//                 // prettier-ignore
//                 `${config.apiURL}/post-comments?accountId=${loggedIn ? accountData.id : null
//                 }&postId=${postId
//                 }&sortBy=${postCommentSortByFilter
//                 }&sortOrder=${postCommentSortOrderFilter
//                 }&timeRange=${postCommentTimeRangeFilter
//                 }&searchQuery=${postCommentSearchFilter
//                 }&limit=${postCommentPaginationLimit
//                 }&offset=${postCommentPaginationOffset}`
//             )
//             .then((res) => {
//                 if (res.data.length < postCommentPaginationLimit)
//                     setPostCommentPaginationHasMore(false)
//                 setPostComments([...postComments, ...res.data])
//                 setPostCommentPaginationOffset(
//                     postCommentPaginationOffset + postCommentPaginationLimit
//                 )
//             })
//     }
// }

// const [postComments, setPostComments] = useState<IComment[]>([])
// const [postCommentFiltersOpen, setPostCommentFiltersOpen] = useState(false)
// const [postCommentTimeRangeFilter, setPostCommentTimeRangeFilter] = useState('All Time')
// const [postCommentSortByFilter, setPostCommentSortByFilter] = useState('Likes')
// const [postCommentSortOrderFilter, setPostCommentSortOrderFilter] = useState('Descending')
// const [postCommentSearchFilter, setPostCommentSearchFilter] = useState('')
// const [postCommentPaginationLimit, setPostCommentPaginationLimit] = useState(10)
// const [postCommentPaginationOffset, setPostCommentPaginationOffset] = useState(0)
// const [postCommentPaginationHasMore, setPostCommentPaginationHasMore] = useState(true)
