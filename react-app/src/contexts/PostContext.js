import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import * as d3 from 'd3'
import { AccountContext } from './AccountContext'

export const PostContext = createContext()

function PostContextProvider({ children }) {
    const { accountContextLoading, accountData, isLoggedIn, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)
    const [postContextLoading, setPostContextLoading] = useState(true)
    const [postId, setPostId] = useState('')
    const [post, setPost] = useState({ spaces: [], Comments: [], PollAnswers: [] })
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [postPageLoading, setPostPageLoading] = useState(true)
    const [selectedPollAnswers, setSelectedPollAnswers] = useState([])
    const [voteCast, setVoteCast] = useState(false)

    const pollAnswersSortedById = post.PollAnswers.map((a)=>a).sort((a, b) => a.id - b.id)
    let pollAnswersSortedByScore = post.PollAnswers.map((a)=>a).sort((a, b) => b.total_votes - a.total_votes) 
    let totalPollVotes = post.PollAnswers.map((answer) => { return answer.total_votes }).reduce((a, b) => a + b, 0)

    if (post.subType === 'weighted-choice') { 
        totalPollVotes = post.PollAnswers.map((answer) => { return answer.total_score }).reduce((a, b) => a + b, 0)
        pollAnswersSortedByScore = post.PollAnswers.map((a)=>a).sort((a, b) => b.total_score - a.total_score) 
    }

    //console.log('totalPollVotes', totalPollVotes)
    const totalUsedPoints = selectedPollAnswers.map((answer) => { return answer.value }).reduce((a, b) => a + b, 0)
    const validVote = selectedPollAnswers.length !== 0 && (post.subType !== 'weighted-choice' || totalUsedPoints == 100)

    const colorScale = d3
        .scaleSequential()
        .domain([0, post.PollAnswers.length])
        .interpolator(d3.interpolateViridis)

    function getPostData() {
        console.log('PostContext: getPostData')
        setPostContextLoading(true)
        axios.get(config.environmentURL + `/post?accountId=${isLoggedIn ? accountData.id : null}&postId=${postId}`)
            .then(res => {
                setPost(res.data)
                setPostPageLoading(false)
            })
    }

    function submitComment(e) {
        e.preventDefault()
        if (newComment === '') { setCommentError(true) }
        if (newComment !== '' && !isLoggedIn) { setAlertMessage('Log in to comment'); setAlertModalOpen(true) }
        if (newComment !== '' && isLoggedIn) {
            axios.post(config.environmentURL + '/add-comment', { creatorId: accountData.id, postId, text: newComment })
                .then(setNewComment(''))
                .then(setTimeout(() => { getPostData() }, 200))
        }
    }

    function castVote() {
        if (validVote) {
            let voteData = { postId, pollType: post.subType, selectedPollAnswers }
            console.log('voteData', voteData)
            axios.post(config.environmentURL + '/cast-vote', { voteData })
                .then(setSelectedPollAnswers([]))
                .then(setVoteCast(true))
                .then(setTimeout(() => { getPostData() }, 200))
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
            post, setPost,
            newComment, setNewComment,
            commentError, setCommentError,
            postPageLoading, setPostPageLoading,
            selectedPollAnswers, setSelectedPollAnswers,
            voteCast, setVoteCast,
            colorScale,
            pollAnswersSortedById,
            pollAnswersSortedByScore,
            totalPollVotes,
            totalUsedPoints,
            validVote,

            // functions
            getPostData,
            submitComment,
            castVote
        }}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider
