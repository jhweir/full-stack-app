import React, { useContext, useState } from 'react'
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

const UpdateSpaceDescriptionModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData, setSpaceData } = useContext(SpaceContext)
    const [inputValue, setInputValue] = useState(spaceData.description || '')
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()

    function updateSpaceDescription(e) {
        e.preventDefault()
        const unChanged = inputValue === spaceData.description
        const invalid = inputValue.length < 1 || inputValue.length > 10000
        if (unChanged) {
            setInputState('invalid')
            setInputErrors(['Unchanged from previous description'])
        } else if (invalid) {
            setInputState('invalid')
            setInputErrors(['Must be between 1 and 10K characters'])
        } else {
            setInputState('valid')
            setLoading(true)
            const data = { spaceId: spaceData.id, payload: inputValue }
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/update-space-description`, data, authHeader)
                .then((res) => {
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
                        case 'success':
                            setSpaceData({ ...spaceData, description: inputValue })
                            setShowSuccessMessage(true)
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
            <h1>Change the description for {spaceData.name}</h1>
            <p>
                <a href='https://www.markdownguide.org/cheat-sheet/'>Markdown</a> enabled
            </p>
            <form onSubmit={updateSpaceDescription}>
                <Input
                    type='text-area'
                    rows={5}
                    title='New description:'
                    placeholder='description...'
                    state={inputState}
                    errors={inputErrors}
                    value={inputValue}
                    onChange={(newValue) => {
                        setInputState('default')
                        setInputValue(newValue)
                    }}
                />
                <div className={styles.footer}>
                    <Button
                        text='Save'
                        colour='blue'
                        size='medium'
                        margin='0 10px 0 0'
                        disabled={loading || showSuccessMessage || inputState === 'invalid'}
                        submit
                    />
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='New description saved!' />}
                </div>
            </form>
        </Modal>
    )
}

export default UpdateSpaceDescriptionModal
