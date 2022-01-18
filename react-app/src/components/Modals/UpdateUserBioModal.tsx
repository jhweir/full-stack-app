import React, { useContext, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import styles from '@styles/components/Modal.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { UserContext } from '@contexts/UserContext'
import Modal from '@components/Modal'
import Input from '@components/Input'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'

const UpdateUserBioModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { accountData, setAccountData } = useContext(AccountContext)
    const { userData, setUserData } = useContext(UserContext)
    const [inputValue, setInputValue] = useState(accountData.bio || '')
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()

    function updateUserBio(e) {
        e.preventDefault()
        const unChanged = inputValue === accountData.bio
        const invalid = inputValue.length < 1 || inputValue.length > 10000
        if (unChanged) {
            setInputState('invalid')
            setInputErrors(['Unchanged from previous bio'])
        } else if (invalid) {
            setInputState('invalid')
            setInputErrors(['Must be between 1 and 10K characters'])
        } else {
            setInputState('valid')
            setLoading(true)
            const data = { payload: inputValue }
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios.post(`${config.apiURL}/update-account-bio`, data, authHeader).then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        setInputState('invalid')
                        setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'unauthorized':
                        setInputState('invalid')
                        setInputErrors([
                            `Unauthorized. You must be the owner of the account to complete this action.`,
                        ])
                        break
                    case 'success':
                        setAccountData({ ...accountData, bio: inputValue })
                        setUserData({ ...userData, bio: inputValue })
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
            <h1>Change your account bio</h1>
            <p>
                <a href='https://www.markdownguide.org/cheat-sheet/'>Markdown</a> enabled
            </p>
            <form onSubmit={updateUserBio}>
                <Input
                    type='text-area'
                    rows={5}
                    title='New bio:'
                    placeholder='bio...'
                    state={inputState}
                    errors={inputErrors}
                    value={inputValue}
                    onChange={(newValue) => {
                        setInputState('default')
                        setInputValue(newValue)
                    }}
                />
                <div className={styles.footer}>
                    {!showSuccessMessage && (
                        <Button
                            text='Save'
                            color='blue'
                            style={{ marginRight: 10 }}
                            disabled={loading || inputState === 'invalid'}
                            submit
                        />
                    )}
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='New bio saved!' />}
                </div>
            </form>
        </Modal>
    )
}

export default UpdateUserBioModal
