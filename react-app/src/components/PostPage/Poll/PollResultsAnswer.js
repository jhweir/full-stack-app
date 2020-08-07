import React, { useContext } from 'react'
import styles from '../../../styles/components/PollResultsAnswer.module.scss'
import { PostContext } from '../../../contexts/PostContext'

function PollResultsAnswer(props) {
    const { answer, index } = props
    const { post, totalPollVotes, colorScale } = useContext(PostContext)

    let color = colorScale(index)
    let pollAnswerVotes = answer.total_votes
    let pollAnswerScore = ((answer.total_votes / totalPollVotes) * 100).toFixed(1)

    if (post.subType === 'weighted-choice') {
        if (answer.total_score != null) pollAnswerVotes = answer.total_score.toFixed(1)
        pollAnswerScore = ((answer.total_score / totalPollVotes) * 100).toFixed(1)
    }

    return (
        <div className={styles.pollAnswer}>
            <div className={styles.pollAnswerIndex} style={{ backgroundColor: color }}>
                {index + 1}
            </div>
            <div className={styles.pollAnswerScoreRatio}>{`${ pollAnswerVotes } ↑`}</div>
            <div className={styles.pollAnswerScore}>
                <div className={styles.pollAnswerScoreBar} style={{width: `${ pollAnswerScore }%`}}/>
                <div className={styles.pollAnswerScoreText}>{ pollAnswerScore }%</div>
            </div>
            <div className={styles.pollAnswerText}>{ answer.text }</div>
        </div>
    )
}

export default PollResultsAnswer