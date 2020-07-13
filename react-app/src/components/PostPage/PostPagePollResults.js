import React from 'react'
import * as d3 from 'd3'
import styles from '../../styles/components/PostPagePollResults.module.scss'
//import PollResultsFilters from './PollResultsFilters'
import PollResultsDisplay from './Poll/PollResultsDisplay'
import PollResultsAnswer from './Poll/PollResultsAnswer'

function PostPagePollResults(props) {
    const {
        post,
        postId,
        //pageUrl,
        parsedQuery,
        pollAnswers,
        pollAnswersSortedByScore,
        totalPollVotes,
        //totalPollScore
    } = props

    var colorScale = d3.scaleSequential()
        .domain([0, pollAnswers.length])
        .interpolator(d3.interpolateViridis)
        // https://github.com/d3/d3-scale-chromatic/blob/master/README.md

    return (
        <div className={styles.pollResults}>
            {/* <PollResultsFilters pageUrl={pageUrl} /> */}
            <PollResultsDisplay
                post={post}
                postId={postId}
                parsedQuery={parsedQuery}
                pollAnswers={pollAnswers}
                totalPollVotes={totalPollVotes}
                pollAnswersSortedByScore={pollAnswersSortedByScore}
                colorScale={colorScale}
            />
            {pollAnswersSortedByScore.map((answer, index) => 
                <PollResultsAnswer
                    color={colorScale(index)}
                    key={index}
                    index={index} 
                    answer={answer}
                    totalPollVotes={totalPollVotes}
                    post={post}
                    //totalPollScore={totalPollScore}
                    //totalScore={answer.total_score}
                />
            )}
        </div>
    )
}

export default PostPagePollResults