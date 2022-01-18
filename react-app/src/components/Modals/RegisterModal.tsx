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

const RegisterModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { setLogInModalOpen } = useContext(AccountContext)
    const { executeRecaptcha } = useGoogleReCaptcha()

    type InputState = 'default' | 'valid' | 'invalid'

    const [handle, setHandle] = useState('')
    const [handleState, setHandleState] = useState<InputState>('default')
    const [handleErrors, setHandleErrors] = useState<string[]>([])

    const [name, setName] = useState('')
    const [nameState, setNameState] = useState<InputState>('default')
    const [nameErrors, setNameErrors] = useState<string[]>([])

    const [email, setEmail] = useState('')
    const [emailState, setEmailState] = useState<InputState>('default')
    const [emailErrors, setEmailErrors] = useState<string[]>([])

    const [password, setPassword] = useState('')
    const [passwordState, setPasswordState] = useState<InputState>('default')
    const [passwordErrors, setPasswordErrors] = useState<string[]>([])

    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordState, setConfirmPasswordState] = useState<InputState>('default')
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string[]>([])

    const [generalErrorMessages, setGeneralErrorMessages] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    const errors =
        nameState === 'invalid' ||
        handleState === 'invalid' ||
        emailState === 'invalid' ||
        passwordState === 'invalid' ||
        confirmPasswordState === 'invalid'

    function register(e) {
        e.preventDefault()
        const invalidHandle = handle.length < 1 || handle.length > 30
        const invalidName = name.length < 1 || name.length > 30
        const invalidEmail = email.length < 1
        const invalidPassword = password.length < 1
        const invalidConfirmPassword = confirmPassword.length < 1 || confirmPassword !== password
        setHandleState(invalidHandle ? 'invalid' : 'valid')
        setHandleErrors(invalidHandle ? ['Must be between 1 and 30 characters.'] : [])
        setNameState(invalidName ? 'invalid' : 'valid')
        setNameErrors(invalidName ? ['Must be between 1 and 30 characters.'] : [])
        setEmailState(invalidEmail ? 'invalid' : 'valid')
        setEmailErrors(invalidEmail ? ['Required'] : [])
        setPasswordState(invalidPassword ? 'invalid' : 'valid')
        setPasswordErrors(invalidPassword ? ['Required'] : [])
        setConfirmPasswordState(invalidConfirmPassword ? 'invalid' : 'valid')
        setConfirmPasswordErrors(invalidConfirmPassword ? ['Must match password'] : [])
        if (
            !invalidHandle &&
            !invalidName &&
            !invalidEmail &&
            !invalidPassword &&
            !invalidConfirmPassword
        ) {
            setLoading(true)
            executeRecaptcha('register').then((reCaptchaToken) => {
                const data = { reCaptchaToken, handle, name, email, password }
                axios
                    .post(`${config.apiURL}/register`, data)
                    .then(() => {
                        setLoading(false)
                        setShowSuccessMessage(true)
                        // setTimeout(() => close(), 1000)
                    })
                    .catch((error) => {
                        setLoading(false)
                        switch (error.response.data.message) {
                            case 'Recaptcha request failed':
                                setGeneralErrorMessages(['Recaptcha request failed'])
                                break
                            case 'Recaptcha score < 0.5':
                                setGeneralErrorMessages(['Recaptcha score < 0.5'])
                                break
                            case 'Handle already taken':
                                setHandleState('invalid')
                                setHandleErrors(['Already taken'])
                                break
                            case 'Email already taken':
                                setEmailState('invalid')
                                setEmailErrors(['Already taken'])
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
            <h1>Create a new account</h1>
            <form onSubmit={register}>
                <Input
                    type='text'
                    title='Handle (the unique identifier used in your profiles url)'
                    prefix='weco.io/u/'
                    placeholder='handle...'
                    style={{ marginBottom: 10 }}
                    state={handleState}
                    errors={handleErrors}
                    value={handle}
                    onChange={(newValue) => {
                        setHandleState('default')
                        setHandle(newValue.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                    }}
                />
                <Input
                    type='text'
                    title='Name (max 30 characters)'
                    placeholder='name...'
                    style={{ marginBottom: 10 }}
                    state={nameState}
                    errors={nameErrors}
                    value={name}
                    onChange={(newValue) => {
                        setNameState('default')
                        setName(newValue)
                    }}
                />
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
                <Input
                    type='password'
                    title='Password'
                    placeholder='password...'
                    style={{ marginBottom: 10 }}
                    state={passwordState}
                    errors={passwordErrors}
                    value={password}
                    onChange={(newValue) => {
                        setPasswordState('default')
                        setPassword(newValue)
                    }}
                />
                <Input
                    type='password'
                    title='Confirm password'
                    placeholder='password...'
                    style={{ marginBottom: 10 }}
                    state={confirmPasswordState}
                    errors={confirmPasswordErrors}
                    value={confirmPassword}
                    onChange={(newValue) => {
                        setConfirmPasswordState('default')
                        setConfirmPassword(newValue)
                    }}
                />
                <Button
                    text='Create account'
                    color='blue'
                    style={{ margin: '20px 0 20px 0' }}
                    disabled={loading || showSuccessMessage || errors}
                    submit
                />
                {loading && <LoadingWheel />}
                {showSuccessMessage && (
                    <SuccessMessage text="Success! We've sent you an email. Follow the instructions there to complete the registration process." />
                )}
                <p>
                    Already registered?{' '}
                    <button
                        type='button'
                        className={styles.textButton}
                        onClick={() => {
                            setLogInModalOpen(true)
                            close()
                        }}
                    >
                        Log in
                    </button>
                </p>
            </form>
        </Modal>
    )
}

export default RegisterModal
