import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import styles from '@styles/components/Modal.module.scss'
import { SpaceContext } from '@contexts/SpaceContext'
import Modal from '@components/Modal'
import Input from '@components/Input'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'

const UpdateSpaceHandleModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData } = useContext(SpaceContext)
    const [inputValue, setInputValue] = useState(spaceData.handle || '')
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const history = useHistory()
    const cookies = new Cookies()

    function updateSpaceHandle(e) {
        e.preventDefault()
        const unChanged = inputValue === spaceData.handle
        const invalid = inputValue.length < 1 || inputValue.length > 30
        if (unChanged) {
            setInputState('invalid')
            setInputErrors([`Already saved as '${inputValue}'`])
        } else if (invalid) {
            setInputState('invalid')
            setInputErrors(['Must be between 1 and 30 characters'])
        } else {
            setInputState('valid')
            setLoading(true)
            const data = { spaceId: spaceData.id, payload: inputValue }
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios.post(`${config.apiURL}/update-space-handle`, data, authHeader).then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        setInputState('invalid')
                        setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'unauthorized':
                        setInputState('invalid')
                        setInputErrors([
                            `Unauthorized. You must be a moderator of ${spaceData.name} to complete this action.`,
                        ])
                        break
                    case 'handle-taken':
                        setInputState('invalid')
                        setInputErrors(['Handle already taken'])
                        break
                    case 'success':
                        setShowSuccessMessage(true)
                        history.push(`/s/${inputValue}/settings`)
                        setTimeout(() => close(), 3000)
                        break
                    default:
                        break
                }
            })
        }
    }

    return (
        <Modal close={close}>
            <h1>Change the handle for {spaceData.name}</h1>
            <p>This is the unique identifier that&apos;s used in the space&apos;s url</p>
            <form onSubmit={updateSpaceHandle}>
                <Input
                    type='text'
                    title='New handle:'
                    prefix='weco.io/s/'
                    placeholder='handle...'
                    errors={inputErrors}
                    state={inputState}
                    value={inputValue}
                    onChange={(newValue) => {
                        setInputState('default')
                        setInputValue(newValue.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                    }}
                />
                <div className={styles.footer}>
                    <Button
                        text='Save'
                        colour='blue'
                        style={{ marginRight: 10 }}
                        disabled={loading || showSuccessMessage || inputState === 'invalid'}
                        submit
                    />
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='New handle saved!' />}
                </div>
            </form>
        </Modal>
    )
}

export default UpdateSpaceHandleModal
