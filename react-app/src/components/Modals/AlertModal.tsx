import React, { useContext } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/AlertModal.module.scss'
import CloseOnClickOutside from '../CloseOnClickOutside'
import CloseButton from '../CloseButton'

const AlertModal = (): JSX.Element => {
    const { setAlertModalOpen, alertMessage, setAuthModalOpen } = useContext(AccountContext)

    const logIn = () => {
        setAuthModalOpen(true)
        setAlertModalOpen(false)
    }

    const closeModal = () => setAlertModalOpen(false)

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={closeModal}>
                <div className={styles.modal}>
                    <CloseButton onClick={closeModal} />
                    <span className={styles.text}>{alertMessage}</span>
                    {alertMessage.includes('Log in') && (
                        <div
                            className='wecoButton'
                            role='button'
                            tabIndex={0}
                            onClick={logIn}
                            onKeyDown={logIn}
                        >
                            Log in
                        </div>
                    )}
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default AlertModal
