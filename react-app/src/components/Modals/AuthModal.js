import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/AuthModal.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import CloseButton from '../CloseButton'

function AuthModal() {
    const { getAccountData, setAuthModalOpen } = useContext(AccountContext)
    
    const [display, setDisplay] = useState('log-in')

    // log in
    const [emailOrHandle, setEmailOrHandle] = useState('')
    const [password, setPassword] = useState('')
    const [emailOrHandleError, setEmailOrHandleError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [logInFlashMessage, setLogInFlashMessage] = useState('')
    const [displayResendVerificationEmailLink, setDisplayResendVerificationEmailLink] = useState(false)
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
        let invalidEmailOrHandle = emailOrHandle.length === 0
        let invalidPassword = password.length === 0
        if (invalidEmailOrHandle) { setEmailOrHandleError(true) }
        if (invalidPassword) { setPasswordError(true) }
        if (!invalidEmailOrHandle && !invalidPassword) {
            axios
                .post(config.apiURL + '/log-in', { emailOrHandle, password })
                .then(res => {
                    if (res.data === 'user-not-found') { setLogInFlashMessage('User not found') }
                    else if (res.data === 'incorrect-password') { setLogInFlashMessage('Incorrect password') }
                    else if (res.data.message === 'email-not-verified') {
                        setLogInFlashMessage('Email not yet verified')
                        // display option to resend verification email
                        setDisplayResendVerificationEmailLink(true)
                        setVerificationEmailUserId(res.data.userId)
                    }
                    else {
                        document.cookie = `accessToken=${res.data}; path=/`
                        setAuthModalOpen(false)
                        getAccountData()
                    }
                })
        }
    }

    function register(e) {
        e.preventDefault()
        let invalidNewHandle = newHandle.length === 0 || newHandle.length > 30 || newHandle.includes(' ')
        let invalidNewName = newName.length === 0 || newName.length > 30
        let invalidNewEmail = newEmail.length === 0 || newEmail.length > 500
        let invalidNewPassword = newPassword.length === 0
        let invalidNewPasswordTwo = newPasswordTwo !== newPassword
        if (invalidNewHandle) { setNewHandleError(true) }
        if (invalidNewName) { setNewNameError(true) }
        if (invalidNewEmail) { setNewEmailError(true) }
        if (invalidNewPassword) { setNewPasswordError(true) }
        if (invalidNewPasswordTwo) { 
            setNewPasswordTwoError(true)
            setRegisterFlashMessage("Passwords don't match")
        }
        if (!invalidNewHandle && !invalidNewName && !invalidNewEmail && !invalidNewPassword && !invalidNewPasswordTwo) {
            axios
                .post(config.apiURL + '/register', { newHandle, newName, newEmail, newPassword })
                .then(res => {
                    if (res.data === 'handle-taken') { 
                        setRegisterFlashMessage('Handle already taken')
                        setNewHandleError(true)
                    }
                    if (res.data === 'email-taken') {
                        setRegisterFlashMessage('Email already taken')
                        setNewEmailError(true)
                    }
                    if (res.data === 'account-registered') { 
                        setRegisterFlashMessage("Success! We've sent you an email. Follow the instructions there to complete the registration process.")
                        setNewHandle(''); setNewName(''); setNewEmail(''); setNewPassword(''); setNewPasswordTwo('')
                    }
                })
        }
    }

    function sendResetLink(e) {
        e.preventDefault()
        let invalidResetEmail = resetEmail.length === 0
        if (invalidResetEmail) { setResetEmailError(true) }
        if (!invalidResetEmail) {
            axios
                .post(config.apiURL + '/reset-password-request', { email: resetEmail })
                .then(res => {
                    if (res.data === 'user-not-found') { setForgotPasswordFlashMessage('Account not found') }
                    if (res.data === 'email-sent') { setForgotPasswordFlashMessage(`Success! We've sent you an email with a link to reset your password.`) }
                })
        }
    }

    function resendVerificationEmail() {
        axios
            .post(config.apiURL + '/resend-verification-email', { userId: verificationEmailUserId })
            .then(res => {
                console.log('res: ', res)
                if (res.data === 'user-not-found') { setLogInFlashMessage('Account not found') }
                if (res.data === 'success') {
                    setLogInFlashMessage(`Success! We've sent you a new verification email.`)
                    setDisplayResendVerificationEmailLink(false)
                }
            })
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setAuthModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.authModalWrapper}>
            <div className={styles.authModal} ref={ref}>
                <CloseButton onClick={() => setAuthModalOpen(false)}/>
                {display === 'log-in' &&
                    <div className={styles.authModalColumn}>
                        <span className={styles.authModalTitle}>Log in</span>
                        <span className={styles.authModalFlashMessage}>{ logInFlashMessage }</span>
                        {displayResendVerificationEmailLink &&
                            <span className='blueText mt-10 mb-10' onClick={() => resendVerificationEmail()}>Resend verification email</span>
                        }
                        <form className={styles.authModalForm} onSubmit={ logIn }>
                            <input 
                                className={`wecoInput mb-10 ${emailOrHandleError && 'error'}`}
                                placeholder='Email or Handle'
                                type="text" value={emailOrHandle}
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
                                type="password" value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setPasswordError(false)
                                    setDisplayResendVerificationEmailLink(false)
                                    setLogInFlashMessage('')
                                }}
                            />
                            <button className='wecoButton w-100 mt-10 mb-20'>Log in</button>
                            <span className='mb-10'>New? <a className='blueText' onClick={() => setDisplay('create-new-account')}>Create a new account</a></span>
                            {/* <span>Forgot your password?</span> */}
                            <a className='blueText' onClick={() => setDisplay('forgot-password')}>Forgot your password?</a>
                        </form>
                    </div>
                }

                {display === 'create-new-account' &&
                    <div className={styles.authModalColumn}>
                        <span className={styles.authModalTitle}>Create new account</span>
                        <span className={styles.authModalFlashMessage}>{ registerFlashMessage }</span>
                        <form className={styles.authModalForm} onSubmit={ register }>
                            <input
                                className={`wecoInput mb-10 ${newHandleError && 'error'}`}
                                placeholder='Handle (must be unique)'
                                type="text" value={newHandle}
                                onChange={(e) => { setNewHandle(e.target.value); setNewHandleError(false) }}
                            />
                            <input
                                className={`wecoInput mb-10 ${newNameError && 'error'}`}
                                placeholder='Name'
                                type="text" value={newName}
                                onChange={(e) => { setNewName(e.target.value); setNewNameError(false) }}
                            />
                            <input 
                                className={`wecoInput mb-10 ${newEmailError && 'error'}`}
                                placeholder='Email'
                                type="email" value={newEmail}
                                onChange={(e) => { setNewEmail(e.target.value); setNewEmailError(false) }}
                            />
                            <input 
                                className={`wecoInput mb-10 ${newPasswordError && 'error'}`}
                                placeholder='Password'
                                type="password" value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(false) }}
                            />
                            <input 
                                className={`wecoInput mb-10 ${newPasswordTwoError && 'error'}`}
                                placeholder='Confirm password'
                                type="password" value={newPasswordTwo}
                                onChange={(e) => { setNewPasswordTwo(e.target.value); setNewPasswordTwoError(false) }}
                            />
                            <button className='wecoButton w-100 mt-10 mb-20'>Register</button>
                            <span>Already registered? <a className='blueText' onClick={() => setDisplay('log-in')}>Log in</a></span>
                        </form>
                    </div>
                }

                {display === 'forgot-password' &&
                    <div className={styles.authModalColumn}>
                        <span className={styles.authModalTitle}>Reset password</span>
                        <span className={styles.authModalFlashMessage}>{ forgotPasswordFlashMessage }</span>
                        <form className={styles.authModalForm} onSubmit={sendResetLink}>
                            <input 
                                className={`wecoInput mb-10 ${resetEmailError && 'error'}`}
                                placeholder='Account email'
                                type="email" value={resetEmail}
                                onChange={(e) => { setResetEmail(e.target.value); setResetEmailError(false); setForgotPasswordFlashMessage('') }}
                            />
                            <button className='wecoButton w-100 mt-10 mb-20'>Send reset link</button>
                            <span className='mb-10'><a className='blueText' onClick={() => setDisplay('log-in')}>Return to log in</a></span>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}

export default AuthModal

{/* <span className={styles.authModalText}>or log in with:</span>
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
</a> */}
