import React from 'react'
import styles from '../styles/components/PostPagePollVote.module.scss'
import PollAnswer from './PollAnswer'

function PostPagePollVote(props) {
    const {
        castVote,
        pollAnswersSortedById,
        selectedPollAnswers,
        setSelectedPollAnswers
    } = props
    return (
        <div className={styles.pollVote}>
            <div className={styles.castVoteButton} onClick={() => { castVote() }}>Cast your vote</div>
            {pollAnswersSortedById.map((answer, index) => 
                <PollAnswer 
                    key={index} 
                    answer={answer}
                    selectedPollAnswers={selectedPollAnswers}
                    setSelectedPollAnswers={setSelectedPollAnswers}
                />
            )}
        </div>
    )
}

export default PostPagePollVote