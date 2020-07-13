import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/AlertModal.module.scss'

function AlertModal() {
    //const { setAlertModalOpen, message, children } = props
    const { alertModalOpen, setAlertModalOpen, alertMessage, setAuthModalOpen } = useContext(AccountContext)

    if (alertModalOpen) {
        return (
            <div className={styles.alertModalWrapper}>
                <div className={styles.alertModal}>
                    <img 
                        className={styles.alertModalCloseButton}
                        src="/icons/close-01.svg"
                        onClick={() => setAlertModalOpen(false)}
                    />
                    <span className={styles.alertModalText}>{ alertMessage }</span>
                    {alertMessage.includes('Log in') &&
                        <div
                            className="wecoButton"
                            onClick={() => { setAuthModalOpen(true); setAlertModalOpen(false) }}>
                            Log in
                        </div>
                    }
                </div>
            </div>
        )
    } else { return null }
}

export default AlertModal