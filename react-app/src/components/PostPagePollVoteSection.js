import React from 'react'
import styles from '../styles/components/PostPagePollVoteSection.module.scss'
import PollAnswer from './PollAnswer'

function PostPagePollVoteSection(props) {
    const {
        castVote,
        pollAnswersSortedById,
        selectedPollAnswers,
        setSelectedPollAnswers
    } = props
    return (
        <div className={styles.pollVoteSection}>
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

export default PostPagePollVoteSection