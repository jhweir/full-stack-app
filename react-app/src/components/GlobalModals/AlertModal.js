import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/AlertModal.module.scss'

function AlertModal() {
    const { setAlertModalOpen, alertMessage, setAuthModalOpen } = useContext(AccountContext)
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
}

export default AlertModal