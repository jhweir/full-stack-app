import React, { useState } from 'react'
import styles from '../styles/components/PollResultsDisplay.module.scss'
import PollResultsPieChart from './PollResultsPieChart'
import PollResultsTimeGraph from './PollResultsTimeGraph'

function PollResultsDisplay(props) {
    const {
        post,
        postId,
        parsedQuery,
        pollAnswers,
        totalPollVotes,
        pollAnswersSortedByScore,
        colorScale
    } = props

    return (
        <div className={styles.pollResultsDisplay}>
                <PollResultsPieChart
                    pollAnswers={pollAnswers}
                    totalPollVotes={totalPollVotes}
                    pollAnswersSortedByScore={pollAnswersSortedByScore}
                    colorScale={colorScale}
                />
                <PollResultsTimeGraph 
                    post={post}
                    postId={postId}
                    pollAnswers={pollAnswers}
                    totalPollVotes={totalPollVotes}
                    colorScale={colorScale}
                />
            {/* {(!parsedQuery.display || parsedQuery.display === 'pie-chart') &&
                <PollResultsPieChart
                    pollAnswers={pollAnswers}
                    totalPollVotes={totalPollVotes}
                    pollAnswersSortedByScore={pollAnswersSortedByScore}
                    colorScale={colorScale}
                />
            }
            {parsedQuery.display === 'time-graph' &&
                <PollResultsTimeGraph 
                    post={post}
                    postId={postId}
                    pollAnswers={pollAnswers}
                    totalPollVotes={totalPollVotes}
                    colorScale={colorScale}
                />
            } */}
        </div>
    )
}

export default PollResultsDisplay