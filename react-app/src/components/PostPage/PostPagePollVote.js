import React, { useContext } from 'react'
import styles from '../../styles/components/PostPagePollVote.module.scss'
import PollAnswer from './Poll/PollAnswer'
import { PostContext } from '../../contexts/PostContext'

function PostPagePollVote() {
    const {
        postData,
        validVote,
        castVote,
        voteCast,
        pollAnswersSortedById,
        totalUsedPoints
    } = useContext(PostContext)

    return (
        <div className={styles.pollVote}>
            <div className={styles.text}>Poll type: <b>{postData.subType}</b></div>
            <div className={styles.castVoteSection}>
                <div className={`${styles.castVoteButton} ${validVote && styles.validVote}`} onClick={() => { castVote() }}>
                    Cast your vote
                </div>
                {voteCast &&
                    <div className={styles.voteCastAlert}>
                        <img className={styles.voteCastAlertCheck} src="/icons/check-solid.svg"/>
                        Vote cast!
                    </div>
                }
            </div>
            {postData.subType === 'weighted-choice' && <div className={styles.text}>Split 100 points across the poll answers...</div>}
            {pollAnswersSortedById.map((answer, index) =>
                <PollAnswer key={index} answer={answer}/>
            )}
            {postData.subType === 'weighted-choice' &&
                <div className={`${styles.totalUsedPointsText} ${totalUsedPoints !== 100 && styles.error}`}>
                    Total used points: {totalUsedPoints}
                    <br/>
                    {totalUsedPoints > 100 && `(remove ${totalUsedPoints - 100} points to vote)` }
                    {totalUsedPoints < 100 && `(add ${100 - totalUsedPoints} more points to vote)` }
                    {totalUsedPoints === 100 && 'ready to vote!' }
                </div>
            }
        </div>
    )
}

export default PostPagePollVote