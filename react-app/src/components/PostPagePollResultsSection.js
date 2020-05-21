import React from 'react'
import styles from '../styles/components/PostPagePollResultsSection.module.scss'
import PollResultsAnswer from '../components/PollResultsAnswer'
import PollResultsPieChart from '../components/PollResultsPieChart'

function PostPagePollResultsSection(props) {
    const {
        pollAnswers,
        pollAnswersSortedByScore,
        totalPollVotes
    } = props
    return (
        <div className={styles.pollResultsSection}>
            <PollResultsPieChart pollAnswers={pollAnswers}/>
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

export default PostPagePollResultsSection