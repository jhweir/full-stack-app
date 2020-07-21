import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/AuthModal.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'

function AuthModal() {
    const { authModalOpen, getAccountData, setAuthModalOpen } = useContext(AccountContext)
    const { updateHolonContext, holonData } = useContext(HolonContext)
    //const { setAuthModalOpen } = props
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newHandle, setNewHandle] = useState('')
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordTwo, setNewPasswordTwo] = useState('')
    const [logInFlashMessage, setLogInFlashMessage] = useState('')
    const [registerFlashMessage, setRegisterFlashMessage] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [newHandleError, setNewHandleError] = useState(false)
    const [newNameError, setNewNameError] = useState(false)
    const [newEmailError, setNewEmailError] = useState(false)
    const [newPasswordError, setNewPasswordError] = useState(false)
    const [newPasswordTwoError, setNewPasswordTwoError] = useState(false)

    function logIn(e) {
        e.preventDefault()
        let invalidEmail = email.length === 0
        let invalidPassword = password.length === 0
        if (invalidEmail) { setEmailError(true) }
        if (invalidPassword) { setPasswordError(true) }
        if (!invalidEmail && !invalidPassword) {
            axios
                .post(config.environmentURL + '/log-in', { email, password })
                .then(res => {
                    if (res.data === 'user-not-found') { setLogInFlashMessage('User not found') }
                    if (res.data === 'incorrect-password') { setLogInFlashMessage('Incorrect password') }
                    if (res.data !== 'user-not-found' && res.data !== 'incorrect-password') {
                        document.cookie = `accessToken=${res.data}; path=/`
                        setAuthModalOpen(false)
                        getAccountData()
                    }
                })
        }
    }

    function register(e) {
        e.preventDefault()
        let invalidNewHandle = newHandle.length === 0 || newHandle.length > 10 || newHandle.includes(' ')
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
                .post(config.environmentURL + '/register', { newHandle, newName, newEmail, newPassword })
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
                        setRegisterFlashMessage('Account registered! You can now log in.')
                        setNewHandle(''); setNewName(''); setNewEmail(''); setNewPassword(''); setNewPasswordTwo('')
                    }
                })
        }

    }
    if (authModalOpen) {
        return (
            <div className={styles.authModalWrapper}>
                <div className={styles.authModal}>
                    <img 
                        className={styles.authModalCloseButton}
                        src="/icons/close-01.svg"
                        onClick={() => setAuthModalOpen(false)}
                    />
                    <div className={styles.authModalColumn}>
                        <span className={styles.authModalTitle}>Log in</span>
                        <span className={styles.authModalFlashMessage}>{ logInFlashMessage }</span>
                        <form className={styles.authModalForm} onSubmit={ logIn }>
                            <input 
                                className={`wecoInput mb-10 ${emailError && 'error'}`}
                                placeholder='Email'
                                type="email" value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError(false) }}
                            />
                            <input 
                                className={`wecoInput mb-10 ${passwordError && 'error'}`}
                                placeholder='Password'
                                type="password" value={password}
                                onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }}
                            />
                            <button className='wecoButton w-100'>Log in</button>
                        </form>
                        <span className={styles.authModalText}>or log in with:</span>
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
                        </a>
                    </div>
                    <div className={styles.authModalDividerLine}/>
                    <div className={styles.authModalColumn}>
                        <span className={styles.authModalTitle}>Register</span>
                        <span className={styles.authModalFlashMessage}>{ registerFlashMessage }</span>
                        <form className={styles.authModalForm} onSubmit={ register }>
                            <input
                                className={`wecoInput mb-10 ${newHandleError && 'error'}`}
                                placeholder='Unique handle'
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
                                placeholder='Repeat password'
                                type="password" value={newPasswordTwo}
                                onChange={(e) => { setNewPasswordTwo(e.target.value); setNewPasswordTwoError(false) }}
                            />
                            <button className='wecoButton w-100'>Register</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default AuthModal