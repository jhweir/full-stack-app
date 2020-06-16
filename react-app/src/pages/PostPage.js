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

    // TODO: is there a better way to achieve the effect of .map((a)=>a) here?
    const pollAnswersSortedByScore = post.PollAnswers.map((a)=>a).sort((a, b) => b.total_votes - a.total_votes) 
    const pollAnswersSortedById = post.PollAnswers.map((a)=>a).sort((a, b) => a.id - b.id)
    const totalPollVotes = post.PollAnswers.map((answer) => { return answer.total_votes }).reduce((a, b) => a + b, 0)

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
            axios.post(config.environmentURL + '/addComment', { text: newComment, postId })
                .then(setNewComment(''))
                .then(setTimeout(() => { getPost() }, 100))
        }
    }

    function castVote() {
        if (selectedPollAnswers.length !== 0) {
            let voteData = { postId, selectedPollAnswers }
            axios.post(config.environmentURL + '/castVote', { voteData })
                .then(setSelectedPollAnswers([]))
                .then(setTimeout(() => { getPost() }, 100))
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

                <Route path={`${props.match.url}/vote`} component={() => 
                    <PostPagePollVote
                        castVote={castVote}
                        pollAnswersSortedById={pollAnswersSortedById}
                        selectedPollAnswers={selectedPollAnswers}
                        setSelectedPollAnswers={setSelectedPollAnswers}
                    />
                } exact />

                <Route path={`${props.match.url}/results`} component={() => 
                    <PostPagePollResults
                        postId={postId}
                        pageUrl={pageUrl}
                        parsedQuery={parsedQuery}
                        pollAnswers={post.PollAnswers}
                        pollAnswersSortedByScore={pollAnswersSortedByScore}
                        totalPollVotes={totalPollVotes}
                    />
                } exact />
                <Route component={ EmptyPage }/>
            </Switch> 
        </div>
    )
}

export default PostPage

{/* {pageSection === 'comments' &&
    <PostPageComments
        submitComment={submitComment}
        commentError={commentError}
        newComment={newComment}
        setNewComment={setNewComment}
        setCommentError={setCommentError}
        post={post}
    />
} */}

{/* {pageSection === 'poll-vote' &&
    <PostPagePollVote
        castVote={castVote}
        pollAnswersSortedById={pollAnswersSortedById}
        selectedPollAnswers={selectedPollAnswers}
        setSelectedPollAnswers={setSelectedPollAnswers}
    />
} */}

{/* {pageSection === 'poll-results' &&
    <PostPagePollResults
        postId={postId}
        pollAnswers={post.PollAnswers}
        pollAnswersSortedByScore={pollAnswersSortedByScore}
        totalPollVotes={totalPollVotes}
    />
} */}