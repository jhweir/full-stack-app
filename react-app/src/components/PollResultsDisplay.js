import React, { useState } from 'react'
import styles from '../styles/components/PollResultsDisplay.module.scss'
import PollResultsPieChart from './PollResultsPieChart'
import PollResultsTimeGraph from './PollResultsTimeGraph'

function PollResultsDisplay(props) {
    const {
        postId,
        parsedQuery,
        pollAnswers,
        totalPollVotes
    } = props

    return (
        <div className={styles.pollResultsDisplay}>
            {(!parsedQuery.display || parsedQuery.display === 'pie-chart') &&
                <PollResultsPieChart 
                    pollAnswers={pollAnswers}
                    totalPollVotes={totalPollVotes}
                />
            }
            {parsedQuery.display === 'time-graph' &&
                <PollResultsTimeGraph 
                    postId={postId}
                    pollAnswers={pollAnswers}
                    totalPollVotes={totalPollVotes}
                />
            }
        </div>
    )
}

export default PollResultsDisplay