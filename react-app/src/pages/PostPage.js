import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/pages/PostPage.module.scss'
import Post from '../components/Post'
import PageSectionSelector from '../components/PageSectionSelector'
import PostPageCommentSection from '../components/PostPageCommentSection'
import PostPagePollVoteSection from '../components/PostPagePollVoteSection'
import PostPagePollResultsSection from '../components/PostPagePollResultsSection'

function PostPage({ match }) {
    const postId = match.params.postId
    //console.log('postId: ', postId)
    const [post, setPost] = useState({
        Holons: [],
        // Labels: [],
        Comments: [],
        PollAnswers: []
    })
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [postPageLoading, setPostPageLoading] = useState(true)
    const [pageSection, setPageSection] = useState('comments')
    const [selectedPollAnswers, setSelectedPollAnswers] = useState([])
    // const [totalPollAnswers, setTotalPollAnswers] = useState(0)
    const [totalPollVotes, setTotalPollVotes] = useState(0)

    const pollAnswersSortedByScore = post.PollAnswers.map((a)=>a).sort((a, b) => b.total_votes - a.total_votes) 
    const pollAnswersSortedById = post.PollAnswers.map((a)=>a).sort((a, b) => a.id - b.id)
    // TODO: is there a better way to achieve .map((a)=>a) here?

    function getPost() {
        axios.get(config.environmentURL + `/post?id=${postId}`).then(res => { 
            setPost(res.data)
            setPostPageLoading(false)
        })
    }

    function submitComment(e) {
        e.preventDefault()
        if (newComment === '') { setCommentError(true) }
        if (newComment !== '') {
            axios.post(config.environmentURL + '/addComment', { text: newComment, postId })
                .then(setNewComment(''))
                .then(setTimeout(() => { getPost() }, 100))
        }
    }

    function castVote() {
        if (selectedPollAnswers.length !== 0) {
            let voteData = { selectedPollAnswers }
            axios.post(config.environmentURL + '/castVote', { voteData })
                .then(setSelectedPollAnswers([]))
                .then(setTimeout(() => { getPost() }, 100))
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    useEffect(() => {
        // setTotalPollAnswers(post.PollAnswers.length)
        const totalVotesOnAnswer = post.PollAnswers.map((answer) => { return answer.total_votes })
        const totalVotes = totalVotesOnAnswer.reduce((a, b) => a + b, 0)
        setTotalPollVotes(totalVotes)
    }, [post])

    return (
        <div className={styles.postPage}>
            <Post 
                post={post}
                postPageLoading={postPageLoading}
                isPostPage={true}
            />

            {post.type === 'poll' &&
                <PageSectionSelector setPageSection={setPageSection}/>
            }

            {pageSection === 'comments' &&
                <PostPageCommentSection
                    submitComment={submitComment}
                    commentError={commentError}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    setCommentError={setCommentError}
                    post={post}
                />
            }

            {pageSection === 'poll-vote' &&
                <PostPagePollVoteSection
                    castVote={castVote}
                    pollAnswersSortedById={pollAnswersSortedById}
                    selectedPollAnswers={selectedPollAnswers}
                    setSelectedPollAnswers={setSelectedPollAnswers}
                />
            }

            {pageSection === 'poll-results' &&
                <PostPagePollResultsSection
                    pollAnswers={post.PollAnswers}
                    pollAnswersSortedByScore={pollAnswersSortedByScore}
                    totalPollVotes={totalPollVotes}
                />
            }

        </div>
    )
}

export default PostPage