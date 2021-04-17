import React, { useContext, useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/SettingModal.module.scss'
import { resizeTextArea } from '../../Functions'
import CloseButton from '../CloseButton'
import CloseOnClickOutside from '../CloseOnClickOutside'

const SettingModal = (): JSX.Element => {
    const {
        settingModalType,
        setSettingModalOpen,
        accountData,
        getAccountData,
        setAccountContextLoading,
    } = useContext(AccountContext)
    const { getUserData } = useContext(UserContext)
    const { spaceData, getSpaceData, setSpaceHandle } = useContext(SpaceContext)
    const [newValue, setNewValue] = useState('')
    const [error, setError] = useState(false)
    // const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const history = useHistory()
    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')

    let title
    let subTitle
    let placeholder
    let invalidValue

    // holon settings
    if (settingModalType === 'change-holon-handle') {
        title = `Change the unique handle for ${spaceData.name}`
        // subTitle = `The current handle is: "${spaceData.handle}"`
        placeholder = 'New handle (max 30 characters)'
        invalidValue = newValue.length < 1 || newValue.length > 30
    }
    if (settingModalType === 'change-holon-name') {
        title = `Change the name for ${spaceData.name}`
        // subTitle = `The current name is: "${spaceData.name}"`
        placeholder = 'New name (max 30 characters)'
        invalidValue = newValue.length < 1 || newValue.length > 30
    }
    if (settingModalType === 'change-holon-description') {
        title = `Change the description for '${spaceData.name}'`
        // subTitle = `The current description is: "${spaceData.description}"`
        placeholder = 'New description (max 10K characters)'
        invalidValue = newValue.length < 1 || newValue.length > 10000
    }
    if (settingModalType === 'add-new-holon-moderator') {
        title = `Add a new moderator to ${spaceData.name}`
        subTitle = `Paste their unique handle below`
        placeholder = 'New moderators handle'
    }
    if (settingModalType === 'add-parent-holon') {
        title = `Add ${spaceData.name} to a new parent space`
        subTitle = `Paste the handle of the new parent space below`
        placeholder = 'New parent space handle'
    }
    if (settingModalType === 'remove-parent-holon') {
        title = `Remove ${spaceData.name} from one of its parent spaces`
        subTitle = `Paste the handle of the parent space you want to remove ${spaceData.name} from`
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
        // subTitle = `Your current bio is: ${accountData.bio}`
        placeholder = 'New bio (max 10K characters)'
        invalidValue = newValue.length < 1 || newValue.length > 10000
    }

    const holonDescriptionText = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const { current } = holonDescriptionText
        if (current && spaceData.description && settingModalType === 'change-holon-description') {
            current.innerText = spaceData.description
            resizeTextArea(current)
        }
        if (settingModalType === 'change-user-bio') {
            // textArea.current.innerText = accountData.bio
        }
    }, [spaceData])

    function saveNewValue(e) {
        e.preventDefault()
        if (invalidValue) setError(true)
        else if (accessToken) {
            if (settingModalType.includes('holon')) {
                axios
                    .post(`${config.apiURL}/update-holon-setting`, {
                        accountId: accountData.id,
                        holonId: spaceData.id,
                        setting: settingModalType,
                        newValue,
                    })
                    .then((res) => {
                        if (res.data === 'success') {
                            if (settingModalType === 'change-holon-handle') {
                                history.push(`/s/${newValue}/settings`)
                                setTimeout(() => {
                                    setSpaceHandle(newValue)
                                    setAccountContextLoading(false)
                                    getAccountData()
                                }, 500)
                                setSettingModalOpen(false)
                            } else {
                                setSettingModalOpen(false)
                                setTimeout(() => {
                                    getSpaceData()
                                }, 500)
                            }
                        }
                        if (res.data === 'attached-by-mod') {
                            setSuccessMessage(
                                `Success! Your new space has been created and attached to '${newValue}'`
                            )
                            setTimeout(() => {
                                getSpaceData()
                            }, 500)
                        }
                        if (res.data === 'pending-acceptance') {
                            setSuccessMessage(
                                `Success! A request has been sent to the spaces moderators.`
                            )
                        }
                    })
            }
            if (settingModalType.includes('user')) {
                axios
                    .post(
                        `${config.apiURL}/update-account-setting`,
                        { setting: settingModalType, newValue },
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    )
                    .then((res) => {
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

    return (
        <div className={styles.modalWrapper}>
            {/* TODO: split into sections for each setting type then remove conditionals from above */}
            <CloseOnClickOutside onClick={() => setSettingModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setSettingModalOpen(false)} />
                    {successMessage.length < 1 && (
                        <>
                            <span className={styles.title}>{title}</span>
                            <span className={styles.subTitle}>{subTitle}</span>
                            <form className={styles.form} onSubmit={saveNewValue}>
                                {settingModalType !== 'change-holon-description' &&
                                    settingModalType !== 'change-holon-handle' && (
                                        <input
                                            className={`wecoInput mb-10 mr-10 ${error && 'error'}`}
                                            placeholder={placeholder}
                                            type='text'
                                            value={newValue}
                                            onChange={(e) => {
                                                setNewValue(e.target.value)
                                                setError(false)
                                            }}
                                        />
                                    )}
                                {settingModalType === 'change-holon-handle' && (
                                    <input
                                        className={`wecoInput mb-10 mr-10 ${error && 'error'}`}
                                        placeholder={placeholder}
                                        type='text'
                                        value={newValue}
                                        onChange={(e) => {
                                            setNewValue(
                                                e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]/g, '-')
                                            )
                                            setError(false)
                                        }}
                                    />
                                )}
                                {settingModalType === 'change-holon-description' && (
                                    <textarea
                                        ref={holonDescriptionText}
                                        className={`${styles.input} mb-10 mr-10 ${
                                            error && styles.error
                                        }`}
                                        style={{ height: 'auto', paddingTop: 10 }}
                                        placeholder='Description'
                                        rows={1}
                                        value={newValue}
                                        onChange={(e) => {
                                            setNewValue(e.target.value)
                                            setError(false)
                                            resizeTextArea(e.target)
                                        }}
                                    />
                                )}
                                <button type='submit' className='wecoButton'>
                                    Update
                                </button>
                            </form>
                            {/* {error && <span className={styles.errorMessage}>{errorMessage}</span>} */}
                        </>
                    )}
                    {successMessage.length > 0 && (
                        <div className={styles.success}>
                            <img
                                className={styles.checkIcon}
                                src='/icons/check-circle-regular.svg'
                                alt=''
                            />
                            <span className={styles.successMessage}>{successMessage}</span>
                        </div>
                    )}
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default SettingModal

/* <span className={styles.flashMessage}>[flashMessage]</span> */

// const { accountData, getAccountData, setCreateHolonModalOpen } = useContext(AccountContext)
// const { spaceData, getSpaceData, getSpaceSpaces } = useContext(SpaceContext)

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
//         const data = { creatorId: accountData.id, handle, name, description, parentHolonId: spaceData.id }
//         axios.post(config.apiURL + `/create-holon`, data)
//             .then(res => {
//                 if (res.data === 'holon-handle-taken') { setHandleError(true); setFlashMessage('Holon handle already taken') }
//                 if (res.data === 'success') { // TODO: work out why getAccountData() is not recieving new ModeratedHolons
//                     setCreateHolonModalOpen(false)
//                     getAccountData()
//                     setTimeout(() => { getSpaceSpaces() }, 900)
//                     // const a = setCreateHolonModalOpen(false)
//                     // Promise.all([a]).then(() => setTimeout(() => { getAccountData() }, 200)).then(() => getSpaceData())
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
