import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../contexts/AccountContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserControlsModal.module.scss'

function UserControlsModal() {
    const { userControlsModalOpen, setUserControlsModalOpen, setAccountData, accountData, logOut } = useContext(AccountContext)
    const { updateUserContext, userData } = useContext(UserContext)

    if (userControlsModalOpen && accountData) {
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
    } else { return null }
}

export default UserControlsModal