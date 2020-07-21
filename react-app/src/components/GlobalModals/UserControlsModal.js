import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserControlsModal.module.scss'

function UserControlsModal() {
    const { userControlsModalOpen, setUserControlsModalOpen, setAccountData, accountData, logOut } = useContext(AccountContext)
    const { getUserData, setUserHandle, userData } = useContext(UserContext)

    if (userControlsModalOpen) {
        return (
            <div className={styles.modalWrapper}>
                <div className={styles.modalPositioner}>
                    <div className={styles.modal}>
                        <img 
                            className={styles.closeButton}
                            src="/icons/close-01.svg"
                            onClick={() => setUserControlsModalOpen(false)}
                        />
                        <span className={styles.title}>User Controls</span>
                        <Link className={styles.link}
                            to={ `/u/${accountData.handle}` }
                            onClick={() => { setUserControlsModalOpen(false); setUserHandle(accountData.handle) }}>
                            Profile page
                        </Link>
                        <div className="wecoButton" onClick={() => { setAccountData(null); logOut(); setUserControlsModalOpen(false) }}>Log Out</div>
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default UserControlsModal