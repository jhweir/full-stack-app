import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSettings.module.scss'

function HolonPageSettings() {
    const { setSettingModalType, setSettingModalOpen, getAccountData } = useContext(AccountContext)
    const { holonData, setSelectedHolonSubPage } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('settings')
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Settings</div>
            <div className={styles.content}>
                <div className={styles.section}>
                    {/* <div className={styles.title}>About</div> */}
                    <div className={styles.field}>
                        <div className={styles.text}><b>Handle:</b> {holonData && holonData.handle}</div>
                        <div className={styles.linkText} onClick={() => { setSettingModalType('change-holon-handle'); setSettingModalOpen(true) }}>Change</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.text}><b>Name:</b> {holonData && holonData.name}</div>
                        <div className={styles.linkText} onClick={() => { setSettingModalType('change-holon-name'); setSettingModalOpen(true) }}>Change</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.text}><b>Description:</b> {holonData && holonData.description}</div>
                        <div className={styles.linkText} onClick={() => { setSettingModalType('change-holon-description'); setSettingModalOpen(true) }}>Change</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.linkText} onClick={() => { setSettingModalType('add-new-moderator'); setSettingModalOpen(true) }}>Add moderator</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.linkText} onClick={() => { setSettingModalType('add-parent-space'); setSettingModalOpen(true) }}>Add parent space</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.linkText} onClick={() => { setSettingModalType('remove-parent-space'); setSettingModalOpen(true) }}>Remove parent space</div>
                    </div>
                    {/* <div className={styles.field}>
                        <div className={styles.linkText} onClick={() => { getAccountData() }}>getAccountData</div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default HolonPageSettings