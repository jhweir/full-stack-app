import React, { useContext } from 'react'
import styles from '../../styles/components/PostPagePollResults.module.scss'
import PollResultsPieChart from './Poll/PollResultsPieChart'
import PollResultsTimeGraph from './Poll/PollResultsTimeGraph'
import PollResultsAnswer from './Poll/PollResultsAnswer'
import { PostContext } from '../../contexts/PostContext'

function PostPagePollResults() {
    const { pollAnswersSortedByScore } = useContext(PostContext)

    return (
        <div className={styles.pollResults}>
            <div className={styles.display}>
                <PollResultsPieChart/>
                <PollResultsTimeGraph/>
            </div>
            {pollAnswersSortedByScore.map((answer, index) => 
                <PollResultsAnswer answer={answer} key={index} index={index}/>
            )}
        </div>
    )
}

export default PostPagePollResults

// import PollResultsFilters from './PollResultsFilters'
// <PollResultsFilters pageUrl={pageUrl} />