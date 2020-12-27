import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/ResetPasswordModal.module.scss'
import CloseButton from '../CloseButton'

function ResetPasswordModal() {
    const { setResetPasswordModalOpen, resetPasswordModalToken } = useContext(AccountContext)

    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [newPasswordError, setNewPasswordError] = useState(false)
    const [newPassword2Error, setNewPassword2Error] = useState(false)
    const [flashMessage, setFlashMessage] = useState('')

    function resetPassword() {
        let invalidNewPassword = newPassword.length === 0
        let invalidNewPassword2 = newPassword2 !== newPassword
        if (invalidNewPassword) setNewPasswordError(true)
        if (invalidNewPassword2) { setNewPassword2Error(true); setFlashMessage(`Passwords don't match`) }
        if (!invalidNewPassword && !invalidNewPassword2) {
            axios
                .post(config.apiURL + '/reset-password', { password: newPassword, token: resetPasswordModalToken })
                .then(res => {
                    if (res.data === 'success') setFlashMessage('Success! Password updated.')
                    if (res.data === 'invalid-token') setFlashMessage('Invalid token')
                })
        }
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setResetPasswordModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setResetPasswordModalOpen(false)}/>
                <span className={styles.title}>Reset your password</span>
                {flashMessage.length > 0 &&
                    <span className={styles.flashMessage}>{flashMessage}</span>
                }
                <input 
                    className={`wecoInput mt-10 mb-10 ${newPasswordError && 'error'}`}
                    placeholder='New password'
                    type="password" value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value)
                        setNewPasswordError(false)
                        setFlashMessage('')
                    }}
                />
                <input 
                    className={`wecoInput mb-30 ${newPassword2Error && 'error'}`}
                    placeholder='Confirm new password'
                    type="password" value={newPassword2}
                    onChange={(e) => {
                        setNewPassword2(e.target.value)
                        setNewPassword2Error(false)
                        setFlashMessage('')
                    }}
                />
                <div
                    className="wecoButton"
                    onClick={() => resetPassword()}>
                    Reset password
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordModal