import React, { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import styles from '../../styles/components/AlertModal.module.scss'
import CloseButton from '../CloseButton'

function AlertModal() {
    const { setAlertModalOpen, alertMessage, setAuthModalOpen } = useContext(AccountContext)

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setAlertModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setAlertModalOpen(false)}/>
                <span className={styles.text}>{ alertMessage }</span>
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