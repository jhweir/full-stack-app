import React, { useContext, useState } from 'react'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/SettingModal.module.scss'

function SettingModal() {
    const { settingModalType, setSettingModalOpen } = useContext(AccountContext)
    const { holonData, getHolonData } = useContext(HolonContext)
    const [newValue, setNewValue] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const history = useHistory()

    let title, subTitle, placeholder, invalidValue
    if (settingModalType === 'change-holon-handle') { 
        title = `Change the unique handle for ${holonData.name}`
        subTitle = `The current handle is: ${holonData.handle}`
        placeholder = 'New handle'
        invalidValue = newValue.length < 1
    }
    if (settingModalType === 'change-holon-name') {
        title = `Change the name for ${holonData.name}`
        subTitle = `The current name is: ${holonData.name}`
        placeholder = 'New name'
    }
    if (settingModalType === 'change-holon-description') {
        title = `Change the description for ${holonData.name}`
        subTitle = `The current description is: ${holonData.description}`
        placeholder = 'New description'
    }

    if (settingModalType === 'add-new-moderator') {
        title = `Add a new moderator to ${holonData.name}`
        subTitle = `Paste their unique handle below`
        placeholder = 'New moderators handle'
    }

    if (settingModalType === 'add-parent-space') {
        title = `Add ${holonData.name} to a new parent space`
        subTitle = `Paste the handle of the new parent space below`
        placeholder = 'New parent space handle'
    }

    if (settingModalType === 'remove-parent-space') {
        title = `Remove ${holonData.name} from one of its parent spaces`
        subTitle = `Paste the handle of the parent space you want to remove ${holonData.name} from`
        placeholder = 'Parent space handle'
    }

    function saveNewValue(e) {
        e.preventDefault()
        if (invalidValue) { setError(true) }
        else {
            if (settingModalType === 'change-holon-handle') {
                const post = axios.post(config.environmentURL + '/update-holon-setting', { holonId: holonData.id, setting: settingModalType, newValue })
                const redirect = history.push(`/s/${newValue}`)
                new Promise.all([post]).then(redirect)
            }
            else {
                axios.post(config.environmentURL + '/update-holon-setting', { holonId: holonData.id, setting: settingModalType, newValue })
                    .then(res => {
                        if (res.data !== 'success') { 
                            setError(true)
                            setErrorMessage(res.data)
                        }
                        else { setSettingModalOpen(false); setTimeout(() => { getHolonData() }, 500)  }
                    })
            }
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeButton}
                    src="/icons/close-01.svg"
                    onClick={() => setSettingModalOpen(false)}
                />
                <span className={styles.title}>{title}</span>
                <span className={styles.subTitle}>{subTitle}</span>
                <form className={styles.form}  onSubmit={saveNewValue}>
                    {settingModalType !== 'change-holon-description' &&
                        <input 
                            className={`wecoInput mb-10 mr-10 ${error && 'error'}`}
                            placeholder={placeholder}
                            type="text" value={newValue}
                            onChange={(e) => { setNewValue(e.target.value); setError(false) }}
                        />
                    }
                    {settingModalType === 'change-holon-description' &&
                        <textarea 
                            className={`wecoInput mb-10 mr-10 ${error && 'error'}`}
                            style={{ height:'auto', paddingTop:10 }}
                            placeholder="Description" rows="3"
                            type="text" value={newValue}
                            onChange={(e) => { setNewValue(e.target.value); setError(false) }}
                        />
                    }
                    <button className="wecoButton">Update</button>
                </form>
                {error && <span className={styles.errorMessage}>{errorMessage}</span>}
            </div>
        </div>
    )
}

export default SettingModal

{/* <span className={styles.flashMessage}>[flashMessage]</span> */}

    // const { accountData, getAccountData, setCreateHolonModalOpen } = useContext(AccountContext)
    // const { holonData, getHolonData, getHolonSpaces } = useContext(HolonContext)
    
    // const [name, setName] = useState('')
    // const [handle, setHandle] = useState('')
    // const [description, setDescription] = useState('')
    // const [nameError, setNameError] = useState(false)
    // const [handleError, setHandleError] = useState(false)
    // const [descriptionError, setDescriptionError] = useState(false)
    // const [flashMessage, setFlashMessage] = useState('')

    // function publishHolon(e) {
    //     e.preventDefault()
    //     let invalidHandle = handle.length === 0 || handle.length > 15
    //     let invalidName = name.length === 0 || name.length > 25
    //     let invalidDescription = description.length === 0 || description.length > 10000
    //     if (invalidHandle) { setHandleError(true); setFlashMessage('Invalid handle') }
    //     if (invalidName) { setNameError(true); setFlashMessage('Invalid name') }
    //     if (invalidDescription) { setDescriptionError(true); setFlashMessage('Invalid description') }
    //     if (!invalidHandle && !invalidName && !invalidDescription) {
    //         const data = { creatorId: accountData.id, handle, name, description, parentHolonId: holonData.id }
    //         axios.post(config.environmentURL + `/create-holon`, data)
    //             .then(res => {
    //                 if (res.data === 'holon-handle-taken') { setHandleError(true); setFlashMessage('Holon handle already taken') }
    //                 if (res.data === 'success') { // TODO: work out why getAccountData() is not recieving new ModeratedHolons
    //                     setCreateHolonModalOpen(false)
    //                     getAccountData()
    //                     setTimeout(() => { getHolonSpaces() }, 900)
    //                     // const a = setCreateHolonModalOpen(false)
    //                     // Promise.all([a]).then(() => setTimeout(() => { getAccountData() }, 200)).then(() => getHolonData())
    //                 }
    //             })
    //     }
    // }

//     <input 
//     className={`wecoInput mb-10 ${nameError && 'error'}`}
//     placeholder="Name"
//     type="text" value={ name }
//     onChange={(e) => { setName(e.target.value); setNameError(false); setFlashMessage('') }}
// />
// <textarea 
//     className={`wecoInput mb-10 ${descriptionError && 'error'}`}
//     style={{ height:'auto', paddingTop:10 }}
//     placeholder="Description" rows="3"
//     type="text" value={ description }
//     onChange={(e) => { setDescription(e.target.value); setDescriptionError(false); setFlashMessage('') }}
// />
// <span className={styles.text}>You will be the default moderator. Navigate to the space while logged in to this account to access its settings.</span>