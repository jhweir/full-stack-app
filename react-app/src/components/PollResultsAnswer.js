import React from 'react'
import styles from '../styles/components/PollResultsAnswer.module.scss'

function PollResultsAnswer(props) {
    const { answer, index, totalPollVotes, color } = props

    const pollAnswerScore = ((answer.total_votes / totalPollVotes) * 100).toFixed(1)
    const pollAnswerVotes = answer.total_votes

    return (
        <div className={styles.pollAnswer}>
            <div className={styles.pollAnswerIndex} style={{backgroundColor: color}}>
                {index + 1}
            </div>
            <div className={styles.pollAnswerScoreRatio}>{`${pollAnswerVotes}` + ' ↑'}</div>
            <div className={styles.pollAnswerScore}>
                <div className={styles.pollAnswerScoreBar} style={{width: `${pollAnswerScore}%`}}/>
                <div className={styles.pollAnswerScoreText}>{pollAnswerScore}%</div>
            </div>
            <div className={styles.pollAnswerText}>{answer.text}</div>
        </div>
    )
}

export default PollResultsAnswer