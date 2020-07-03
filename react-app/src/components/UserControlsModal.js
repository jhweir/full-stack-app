import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserControlsModal.module.scss'

function UserControlsModal(props) {
    const { setUserControlsModalOpen, setAccountData, accountData, logOut } = props
    const { updateUserContext, userData } = useContext(UserContext)
    return (
        <div className={styles.userControlsModalWrapper}>
            <div className={styles.userControlsModal}>
                <img 
                    className={styles.userControlsModalCloseButton}
                    src="/icons/close-01.svg"
                    onClick={() => setUserControlsModalOpen(false)}
                />
                <span className={styles.userControlsModalTitle}>User Controls...</span>
                <Link className={styles.userControlsLink}
                    to={ `/u/${accountData.name}` }
                    onClick={() => { setUserControlsModalOpen(false); updateUserContext(accountData.name) }}>
                    Profile page
                </Link>
                <div className="wecoButton" onClick={() => { setAccountData(null); logOut(); setUserControlsModalOpen(false) }}>Log Out</div>
            </div>
        </div>
    )
}

export default UserControlsModal