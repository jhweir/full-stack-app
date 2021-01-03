import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageSettings.module.scss'

function UserPageSettings() {
    const { accountData, setSettingModalType, setSettingModalOpen, getAccountData } = useContext(AccountContext)
    const { userData, setSelectedUserSubPage } = useContext(UserContext)

    useEffect(() => {
        setSelectedUserSubPage('settings')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                Settings
            </div>
            <div className={styles.body}>
                <div className={styles.field}>
                    <div className={styles.text}><b>Name:</b> {accountData && accountData.name}</div>
                    <div className={styles.linkText} onClick={() => { setSettingModalType('change-user-name'); setSettingModalOpen(true) }}>Change</div>
                </div>
                <div className={styles.field}>
                    <div className={styles.text}><b>Bio:</b> {accountData && accountData.bio}</div>
                    <div className={styles.linkText} onClick={() => { setSettingModalType('change-user-bio'); setSettingModalOpen(true) }}>Change</div>
                </div>
            </div>
        </div>
    )
}

export default UserPageSettings