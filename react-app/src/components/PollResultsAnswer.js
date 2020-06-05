import React from 'react'
import styles from '../styles/components/PollResultsAnswer.module.scss'

function PollResultsAnswer(props) {
    const { answer, index, totalPollVotes } = props

    const pollAnswerScore = ((answer.Labels.length / totalPollVotes) * 100).toFixed(2)
    const pollAnswerVotes = answer.Labels.length

    return (
        <div className={styles.pollAnswer}>
            <div className={styles.pollAnswerIndex}>{index + 1}</div>
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