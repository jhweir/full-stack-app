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

    const matchingSelectedAnswer = selectedPollAnswers.filter(pollAnswer => pollAnswer.id === answer.id)

    function addPollAnswer(value) {
        setVoteCast(false)
        if (postData.subType === 'single-choice') {
            if (matchingSelectedAnswer.length) {
                setSelectedPollAnswers([...selectedPollAnswers.filter(pollAnswer => { return pollAnswer.id !== answer.id })])
            } else {
                setSelectedPollAnswers([{id: answer.id}])
            }
        }
        if (postData.subType === 'multiple-choice') {
            // if poll answer already included in selectedPollAnswers..
            if (matchingSelectedAnswer.length) {
                // remove answer from selectedPollAnswers
                setSelectedPollAnswers([...selectedPollAnswers.filter(pollAnswer => { return pollAnswer.id !== answer.id })])
            } else {
                // add answer to selectedPollAnswers
                setSelectedPollAnswers([...selectedPollAnswers, {id: answer.id}])
            }
        }
        if (postData.subType === 'weighted-choice') {
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
            onClick={() => { if (postData.subType !== 'weighted-choice') addPollAnswer() }}>
            {postData.subType !== 'weighted-choice' &&
                <img 
                    className={styles.pollAnswerCheckBox}
                    src={matchingSelectedAnswer.length ? "/icons/check-circle-regular.svg" : "/icons/circle-regular.svg"}
                />
            }
            {postData.subType === 'weighted-choice' &&
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