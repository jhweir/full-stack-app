import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/CreateHolonModal.module.scss'
// import CreatePostModalHolonHandleInput from './CreatePostModalHolonHandleInput'

function CreateHolonModal() {
    // const { setCreateHolonModalOpen } = props
    const { createHolonModalOpen, setCreateHolonModalOpen } = useContext(AccountContext)
    const { holonData, getHolonData } = useContext(HolonContext)
    
    const [name, setName] = useState('')
    const [handle, setHandle] = useState('')
    const [description, setDescription] = useState('')
    const [nameError, setNameError] = useState(false)
    const [handleError, setHandleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [flashMessage, setFlashMessage] = useState('')

    function publishHolon(e) {
        e.preventDefault()
        let invalidHandle = handle.length === 0 || handle.length > 15
        let invalidName = name.length === 0 || name.length > 25
        let invalidDescription = description.length === 0 || description.length > 10000
        if (invalidHandle) { setHandleError(true) }
        if (invalidName) { setNameError(true) }
        if (invalidDescription) { setDescriptionError(true) }
        if (!invalidHandle && !invalidName && !invalidDescription) {
            const data = { name, handle, description, parentHolonId: holonData.id }
            axios.post(config.environmentURL + `/create-holon`, data)
                .then(res => {
                    if (res.data === 'holon-handle-taken') { setFlashMessage('Holon handle already taken') }
                    if (res.data === 'success') { setCreateHolonModalOpen(false); setTimeout(() => { getHolonData() }, 200) }
                })
        }
    }

    if (createHolonModalOpen) {
        return (
            <div className={styles.modalWrapper}>
                <div className={styles.modal}>
                    <img 
                        className={styles.closeButton}
                        src="/icons/close-01.svg"
                        onClick={() => setCreateHolonModalOpen(false)}
                    />
                    <span className={styles.title}>Create a new space in '{ holonData.name }'</span>
                    <span className={styles.flashMessage}>{ flashMessage }</span>
                    <form className={styles.form} onSubmit={ publishHolon }>
                        <input 
                            className={`wecoInput mb-10 ${handleError && 'error'}`}
                            placeholder="Handle (must be unique)"
                            type="text" value={ handle }
                            onChange={(e) => { setHandle(e.target.value); setHandleError(false) }}
                        />
                        <input 
                            className={`wecoInput mb-10 ${nameError && 'error'}`}
                            placeholder="Name"
                            type="text" value={ name }
                            onChange={(e) => { setName(e.target.value); setNameError(false) }}
                        />
                        <textarea 
                            className={`wecoInput mb-10 ${descriptionError && 'error'}`}
                            style={{ height:'auto', paddingTop:10 }}
                            placeholder="Description" rows="3"
                            type="text" value={ description }
                            onChange={(e) => { setDescription(e.target.value); setDescriptionError(false) }}
                        />
                        <span className={styles.text}>You will be the default moderator. Navigate to the space while logged in to this account to access its settings.</span>
                        <button className="wecoButton">Create Holon</button>
                    </form>
                </div>
            </div>
        )
    } else { return null }
}

export default CreateHolonModal

/* <span className="modal-title-medium mb-20">Choose its location (parent holons)</span>
<textarea className={"input-wrapper modal mb-20 " + (parentHolonIdError && 'error')}
    style={{ height:'auto', paddingTop:10 }}
    rows="5"
    type="text"
    placeholder="Parent holon ID..."
    value={ parentHolonId }
    onChange={(e) => {
        setParentHolonId(e.target.value)
        setParentHolonIdError(false)
    }}
/> */