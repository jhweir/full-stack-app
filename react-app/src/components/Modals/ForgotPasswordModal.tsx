import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import config from '@src/Config'
import styles from '@styles/components/Modal.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import Modal from '@components/Modal'
import Input from '@components/Input'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'

const ForgotPasswordModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { getAccountData, setLogInModalOpen } = useContext(AccountContext)
    const { executeRecaptcha } = useGoogleReCaptcha()

    type InputState = 'default' | 'valid' | 'invalid'

    const [email, setEmail] = useState('')
    const [emailState, setEmailState] = useState<InputState>('default')
    const [emailErrors, setEmailErrors] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    function sendResetLink(e) {
        e.preventDefault()
        // todo: add email regex
        const invalidEmail = email.length < 1
        setEmailState(invalidEmail ? 'invalid' : 'valid')
        setEmailErrors(invalidEmail ? ['Required'] : [])
        if (!invalidEmail) {
            setLoading(true)
            executeRecaptcha('resetPasswordRequest').then((reCaptchaToken) => {
                const data = { reCaptchaToken, email }
                axios
                    .post(`${config.apiURL}/reset-password-request`, data)
                    .then(() => {
                        setLoading(false)
                        setShowSuccessMessage(true)
                        // setTimeout(() => close(), 1000)
                    })
                    .catch((error) => {
                        setLoading(false)
                        const { message } = error.response.data
                        console.log(error.response.data)
                        switch (message) {
                            case 'User not found':
                                setEmailState('invalid')
                                setEmailErrors([message])
                                break
                            default:
                                break
                        }
                    })
            })
        }
    }

    useEffect(() => {
        // make recaptcha flag visible
        const recaptchaBadge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement
        recaptchaBadge.style.visibility = 'visible'
        return () => {
            recaptchaBadge.style.visibility = 'hidden'
        }
    })

    return (
        <Modal close={close} style={{ minWidth: 350 }} centered>
            <h1>Reset password</h1>
            <form onSubmit={sendResetLink}>
                <Input
                    type='email'
                    title='Email'
                    placeholder='email...'
                    style={{ marginBottom: 10 }}
                    state={emailState}
                    errors={emailErrors}
                    value={email}
                    onChange={(newValue) => {
                        setEmailState('default')
                        setEmail(newValue)
                    }}
                />
                <Button
                    text='Send reset link'
                    colour='blue'
                    style={{ margin: '20px 0 20px 0' }}
                    disabled={loading || showSuccessMessage || emailState === 'invalid'}
                    submit
                />
                {loading && <LoadingWheel />}
                {showSuccessMessage && (
                    <SuccessMessage text="Success! We've sent you an email with a link to reset your password." />
                )}
                <p>
                    <button
                        type='button'
                        className={styles.textButton}
                        onClick={() => {
                            setLogInModalOpen(true)
                            close()
                        }}
                    >
                        Return to log in
                    </button>
                </p>
            </form>
        </Modal>
    )
}

export default ForgotPasswordModal
