import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import queryString from 'query-string'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/pages/PostPage.module.scss'
import EmptyPage from '../pages/EmptyPage'
import Post from '../components/Post'
import PageSectionSelector from '../components/PageSectionSelector'
import PostPageComments from '../components/PostPageComments'
import PostPagePollVote from '../components/PostPagePollVote'
import PostPagePollResults from '../components/PostPagePollResults'

function PostPage(props) {
    const postId = props.match.params.postId
    const pageUrl = props.match.url
    const parsedQuery = queryString.parse(props.location.search)

    const [post, setPost] = useState({
        Post_Holons: [],
        Comments: [],
        PollAnswers: [],
        PollVotes: []
    })
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [postPageLoading, setPostPageLoading] = useState(true)
    const [selectedPollAnswers, setSelectedPollAnswers] = useState([])
    const [voteCast, setVoteCast] = useState(false)
    //console.log('selectedPollAnswers', selectedPollAnswers)

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
        axios.get(config.environmentURL + `/post?id=${postId}`)
            .then(res => { 
                setPost(res.data)
                setPostPageLoading(false)
            })
    }

    function submitComment(e) {
        e.preventDefault()
        if (newComment === '') { setCommentError(true) } else {
            axios.post(config.environmentURL + '/add-comment', { text: newComment, postId })
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
        getPost()
        console.log('getPost run on PostPage')
    }, [])

    return (
        <div className={styles.postPage}>
            <Post 
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