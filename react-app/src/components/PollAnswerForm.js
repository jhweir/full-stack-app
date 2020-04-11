import React, { useState, useEffect } from 'react'
import styles from '../styles/components/PollAnswerForm.module.scss'
import PollAnswerInput from './PollAnswerInput'

function PollAnswerForm(props) {
    const { 
        pollAnswers,
        setPollAnswers,
        newPollAnswer,
        setNewPollAnswer
    } = props

    function addPollAnswer(pollAnswer) {
        setPollAnswers([...pollAnswers, pollAnswer])
        setNewPollAnswer('')
    }

    function removePollAnswer(pollAnswer) {
        const updatedPollAnswers = pollAnswers.filter((answer) => { return answer !== pollAnswer })
        setPollAnswers(updatedPollAnswers)
    }

    return (
        <div className={styles.pollAnswerForm}>
            <div className={styles.pollAnswerFormTop}>
                <textarea className={styles.pollAnswerFormInput}
                    rows="5" type="text" placeholder="Answer... (max 2,000 characters)" value={newPollAnswer}
                    onChange={(e) => { setNewPollAnswer(e.target.value) }}/>
                <div className={styles.pollAnswerFormButton} onClick={() => { addPollAnswer(newPollAnswer) }}>
                    Add answer
                </div>
            </div>
            {pollAnswers.length !== 0 &&
                <>
                    <div>Added answers: </div>
                    <ul className={styles.pollAnswers}>
                        {pollAnswers.map((answer, index) => 
                            <PollAnswerInput key={index} pollAnswer={answer} removePollAnswer={removePollAnswer}/>
                        )}
                    </ul>
                </>
            }
        </div>
    )
}

export default PollAnswerForm
