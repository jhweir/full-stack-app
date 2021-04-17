import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import config from '../../Config'
import styles from '../../styles/components/AuthModal.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import CloseOnClickOutside from '../CloseOnClickOutside'
import CloseButton from '../CloseButton'

const AuthModal = (): JSX.Element => {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const { getAccountData, setAuthModalOpen } = useContext(AccountContext)

    const [display, setDisplay] = useState('log-in')

    // log in
    const [emailOrHandle, setEmailOrHandle] = useState('')
    const [password, setPassword] = useState('')
    const [emailOrHandleError, setEmailOrHandleError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [logInFlashMessage, setLogInFlashMessage] = useState('')
    const [displayResendVerificationEmailLink, setDisplayResendVerificationEmailLink] = useState(
        false
    )
    const [verificationEmailUserId, setVerificationEmailUserId] = useState(null)

    // register
    const [newHandle, setNewHandle] = useState('')
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordTwo, setNewPasswordTwo] = useState('')
    const [newHandleError, setNewHandleError] = useState(false)
    const [newNameError, setNewNameError] = useState(false)
    const [newEmailError, setNewEmailError] = useState(false)
    const [newPasswordError, setNewPasswordError] = useState(false)
    const [newPasswordTwoError, setNewPasswordTwoError] = useState(false)
    const [registerFlashMessage, setRegisterFlashMessage] = useState('')

    // forgot password
    const [resetEmail, setResetEmail] = useState('')
    const [resetEmailError, setResetEmailError] = useState(false)
    const [forgotPasswordFlashMessage, setForgotPasswordFlashMessage] = useState('')

    function logIn(e) {
        e.preventDefault()
        const invalidEmailOrHandle = emailOrHandle.length === 0
        const invalidPassword = password.length === 0
        if (invalidEmailOrHandle) {
            setEmailOrHandleError(true)
        } else if (invalidPassword) {
            setPasswordError(true)
        } else {
            executeRecaptcha('login').then((reCaptchaToken) => {
                axios
                    .post(`${config.apiURL}/log-in`, { reCaptchaToken, emailOrHandle, password })
                    .then((res) => {
                        document.cookie = `accessToken=${res.data}; path=/`
                        setAuthModalOpen(false)
                        getAccountData()
                    })
                    .catch((error) => {
                        const errorMessage = error.response.data.message
                        if (errorMessage === 'Email not yet verified') {
                            setDisplayResendVerificationEmailLink(true)
                            setVerificationEmailUserId(error.response.data.userId)
                        }
                        setLogInFlashMessage(errorMessage)
                    })
            })
        }
    }

    function resetRegistrationFields() {
        setNewHandle('')
        setNewName('')
        setNewEmail('')
        setNewPassword('')
        setNewPasswordTwo('')
    }

    function register(e) {
        e.preventDefault()
        const invalidHandle =
            newHandle.length === 0 || newHandle.length > 30 || newHandle.includes(' ')
        const invalidName = newName.length === 0 || newName.length > 30
        const invalidEmail = newEmail.length === 0 || newEmail.length > 500
        const invalidPassword = newPassword.length === 0
        const invalidPasswordTwo = newPasswordTwo !== newPassword
        if (invalidHandle) {
            setNewHandleError(true)
        } else if (invalidName) {
            setNewNameError(true)
        } else if (invalidEmail) {
            setNewEmailError(true)
        } else if (invalidPassword) {
            setNewPasswordError(true)
        } else if (invalidPasswordTwo) {
            setNewPasswordTwoError(true)
            setRegisterFlashMessage("Passwords don't match")
        } else {
            executeRecaptcha('register').then((reCaptchaToken) => {
                axios
                    .post(`${config.apiURL}/register`, {
                        reCaptchaToken,
                        newHandle,
                        newName,
                        newEmail,
                        newPassword,
                    })
                    .then((res) => {
                        if (res.data.message === 'Success') {
                            setRegisterFlashMessage(
                                "Success! We've sent you an email. Follow the instructions there to complete the registration process."
                            )
                            resetRegistrationFields()
                        }
                    })
                    .catch((error) => {
                        const errorMessage = error.response.data.message
                        if (
                            errorMessage === 'Recaptcha request failed' ||
                            errorMessage === 'Recaptcha score < 0.5'
                        ) {
                            setRegisterFlashMessage(errorMessage)
                        }
                        if (errorMessage === 'Handle already taken') {
                            setRegisterFlashMessage(errorMessage)
                            setNewHandleError(true)
                        }
                        if (errorMessage === 'Email already taken') {
                            setRegisterFlashMessage(errorMessage)
                            setNewEmailError(true)
                        }
                    })
            })
        }
    }

    function sendResetLink(e) {
        e.preventDefault()
        // todo: add proper regex email validation
        const invalidResetEmail = resetEmail.length === 0
        if (invalidResetEmail) setResetEmailError(true)
        else {
            executeRecaptcha('reset-password-request').then((reCaptchaToken) => {
                axios
                    .post(`${config.apiURL}/reset-password-request`, {
                        reCaptchaToken,
                        email: resetEmail,
                    })
                    .then((res) => {
                        if (res.data === 'user-not-found') {
                            setForgotPasswordFlashMessage('Account not found')
                        }
                        if (res.data === 'email-sent') {
                            setForgotPasswordFlashMessage(
                                `Success! We've sent you an email with a link to reset your password.`
                            )
                        }
                    })
            })
        }
    }

    function resendVerificationEmail() {
        axios
            .post(`${config.apiURL}/resend-verification-email`, { userId: verificationEmailUserId })
            .then((res) => {
                if (res.data === 'user-not-found') {
                    setLogInFlashMessage('Account not found')
                }
                if (res.data === 'success') {
                    setLogInFlashMessage(`Success! We've sent you a new verification email.`)
                    setDisplayResendVerificationEmailLink(false)
                }
            })
    }

    useEffect(() => {
        // set recaptcha flag visible while auth modal open
        const recaptchaBadge = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement
        recaptchaBadge.style.visibility = 'visible'
        return () => {
            recaptchaBadge.style.visibility = 'hidden'
        }
    })

    return (
        <div className={styles.authModalWrapper}>
            <CloseOnClickOutside onClick={() => setAuthModalOpen(false)}>
                <div className={styles.authModal}>
                    <CloseButton onClick={() => setAuthModalOpen(false)} />
                    {display === 'log-in' && (
                        <div className={styles.authModalColumn}>
                            <span className={styles.authModalTitle}>Log in</span>
                            <span className={styles.authModalFlashMessage}>
                                {logInFlashMessage}
                            </span>
                            {displayResendVerificationEmailLink && (
                                <span
                                    className='blueText mt-10 mb-10'
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => resendVerificationEmail()}
                                    onKeyDown={() => resendVerificationEmail()}
                                >
                                    Resend verification email
                                </span>
                            )}
                            <form className={styles.authModalForm} onSubmit={logIn}>
                                <input
                                    className={`wecoInput mb-10 ${emailOrHandleError && 'error'}`}
                                    placeholder='Email or Handle'
                                    type='text'
                                    value={emailOrHandle}
                                    onChange={(e) => {
                                        setEmailOrHandle(e.target.value)
                                        setEmailOrHandleError(false)
                                        setDisplayResendVerificationEmailLink(false)
                                        setLogInFlashMessage('')
                                    }}
                                />
                                <input
                                    className={`wecoInput mb-10 ${passwordError && 'error'}`}
                                    placeholder='Password'
                                    type='password'
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setPasswordError(false)
                                        setDisplayResendVerificationEmailLink(false)
                                        setLogInFlashMessage('')
                                    }}
                                />
                                <button type='submit' className='wecoButton w-100 mt-10 mb-20'>
                                    Log in
                                </button>
                                <span className='mb-10'>
                                    New?{' '}
                                    <button
                                        className={styles.blueText}
                                        type='button'
                                        tabIndex={0}
                                        onClick={() => setDisplay('create-new-account')}
                                        onKeyDown={() => setDisplay('create-new-account')}
                                    >
                                        Create a new account
                                    </button>
                                </span>
                                <button
                                    className={styles.blueText}
                                    type='button'
                                    tabIndex={0}
                                    onClick={() => setDisplay('forgot-password')}
                                    onKeyDown={() => setDisplay('forgot-password')}
                                >
                                    Forgot your password?
                                </button>
                            </form>
                        </div>
                    )}

                    {display === 'create-new-account' && (
                        <div className={styles.authModalColumn}>
                            <span className={styles.authModalTitle}>Create new account</span>
                            <span className={styles.authModalFlashMessage}>
                                {registerFlashMessage}
                            </span>
                            <form className={styles.authModalForm} onSubmit={register}>
                                <input
                                    className={`wecoInput mb-10 ${newHandleError && 'error'}`}
                                    placeholder='Handle (must be unique)'
                                    type='text'
                                    value={newHandle}
                                    onChange={(e) => {
                                        setNewHandle(
                                            e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                                        )
                                        setNewHandleError(false)
                                    }}
                                />
                                <input
                                    className={`wecoInput mb-10 ${newNameError && 'error'}`}
                                    placeholder='Name'
                                    type='text'
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value)
                                        setNewNameError(false)
                                    }}
                                />
                                <input
                                    className={`wecoInput mb-10 ${newEmailError && 'error'}`}
                                    placeholder='Email'
                                    type='email'
                                    value={newEmail}
                                    onChange={(e) => {
                                        setNewEmail(e.target.value)
                                        setNewEmailError(false)
                                    }}
                                />
                                <input
                                    className={`wecoInput mb-10 ${newPasswordError && 'error'}`}
                                    placeholder='Password'
                                    type='password'
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value)
                                        setNewPasswordError(false)
                                    }}
                                />
                                <input
                                    className={`wecoInput mb-10 ${newPasswordTwoError && 'error'}`}
                                    placeholder='Confirm password'
                                    type='password'
                                    value={newPasswordTwo}
                                    onChange={(e) => {
                                        setNewPasswordTwo(e.target.value)
                                        setNewPasswordTwoError(false)
                                    }}
                                />
                                <button type='submit' className='wecoButton w-100 mt-10 mb-20'>
                                    Register
                                </button>
                                <span>
                                    Already registered?{' '}
                                    <button
                                        className={styles.blueText}
                                        type='button'
                                        tabIndex={0}
                                        onClick={() => setDisplay('log-in')}
                                        onKeyDown={() => setDisplay('log-in')}
                                    >
                                        Log in
                                    </button>
                                </span>
                            </form>
                        </div>
                    )}

                    {display === 'forgot-password' && (
                        <div className={styles.authModalColumn}>
                            <span className={styles.authModalTitle}>Reset password</span>
                            <span className={styles.authModalFlashMessage}>
                                {forgotPasswordFlashMessage}
                            </span>
                            <form className={styles.authModalForm} onSubmit={sendResetLink}>
                                <input
                                    className={`wecoInput mb-10 ${resetEmailError && 'error'}`}
                                    placeholder='Account email'
                                    type='email'
                                    value={resetEmail}
                                    onChange={(e) => {
                                        setResetEmail(e.target.value)
                                        setResetEmailError(false)
                                        setForgotPasswordFlashMessage('')
                                    }}
                                />
                                <button type='submit' className='wecoButton w-100 mt-10 mb-20'>
                                    Send reset link
                                </button>
                                <span className='mb-10'>
                                    <button
                                        className={styles.blueText}
                                        type='button'
                                        tabIndex={0}
                                        onClick={() => setDisplay('log-in')}
                                        onKeyDown={() => setDisplay('log-in')}
                                    >
                                        Return to log in
                                    </button>
                                </span>
                            </form>
                        </div>
                    )}
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default AuthModal

/* <span className={styles.authModalText}>or log in with:</span>
<a className={styles.socialMediaButton} style={{ backgroundColor: '#4867aa'}} href="http://localhost:5000/auth/facebook">
    <img className={styles.socialMediaIcon} src='/icons/facebook-f-brands.svg'/>
    Facebook
</a>
<a className={styles.socialMediaButton} style={{ backgroundColor: '#1da1f2'}} href=''>
    <img className={styles.socialMediaIcon} src='/icons/twitter-brands.svg'/>
    Twitter
</a>
<a className={styles.socialMediaButton} style={{ backgroundColor: '#34a853'}} href=''>
    <img className={styles.socialMediaIcon} src='/icons/google-brands.svg'/>
    Google
</a> */
