import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/pages/PostPage.module.scss'
import Post from '../components/Post'
import Comment from '../components/Comment'
import PollAnswer from '../components/PollAnswer'

function PostPage({ match }) {
    const postId = match.params.postId

    const [post, setPost] = useState({
        Holons: [],
        Labels: [],
        Comments: [],
        PollAnswers: []
    })
    const [newComment, setNewComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [postPageLoading, setPostPageLoading] = useState(true)
    const [pollSection, setPollSection] = useState('vote')
    const [selectedPollAnswers, setSelectedPollAnswers] = useState([])

    function getPost() {
        axios.get(config.environmentURL + `/getPost?id=${postId}`).then(res => { 
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
                // .then(setTimeout(() => { getPost() }, 100))
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    return (
        <div className={styles.postPage}>
            <Post 
                post={post}
                postPageLoading={postPageLoading}
                isPostPage={true}
            />
            {post.type !== 'poll' &&
                <>
                    <form className={styles.commentForm} onSubmit={submitComment}> 
                        <textarea className={`${styles.commentFormTextArea} ${(commentError && styles.error)}`}
                            placeholder="Leave a comment..."
                            rows="1" type="text" name="newComment" value={newComment}
                            onChange={(e) => { setNewComment(e.target.value); setCommentError(false) }}
                        />
                        <div className="button-container">
                            <button className={styles.commentFormButton}>Post comment</button>
                        </div>
                    </form>
                    <div className={styles.comments}>
                        {post.Comments.map((comment, index) => 
                            <Comment 
                                key={comment.id}
                                index={index}
                                comment={comment}
                            /> 
                        )}
                    </div>
                </>
            }
            {post.type === 'poll' &&
                <>
                    <div className={styles.pollSectionSelector}>
                        <div className={styles.pollSectionSelectorButton} onClick={() => {setPollSection('vote')}}>Vote</div>
                        <div className={styles.pollSectionSelectorButton} onClick={() => {setPollSection('comments')}}>Comments</div>
                        <div className={styles.pollSectionSelectorButton} onClick={() => {setPollSection('results')}}>Results</div>
                    </div>

                    {pollSection === 'vote' &&
                        <div className={styles.pollVoteSection}>
                            <div className={styles.castVoteButton} onClick={() => { castVote() }}>Cast your vote</div>
                            {post.PollAnswers.map((answer, index) => 
                                <PollAnswer 
                                    key={index} 
                                    answer={answer}
                                    selectedPollAnswers={selectedPollAnswers}
                                    setSelectedPollAnswers={setSelectedPollAnswers}/>
                            )}
                        </div>
                    }
                    {pollSection === 'comments' &&
                        <>
                            <form className={styles.commentForm} onSubmit={submitComment}> 
                                <textarea className={`${styles.commentFormTextArea} ${(commentError && styles.error)}`}
                                    placeholder="Leave a comment..."
                                    rows="1" type="text" name="newComment" value={newComment}
                                    onChange={(e) => { setNewComment(e.target.value); setCommentError(false) }}
                                />
                                <div className="button-container">
                                    <button className={styles.commentFormButton}>Post comment</button>
                                </div>
                            </form>
                            <div className={styles.comments}>
                                {post.Comments.map((comment, index) => 
                                    <Comment 
                                        key={comment.id}
                                        index={index}
                                        comment={comment}
                                    /> 
                                )}
                            </div>
                        </>
                    }
                    {pollSection === 'results' &&
                        <div className={styles.pollResultsSection}>
                            pollResultsSection
                        </div>
                    }
                </>
            }

        </div>
    )
}

export default PostPage