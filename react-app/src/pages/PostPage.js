import React, { useState, useEffect, useContext } from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
//import queryString from 'query-string'
// import axios from 'axios'
// import config from '../Config'
import styles from '../styles/pages/PostPage.module.scss'
import { AccountContext } from '../contexts/AccountContext'
import { PostContext } from '../contexts/PostContext'
import EmptyPage from '../pages/EmptyPage'
import PostCard from '../components/Cards/PostCard'
import PageSectionSelector from '../components/PageSectionSelector'
import PostPageComments from '../components/PostPage/PostPageComments'
import PostPagePollVote from '../components/PostPage/PostPagePollVote'
import PostPagePollResults from '../components/PostPage/PostPagePollResults'

function PostPage({ match }) {
    const { url } = match
    const { postId } = match.params
    const { accountContextLoading } = useContext(AccountContext)
    const { setPostId, post } = useContext(PostContext)

    useEffect(() => {
        if (!accountContextLoading) { setPostId(postId) }
    }, [accountContextLoading])

    return (
        <div className={styles.postPage}>
            <PostCard post={post} location='post-page'/>
            {post.type === 'poll' && <PageSectionSelector url={url}/>}
            <Switch>
                <Redirect from={`${url}`} to={`${url}/comments`} exact/>
                <Route path={`${url}/comments`} render={() => <PostPageComments/>} exact/>
                <Route path={`${url}/vote`} render={() => <PostPagePollVote/>} exact />
                <Route path={`${url}/results`} component={() => <PostPagePollResults/>} exact />
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

    // useEffect(() => {
    //     if (!accountContextLoading) {
    //         getPost()
    //         console.log('getPost run on PostPage')
    //     }
    // }, [accountContextLoading])

                {/* {alertModalOpen && 
                <AlertModal message={alertMessage} setAlertModalOpen={setAlertModalOpen}>
                    <div className='wecoButton' onClick={}>Log in</div>
                </AlertModal>
            } */}