import React, { useState, useEffect } from 'react'
import styles from '../../../styles/components/PollAnswer.module.scss'

function PollAnswer(props) {
    const { pollType, answer, selectedPollAnswers, setSelectedPollAnswers, setVoteCast } = props
    const [answerValue, setAnswerValue] = useState('')

    const matchingSelectedAnswer = selectedPollAnswers.filter(pollAnswer => pollAnswer.id === answer.id)

    function addPollAnswer(value) {
        setVoteCast(false)
        if (pollType === 'single-choice') {
            if (matchingSelectedAnswer.length) {
                setSelectedPollAnswers([...selectedPollAnswers.filter(pollAnswer => { return pollAnswer.id !== answer.id })])
            } else {
                setSelectedPollAnswers([{id: answer.id}])
            }
        }
        if (pollType === 'multiple-choice') {
            // if poll answer already included in selectedPollAnswers..
            if (matchingSelectedAnswer.length) {
                // remove answer from selectedPollAnswers
                setSelectedPollAnswers([...selectedPollAnswers.filter(pollAnswer => { return pollAnswer.id !== answer.id })])
            } else {
                // add answer to selectedPollAnswers
                setSelectedPollAnswers([...selectedPollAnswers, {id: answer.id}])
            }
        }
        if (pollType === 'weighted-choice') {
            // if poll answer already included in selectedPollAnswers...
            if (matchingSelectedAnswer.length) {
                // remove answer from selectedPollAnswers and re-add answer with new value
                setSelectedPollAnswers([
                    ...selectedPollAnswers.filter(pollAnswer => { return pollAnswer.id !== answer.id }),
                    {id: answer.id, value: Number(value)}
                ])
            } else {
                // add answer to selectedPollAnswers
                setSelectedPollAnswers([...selectedPollAnswers, {id: answer.id, value: Number(value)}])
            }
        }
    }

    useEffect(() => {
        if (matchingSelectedAnswer.length) { setAnswerValue(matchingSelectedAnswer.value) }
    }, [])

    useEffect(() => {
        if (!selectedPollAnswers.length) { setAnswerValue('') }
    }, [selectedPollAnswers])

    return (
        <div className={`${styles.pollAnswer} ${matchingSelectedAnswer.length && styles.answerSelected}`}
            onClick={() => { if (pollType !== 'weighted-choice') addPollAnswer() }}>
            {pollType !== 'weighted-choice' &&
                <img 
                    className={styles.pollAnswerCheckBox}
                    src={matchingSelectedAnswer.length ? "/icons/check-circle-regular.svg" : "/icons/circle-regular.svg"}
                />
            }
            {pollType === 'weighted-choice' &&
                <input className={styles.pollAnswerInput}
                    placeholder="0" min="0" 
                    type="number" value={answerValue}
                    onChange={(e) => {
                        if (!e.target.value.includes("-")) {
                            setAnswerValue(e.target.value)
                            addPollAnswer(e.target.value)
                        }
                    }}>
                </input>
            }
            <div className={styles.pollAnswerText}>{answer.text}</div>
        </div>
    )
}

export default PollAnswer