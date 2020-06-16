import React, { useState } from 'react'
import styles from '../styles/components/PostPagePollResults.module.scss'
import PollResultsFilters from './PollResultsFilters'
import PollResultsDisplay from './PollResultsDisplay'
import PollResultsAnswer from './PollResultsAnswer'

function PostPagePollResults(props) {
    const {
        postId,
        pageUrl,
        parsedQuery,
        pollAnswers,
        pollAnswersSortedByScore,
        totalPollVotes
    } = props

    return (
        <div className={styles.pollResults}>
            <PollResultsFilters pageUrl={pageUrl} />
            <PollResultsDisplay
                postId={postId}
                parsedQuery={parsedQuery}
                pollAnswers={pollAnswers}
                totalPollVotes={totalPollVotes}
            />
            {pollAnswersSortedByScore.map((answer, index) => 
                <PollResultsAnswer
                    key={index}
                    index={index} 
                    answer={answer}
                    totalPollVotes={totalPollVotes}
                />
            )}
        </div>
    )
}

export default PostPagePollResults