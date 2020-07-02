import React from 'react'
import styles from '../styles/components/UserControlsModal.module.scss'

function UserControlsModal(props) {
    const { setUserControlsModalOpen, setUserData, logOut } = props
    return (
        <div className={styles.userControlsModalWrapper}>
            <div className={styles.userControlsModal}>
                <img 
                    className={styles.userControlsModalCloseButton}
                    src="/icons/close-01.svg"
                    onClick={() => setUserControlsModalOpen(false)}
                />
                <span className={styles.userControlsModalTitle}>User Controls...</span>
                <div className="button" onClick={() => { setUserData(null); logOut(); setUserControlsModalOpen(false) }}>Log Out</div>
            </div>
        </div>
    )
}

export default UserControlsModal