import React, { useEffect, useContext } from 'react'
import { Route, Switch } from 'react-router-dom' // Redirect
import AccountSideBar from '@components/AccountSideBar'
import styles from '../styles/pages/PostPage.module.scss'
import { PostContext } from '../contexts/PostContext'
// import EmptyPage from './EmptyPage'
import PostCard from '../components/Cards/PostCard/PostCard'
import PageSectionSelector from '../components/PageSectionSelector'
// import PostPageComments from '../components/PostPage/PostPageComments'
import PostPagePollVote from '../components/PostPage/PostPagePollVote'
import PostPagePollResults from '../components/PostPage/PostPagePollResults'
import Prism from '../components/Prism'
import PlotGraph from '../components/PlotGraph'
import GlassBeadGame from '../components/GlassBeadGame'
import DecisionTree from '../components/DecisionTree'

const PostPage = ({
    match,
    location,
}: {
    match: { url: string; params: { postId: number } }
    location: { pathname: string }
}): JSX.Element => {
    const { url } = match
    const { postId } = match.params
    const { pathname } = location
    const { getPostData, postData, resetPostContext } = useContext(PostContext)

    useEffect(() => {
        if (postData.id) resetPostContext()
        getPostData(postId)
    }, [postId])

    // useEffect(() => {
    //     if (pathname.includes('comments')) { setPageSectionSelected('comments') }
    //     if (pathname.includes('vote')) { setPageSectionSelected('vote') }
    //     if (pathname.includes('results')) { setPageSectionSelected('results') }
    // }, [accountDataLoading])

    if (postData.type === 'prism') {
        return <Prism />
    }
    if (postData.type === 'plot-graph') {
        return <PlotGraph />
    }
    if (postData.type === 'glass-bead-game') {
        return <GlassBeadGame />
    }
    if (postData.type === 'decision-tree') {
        return <DecisionTree />
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.postCardWrapper}>
                {postData.id && <PostCard post={postData} location='post-page' />}
                {postData.type === 'poll' && <PageSectionSelector url={url} pathname={pathname} />}
                <Switch>
                    {/* {!postDataLoading && postData.type !== 'prism' && */}
                    {/* <Redirect from={`${url}`} to={`${url}/comments`} exact/> */}
                    {/* } */}
                    {/* <Route path={`${url}/comments`} render={() => <PostPageComments/>} exact/> */}
                    <Route path={`${url}/vote`} render={() => <PostPagePollVote />} exact />
                    <Route path={`${url}/results`} render={() => <PostPagePollResults />} exact />
                    {/* <Route component={ EmptyPage }/> */}
                </Switch>
            </div>
            <AccountSideBar />
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
//     if (!accountDataLoading) {
//         getPost()
//         console.log('getPost run on PostPage')
//     }
// }, [accountDataLoading])

/* {alertModalOpen && 
    <AlertModal message={alertMessage} setAlertModalOpen={setAlertModalOpen}>
        <div className='wecoButton' onClick={}>Log in</div>
    </AlertModal>
} */
