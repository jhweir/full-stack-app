import React, { useState, useEffect, useContext } from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import queryString from 'query-string'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/pages/PostPage.module.scss'
import { AccountContext } from '../contexts/AccountContext'
import EmptyPage from '../pages/EmptyPage'
import PostCard from '../components/Cards/PostCard'
import PageSectionSelector from '../components/PageSectionSelector'
import PostPageComments from '../components/PostPage/PostPageComments'
import PostPagePollVote from '../components/PostPage/PostPagePollVote'
import PostPagePollResults from '../components/PostPage/PostPagePollResults'

function PostPage(props) {
    const postId = props.match.params.postId
    const pageUrl = props.match.url
    const parsedQuery = queryString.parse(props.location.search)

    const { accountContextLoading, isLoggedIn, accountData, setAlertModalOpen, setAlertMessage } = useContext(AccountContext)

    const [post, setPost] = useState({
        spaces: [],
        Comments: [],
        PollAnswers: []
    })
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

    function getPost() {
        setPostPageLoading(true)
        axios.get(config.environmentURL + `/post?id=${postId}&userId=${isLoggedIn ? accountData.id : null}`)
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
                .then(setTimeout(() => { getPost() }, 200))
        }
    }

    function castVote() {
        if (validVote) {
            let voteData = { postId, pollType: post.subType, selectedPollAnswers }
            console.log('voteData', voteData)
            axios.post(config.environmentURL + '/cast-vote', { voteData })
                .then(setSelectedPollAnswers([]))
                .then(setVoteCast(true))
                .then(setTimeout(() => { getPost() }, 200))
        }
    }

    useEffect(() => {
        if (!accountContextLoading) {
            getPost()
            console.log('getPost run on PostPage')
        }
    }, [accountContextLoading])

    return (
        <div className={styles.postPage}>
            {/* {alertModalOpen && 
                <AlertModal message={alertMessage} setAlertModalOpen={setAlertModalOpen}>
                    <div className='wecoButton' onClick={}>Log in</div>
                </AlertModal>
            } */}
            <PostCard
                post={post}
                postPageLoading={postPageLoading}
                isPostPage={true}
            />

            {post.type === 'poll' &&
                <PageSectionSelector pageUrl={pageUrl}/>
            }

            <Switch>
                <Redirect from={`${props.match.url}`} to={`${props.match.url}/comments`} exact/>
                <Route path={`${props.match.url}/comments`} render={() =>
                    <PostPageComments
                        submitComment={submitComment}
                        commentError={commentError}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        setCommentError={setCommentError}
                        post={post}
                    />
                } exact />

                <Route path={`${props.match.url}/vote`} render={() => 
                    <PostPagePollVote
                        pollType={post.subType}
                        validVote={validVote}
                        castVote={castVote}
                        voteCast={voteCast}
                        setVoteCast={setVoteCast}
                        pollAnswersSortedById={pollAnswersSortedById}
                        selectedPollAnswers={selectedPollAnswers}
                        setSelectedPollAnswers={setSelectedPollAnswers}
                        totalUsedPoints={totalUsedPoints}
                    />
                } exact />

                <Route path={`${props.match.url}/results`} component={() => 
                    <PostPagePollResults
                        post={post}
                        postId={postId}
                        pageUrl={pageUrl}
                        parsedQuery={parsedQuery}
                        pollAnswers={post.PollAnswers}
                        pollAnswersSortedByScore={pollAnswersSortedByScore}
                        totalPollVotes={totalPollVotes}
                        //totalPollScore={totalPollScore}
                    />
                } exact />
                <Route component={ EmptyPage }/>
            </Switch> 
        </div>
    )
}

export default PostPage

/* {pageSection === 'comments' &&
    <PostPageComments
        submitComment={submitComment}
        commentError={commentError}
        newComment={newComment}
        setNewComment={setNewComment}
        setCommentError={setCommentError}
        post={post}
    />
} */

/* {pageSection === 'poll-vote' &&
    <PostPagePollVote
        castVote={castVote}
        pollAnswersSortedById={pollAnswersSortedById}
        selectedPollAnswers={selectedPollAnswers}
        setSelectedPollAnswers={setSelectedPollAnswers}
    />
} */

/* {pageSection === 'poll-results' &&
    <PostPagePollResults
        postId={postId}
        pollAnswers={post.PollAnswers}
        pollAnswersSortedByScore={pollAnswersSortedByScore}
        totalPollVotes={totalPollVotes}
    />
} */