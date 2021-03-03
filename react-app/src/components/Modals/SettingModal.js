import React, { useContext, useState, useEffect, useRef } from 'react'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/SettingModal.module.scss'
import { resizeTextArea } from '../../GlobalFunctions'
import CloseButton from '../CloseButton'

function SettingModal() {
    const { settingModalType, setSettingModalOpen, accountData, getAccountData, setAccountContextLoading } = useContext(AccountContext)
    const { getUserData } = useContext(UserContext)
    const { holonData, getHolonData, setHolonHandle } = useContext(HolonContext)
    const [newValue, setNewValue] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const history = useHistory()

    let title, subTitle, placeholder, invalidValue

    // holon settings
    if (settingModalType === 'change-holon-handle') { 
        title = `Change the unique handle for ${holonData.name}`
        //subTitle = `The current handle is: "${holonData.handle}"`
        placeholder = 'New handle (max 30 characters)'
        invalidValue = newValue.length < 1 || newValue.length > 30
    }
    if (settingModalType === 'change-holon-name') {
        title = `Change the name for ${holonData.name}`
        //subTitle = `The current name is: "${holonData.name}"`
        placeholder = 'New name (max 30 characters)'
        invalidValue = newValue.length < 1 || newValue.length > 30
    }
    if (settingModalType === 'change-holon-description') {
        title = `Change the description for '${holonData.name}'`
        //subTitle = `The current description is: "${holonData.description}"`
        placeholder = 'New description (max 10K characters)'
        invalidValue = newValue.length < 1 || newValue.length > 10000
    }
    if (settingModalType === 'add-new-holon-moderator') {
        title = `Add a new moderator to ${holonData.name}`
        subTitle = `Paste their unique handle below`
        placeholder = 'New moderators handle'
    }
    if (settingModalType === 'add-parent-holon') {
        title = `Add ${holonData.name} to a new parent space`
        subTitle = `Paste the handle of the new parent space below`
        placeholder = 'New parent space handle'
    }
    if (settingModalType === 'remove-parent-holon') {
        title = `Remove ${holonData.name} from one of its parent spaces`
        subTitle = `Paste the handle of the parent space you want to remove ${holonData.name} from`
        placeholder = 'Parent space handle'
    }

    // user settings
    if (settingModalType === 'change-user-name') {
        title = `Change your account name`
        subTitle = `Your current name is: ${accountData.name}`
        placeholder = 'New name (max 30 characters)'
        invalidValue = newValue.length < 1 || newValue.length > 30
    }
    if (settingModalType === 'change-user-bio') {
        title = `Change your bio`
        //subTitle = `Your current bio is: ${accountData.bio}`
        placeholder = 'New bio (max 10K characters)'
        invalidValue = newValue.length < 1 || newValue.length > 10000
    }

    const holonDescriptionText = useRef()

    useEffect(() => {
        if (settingModalType === 'change-holon-description') {
            holonDescriptionText.current.innerText = holonData.description
            resizeTextArea(holonDescriptionText.current)
        }
        if (settingModalType === 'change-user-bio') {
            //textArea.current.innerText = accountData.bio
        }
        
    }, [holonData])

    function saveNewValue(e) {
        e.preventDefault()
        if (invalidValue) { setError(true) }
        else {
            if (settingModalType.includes('holon')) {
                console.log()
                axios
                    .post(config.apiURL + '/update-holon-setting', { accountId: accountData.id, holonId: holonData.id, setting: settingModalType, newValue })
                    .then(res => {
                        if (res.data === 'success') {
                            if (settingModalType === 'change-holon-handle') {
                                history.push(`/s/${newValue}/settings`)
                                setTimeout(() => { setHolonHandle(newValue); setAccountContextLoading(false); getAccountData() }, 500)
                                setSettingModalOpen(false)
                            } else {
                                setSettingModalOpen(false); setTimeout(() => { getHolonData() }, 500)
                            }
                        }
                        if (res.data === 'attached-by-mod') {
                            setSuccessMessage(`Success! Your new space has been created and attached to '${newValue}'`)
                            setTimeout(() => { getHolonData() }, 500)
                        }
                        if (res.data === 'pending-acceptance') {
                            setSuccessMessage(`Success! A request has been sent to the spaces moderators.`)
                        }
                    })
            }
            if (settingModalType.includes('user')) {
                axios
                    .post(config.apiURL + '/update-user-setting', { accountId: accountData.id, setting: settingModalType, newValue })
                    .then(res => {
                        if (res.data === 'success') {
                            setSettingModalOpen(false)
                            setTimeout(() => {
                                getAccountData()
                                getUserData()
                            }, 500)
                        }
                    })
            }

        }
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setSettingModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            {/* TODO: split into sections for each setting type then remove conditionals from above */}
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setSettingModalOpen(false)}/>
                {successMessage.length < 1 && <>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.subTitle}>{subTitle}</span>
                    <form className={styles.form} onSubmit={saveNewValue}>
                        {settingModalType !== 'change-holon-description' && settingModalType !== 'change-holon-handle' &&
                            <input 
                                className={`wecoInput mb-10 mr-10 ${error && 'error'}`}
                                placeholder={placeholder}
                                type="text" value={newValue}
                                onChange={(e) => { setNewValue(e.target.value); setError(false) }}
                            />
                        }
                        {settingModalType === 'change-holon-handle' &&
                            <input 
                                className={`wecoInput mb-10 mr-10 ${error && 'error'}`}
                                placeholder={placeholder}
                                type="text" value={newValue}
                                onChange={(e) => {
                                    setNewValue(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                                    setError(false)
                                }}
                            />
                        }
                        {settingModalType === 'change-holon-description' &&
                            <textarea
                                ref={holonDescriptionText}
                                className={`${styles.input} mb-10 mr-10 ${error && styles.error}`}
                                style={{ height:'auto', paddingTop:10 }}
                                placeholder="Description" rows="1"
                                type="text" value={newValue}
                                onChange={(e) => { setNewValue(e.target.value); setError(false); resizeTextArea(e.target) }}
                            />
                        }
                        <button className="wecoButton">Update</button>
                    </form>
                    {error && <span className={styles.errorMessage}>{errorMessage}</span>}
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
    //         axios.post(config.apiURL + `/create-holon`, data)
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