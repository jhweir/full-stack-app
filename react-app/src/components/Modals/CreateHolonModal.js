import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/CreateHolonModal.module.scss'

function CreateHolonModal() {
    const { accountData, getAccountData, setCreateHolonModalOpen } = useContext(AccountContext)
    const { holonData, getHolonData, getHolonSpaces } = useContext(HolonContext)
    
    const [name, setName] = useState('')
    const [handle, setHandle] = useState('')
    const [description, setDescription] = useState('')
    const [nameError, setNameError] = useState(false)
    const [handleError, setHandleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [flashMessage, setFlashMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    function createHolon(e) {
        e.preventDefault()
        let invalidHandle = handle.length < 1 || handle.length > 30
        let invalidName = name.length < 1 || name.length > 30
        let invalidDescription = description.length < 1 || description.length > 10000
        if (invalidHandle) { setHandleError(true); setFlashMessage('Invalid handle') }
        if (invalidName) { setNameError(true); setFlashMessage('Invalid name') }
        if (invalidDescription) { setDescriptionError(true); setFlashMessage('Invalid description') }
        if (!invalidHandle && !invalidName && !invalidDescription) {
            const data = { creatorId: accountData.id, handle, name, description, parentHolonId: holonData.id }
            axios.post(config.apiURL + `/create-holon`, data)
                .then(res => {
                    if (res.data === 'holon-handle-taken') {
                        setHandleError(true)
                        setFlashMessage('Holon handle already taken')
                    }
                    if (res.data === 'attached-to-all' || res.data === 'attached-by-mod') {
                        setSuccessMessage(`Success! Your new space has been created and attached to '${holonData.name}'`)
                        setTimeout(() => { getHolonSpaces() }, 500)
                    }
                    if (res.data === 'pending-acceptance') {
                        setSuccessMessage(`Success! A request has been sent to the spaces moderators. Until they accept it, your space will appear in 'all'.`)
                    }
                })
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeButton}
                    src="/icons/close-01.svg"
                    onClick={() => setCreateHolonModalOpen(false)}
                />
                {successMessage.length < 1 && <>
                    <span className={styles.title}>Create a new space in '{ holonData.name }'</span>
                    <span className={styles.flashMessage}>{ flashMessage }</span>
                    <form className={styles.form} onSubmit={createHolon}>
                        <input 
                            className={`wecoInput mb-10 ${handleError && 'error'}`}
                            placeholder="Handle (must be unique)"
                            type="text" value={ handle }
                            onChange={(e) => {
                                setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                                setHandleError(false)
                                setFlashMessage('')
                            }}
                        />
                        <input 
                            className={`wecoInput mb-10 ${nameError && 'error'}`}
                            placeholder="Name"
                            type="text" value={ name }
                            onChange={(e) => { setName(e.target.value); setNameError(false); setFlashMessage('') }}
                        />
                        <textarea 
                            className={`wecoInput mb-10 ${descriptionError && 'error'}`}
                            style={{ height:'auto', paddingTop:10 }}
                            placeholder="Description" rows="3"
                            type="text" value={ description }
                            onChange={(e) => { setDescription(e.target.value); setDescriptionError(false); setFlashMessage('') }}
                        />
                        <span className={styles.text}>You will be the default moderator. Navigate to the space while logged in with this account to access its settings.</span>
                        <button className="wecoButton">Create Space</button>
                    </form>
                </>}
                {successMessage.length > 0 &&
                    <div className={styles.success}>
                        <img className={styles.checkIcon} src='/icons/check-circle-regular.svg' alt=''/>
                        <span className={styles.successMessage}>{successMessage}</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default CreateHolonModal
