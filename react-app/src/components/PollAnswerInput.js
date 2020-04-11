import React from 'react'
import styles from '../styles/components/PollAnswerInput.module.scss'

function PollAnswerInput(props) {
    const { pollAnswer, removePollAnswer } = props
    return (
        <div className={styles.pollAnswer}>
            <div className={styles.pollAnswerText}>{pollAnswer}</div>
            <div className={styles.pollAnswerCloseButton} onClick={() => { removePollAnswer(pollAnswer) }}/>
        </div>
    )
}

export default PollAnswerInput