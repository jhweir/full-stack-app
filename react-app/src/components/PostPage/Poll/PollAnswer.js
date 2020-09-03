import React, { useState, useEffect, useContext } from 'react'
import styles from '../../../styles/components/PollAnswer.module.scss'
import { PostContext } from '../../../contexts/PostContext'

function PollAnswer(props) {
    const { answer } = props
    const {
        postData,
        selectedPollAnswers, setSelectedPollAnswers,
        setVoteCast
    } = useContext(PostContext)

    const [answerValue, setAnswerValue] = useState('')

    const selectedAnswer = selectedPollAnswers.filter(pollAnswer => pollAnswer.id === answer.id)
    const alreadySelected = selectedAnswer.length > 0

    function selectAnswer(value) {
        setVoteCast(false)
        if (postData.subType === 'single-choice') {
            if (alreadySelected) { setSelectedPollAnswers([]) }
            else { setSelectedPollAnswers([{id: answer.id}]) }
        }
        if (postData.subType === 'multiple-choice') {
            if (alreadySelected) { setSelectedPollAnswers([...selectedPollAnswers.filter(pollAnswer => pollAnswer.id !== answer.id)]) }
            else { setSelectedPollAnswers([...selectedPollAnswers, {id: answer.id}]) }
        }
        if (postData.subType === 'weighted-choice') {
            if (alreadySelected) { setSelectedPollAnswers([...selectedPollAnswers.filter(pollAnswer => pollAnswer.id !== answer.id), {id: answer.id, value: Number(value)}]) }
            else { setSelectedPollAnswers([...selectedPollAnswers, {id: answer.id, value: Number(value)}]) }
        }
    }

    useEffect(() => {
        if (alreadySelected) { setAnswerValue(selectedAnswer.value) }
    }, [])

    useEffect(() => {
        if (selectedPollAnswers.length < 1) { setAnswerValue('') }
    }, [selectedPollAnswers])

    return (
        <div className={`${styles.pollAnswer} ${alreadySelected && styles.answerSelected}`}
            onClick={() => { if (postData.subType !== 'weighted-choice') selectAnswer() }}>
            {postData.subType !== 'weighted-choice' &&
                <img 
                    className={styles.pollAnswerCheckBox}
                    src={alreadySelected ? "/icons/check-circle-regular.svg" : "/icons/circle-regular.svg"}
                />
            }
            {postData.subType === 'weighted-choice' &&
                <input className={styles.pollAnswerInput}
                    placeholder="0" min="0" 
                    type="number" value={answerValue}
                    onChange={(e) => {
                        if (!e.target.value.includes("-")) {
                            setAnswerValue(e.target.value)
                            selectAnswer(e.target.value)
                        }
                    }}>
                </input>
            }
            <div className={styles.pollAnswerText}>{answer.text}</div>
        </div>
    )
}

export default PollAnswer
