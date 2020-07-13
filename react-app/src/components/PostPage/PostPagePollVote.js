import React from 'react'
import styles from '../../styles/components/PostPagePollVote.module.scss'
import PollAnswer from './Poll/PollAnswer'

function PostPagePollVote(props) {
    const {
        pollType,
        validVote,
        castVote,
        voteCast,
        setVoteCast,
        pollAnswersSortedById,
        selectedPollAnswers,
        setSelectedPollAnswers,
        totalUsedPoints
    } = props

    return (
        <div className={styles.pollVote}>
            <div className={styles.castVoteSection}>
                <div className={`${styles.castVoteButton} ${validVote && styles.validVote}`}
                    onClick={() => { castVote() }}>
                    Cast your vote
                </div>
                {voteCast &&
                    <div className={styles.voteCastAlert}>
                        <img 
                            className={styles.voteCastAlertCheck}
                            src="/icons/check-solid.svg"
                        />
                        Vote cast!
                    </div>
                }
            </div>
            <div style={{margin: "10px 0"}}>Poll type: <b>{pollType}</b></div>
            {pollType === 'weighted-choice' &&
                <div style={{margin: "10px 0"}}>Split 100 points across the poll answers...</div>
            }
            {pollAnswersSortedById.map((answer, index) => 
                <PollAnswer
                    key={index}
                    pollType={pollType}
                    answer={answer}
                    selectedPollAnswers={selectedPollAnswers}
                    setSelectedPollAnswers={setSelectedPollAnswers}
                    setVoteCast={setVoteCast}
                />
            )}
            {pollType === 'weighted-choice' &&
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