import React from 'react'
import styles from '../../../styles/components/PollAnswerForm.module.scss'
import PollAnswerInput from './PollAnswerInput'

function PollAnswerForm(props) {
    const { 
        pollAnswers,
        setPollAnswers,
        newPollAnswer,
        setNewPollAnswer,
        newPollAnswerError,
        setNewPollAnswerError
    } = props

    function addPollAnswer(pollAnswer) {
        let invalidPollAnswer = pollAnswer.length === 0 || pollAnswer.length > 1000
        if (invalidPollAnswer) { setNewPollAnswerError(true) }
        else { setPollAnswers([...pollAnswers, pollAnswer]); setNewPollAnswer('') }
    }

    function removePollAnswer(pollAnswer) {
        const updatedPollAnswers = pollAnswers.filter((answer) => { return answer !== pollAnswer })
        setPollAnswers(updatedPollAnswers)
    }

    return (
        <div className={styles.pollAnswerForm}>
            <div className={styles.text}>Add poll answers below: </div>
            <div className={styles.pollAnswerFormTop}>
                <textarea className={`wecoInput textArea mb-10 ${newPollAnswerError && 'error'}`} style={{height: 40}}
                    type="text" placeholder="Answer... (max 2,000 characters)" value={newPollAnswer}
                    onChange={(e) => { setNewPollAnswer(e.target.value); setNewPollAnswerError(false) }}/>
                <div className={styles.pollAnswerFormButton} onClick={() => { addPollAnswer(newPollAnswer) }}>
                    Add answer
                </div>
            </div>
            {pollAnswers.length !== 0 &&
                <>
                    <div>Added answers: </div>
                    <ul className={styles.pollAnswers}>
                        {pollAnswers.map((answer, index) => 
                            <div className={styles.pollAnswer} key={index}>
                                <div className={styles.pollAnswerText}>{answer}</div>
                                <div className={styles.pollAnswerCloseButton} onClick={() => { removePollAnswer(answer) }}/>
                            </div>
                        )}
                    </ul>
                </>
            }
        </div>
    )
}

export default PollAnswerForm
