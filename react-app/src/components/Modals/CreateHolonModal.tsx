import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/CreateHolonModal.module.scss'
import CloseOnClickOutside from '../CloseOnClickOutside'
import CloseButton from '../CloseButton'

const CreateHolonModal = (): JSX.Element => {
    const { accountData, setCreateHolonModalOpen } = useContext(AccountContext)
    const { spaceData, getSpaceSpaces } = useContext(SpaceContext)

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
        const invalidHandle = handle.length < 1 || handle.length > 30
        const invalidName = name.length < 1 || name.length > 30
        const invalidDescription = description.length < 1 || description.length > 10000
        if (invalidHandle) {
            setHandleError(true)
            setFlashMessage('Invalid handle')
        }
        if (invalidName) {
            setNameError(true)
            setFlashMessage('Invalid name')
        }
        if (invalidDescription) {
            setDescriptionError(true)
            setFlashMessage('Invalid description')
        }
        if (!invalidHandle && !invalidName && !invalidDescription) {
            const data = {
                creatorId: accountData.id,
                handle,
                name,
                description,
                parentHolonId: spaceData.id,
            }
            axios.post(`${config.apiURL}/create-holon`, data).then((res) => {
                if (res.data === 'holon-handle-taken') {
                    setHandleError(true)
                    setFlashMessage('Holon handle already taken')
                }
                if (res.data === 'attached-to-all' || res.data === 'attached-by-mod') {
                    setSuccessMessage(
                        `Success! Your new space has been created and attached to '${spaceData.name}'`
                    )
                    setTimeout(() => {
                        getSpaceSpaces()
                    }, 500)
                }
                if (res.data === 'pending-acceptance') {
                    setSuccessMessage(
                        `Success! A request has been sent to the spaces moderators. Until they accept it, your space will appear in 'all'.`
                    )
                }
            })
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={() => setCreateHolonModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setCreateHolonModalOpen(false)} />
                    {successMessage.length < 1 && (
                        <>
                            <span className={styles.title}>
                                {`Create a new space in '${spaceData.name}'`}
                            </span>
                            <span className={styles.flashMessage}>{flashMessage}</span>
                            <form className={styles.form} onSubmit={createHolon}>
                                <input
                                    className={`wecoInput mb-10 ${handleError && 'error'}`}
                                    placeholder='Handle (must be unique)'
                                    type='text'
                                    value={handle}
                                    onChange={(e) => {
                                        setHandle(
                                            e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                                        )
                                        setHandleError(false)
                                        setFlashMessage('')
                                    }}
                                />
                                <input
                                    className={`wecoInput mb-10 ${nameError && 'error'}`}
                                    placeholder='Name'
                                    type='text'
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        setNameError(false)
                                        setFlashMessage('')
                                    }}
                                />
                                <textarea
                                    className={`wecoInput mb-10 ${descriptionError && 'error'}`}
                                    style={{ height: 'auto', paddingTop: 10 }}
                                    placeholder='Description'
                                    rows={3}
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                        setDescriptionError(false)
                                        setFlashMessage('')
                                    }}
                                />
                                <span className={styles.text}>
                                    You will be the default moderator. Navigate to the space while
                                    logged in with this account to access its settings.
                                </span>
                                <button type='submit' className='wecoButton'>
                                    Create Space
                                </button>
                            </form>
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

export default CreateHolonModal
