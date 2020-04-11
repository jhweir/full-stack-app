import React from 'react'
import styles from '../styles/components/PollAnswer.module.scss'

function PollAnswer(props) {
    const { answer, selectedPollAnswers, setSelectedPollAnswers } = props

    function addPollAnswer() {
        if (selectedPollAnswers.includes(answer)) {
            let updatedSelectedPollAnswers = selectedPollAnswers.filter((pollAnswer) => { return pollAnswer !== answer })
            setSelectedPollAnswers([...updatedSelectedPollAnswers])
        } else {
            setSelectedPollAnswers([...selectedPollAnswers, answer])
        }
    }

    const answerSelected = selectedPollAnswers.includes(answer)

    return (
        <div className={`${styles.pollAnswer} ${answerSelected && styles.answerSelected}`} onClick={() => { addPollAnswer() }}>
            <img className={styles.pollAnswerCheckBox} src={answerSelected ? "/icons/check-circle-regular.svg" : "/icons/circle-regular.svg"}/>
            <div className={styles.pollAnswerText}>{answer.text}</div>
        </div>
    )
}

export default PollAnswer