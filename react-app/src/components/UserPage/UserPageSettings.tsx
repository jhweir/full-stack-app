import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/UserPageSettings.module.scss'

const UserPageSettings = (): JSX.Element => {
    const { accountData, setSettingModalType, setSettingModalOpen } = useContext(AccountContext)
    const { setSelectedUserSubPage } = useContext(UserContext)

    const handleClick = (settingType: string) => {
        setSettingModalType(settingType)
        setSettingModalOpen(true)
    }

    useEffect(() => {
        setSelectedUserSubPage('settings')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Settings</div>
            <div className={styles.body}>
                <div className={styles.field}>
                    <div className={styles.text}>
                        <b>Name:</b> {accountData && accountData.name}
                    </div>
                    <div
                        className={styles.linkText}
                        role='button'
                        tabIndex={0}
                        onClick={() => handleClick('change-user-name')}
                        onKeyDown={() => handleClick('change-user-name')}
                    >
                        Change
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.text}>
                        <b>Bio:</b> {accountData && accountData.bio}
                    </div>
                    <div
                        className={styles.linkText}
                        role='button'
                        tabIndex={0}
                        onClick={() => handleClick('change-user-bio')}
                        onKeyDown={() => handleClick('change-user-bio')}
                    >
                        Change
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPageSettings
