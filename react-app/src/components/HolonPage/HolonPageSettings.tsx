import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import config from '@src/Config'
import styles from '@styles/components/HolonPageSettings.module.scss'
import SpaceNotificationCard from '@components/Cards/SpaceNotificationCard'

const HolonPageSettings = (): JSX.Element => {
    const { setSettingModalType, setSettingModalOpen } = useContext(AccountContext)
    const { spaceData, setSelectedSpaceSubPage } = useContext(SpaceContext)

    const [selectedSection, setSelectedSection] = useState('settings')
    const [requests, setRequests] = useState([])

    function openSettingModal(type) {
        setSettingModalType(type)
        setSettingModalOpen(true)
    }

    function getRequestsData() {
        axios
            .get(`${config.apiURL}/holon-requests?holonId=${spaceData.id}`)
            .then((res) => setRequests(res.data))
    }

    useEffect(() => {
        setSelectedSpaceSubPage('settings')
    }, [])

    useEffect(() => {
        if (selectedSection === 'requests') getRequestsData()
    }, [selectedSection])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div
                    className={`${styles.headerItem} ${
                        selectedSection === 'settings' && styles.selected
                    }`}
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelectedSection('settings')}
                    onKeyDown={() => setSelectedSection('settings')}
                >
                    Settings
                </div>
                <div
                    className={`${styles.headerItem} ${
                        selectedSection === 'requests' && styles.selected
                    }`}
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelectedSection('requests')}
                    onKeyDown={() => setSelectedSection('requests')}
                >
                    Requests
                </div>
                <div
                    className={`${styles.headerItem} ${
                        selectedSection === 'flags' && styles.selected
                    }`}
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelectedSection('flags')}
                    onKeyDown={() => setSelectedSection('flags')}
                >
                    Flags
                </div>
            </div>

            {selectedSection === 'settings' && (
                <div className={styles.content}>
                    <div className={styles.section}>
                        {/* <div className={styles.title}>About</div> */}
                        <div className={styles.field}>
                            <div className={styles.text}>
                                <span className='mr-10'>
                                    <b>Handle:</b> {spaceData && spaceData.handle}
                                </span>
                                <span
                                    className={styles.linkText}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => openSettingModal('change-holon-handle')}
                                    onKeyDown={() => openSettingModal('change-holon-handle')}
                                >
                                    Change
                                </span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.text}>
                                <span className='mr-10'>
                                    <b>Name:</b> {spaceData && spaceData.name}
                                </span>
                                <span
                                    className={styles.linkText}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => openSettingModal('change-holon-name')}
                                    onKeyDown={() => openSettingModal('change-holon-name')}
                                >
                                    Change
                                </span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.text}>
                                <span className='mr-10'>
                                    <b>Description:</b> {spaceData && spaceData.description}
                                </span>
                                <span
                                    className={styles.linkText}
                                    role='button'
                                    tabIndex={0}
                                    onClick={() => openSettingModal('change-holon-description')}
                                    onKeyDown={() => openSettingModal('change-holon-description')}
                                >
                                    Change
                                </span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div
                                className={styles.linkText}
                                role='button'
                                tabIndex={0}
                                onClick={() => openSettingModal('add-new-holon-moderator')}
                                onKeyDown={() => openSettingModal('add-new-holon-moderator')}
                            >
                                Add moderator
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div
                                className={styles.linkText}
                                role='button'
                                tabIndex={0}
                                onClick={() => openSettingModal('add-parent-holon')}
                                onKeyDown={() => openSettingModal('add-parent-holon')}
                            >
                                Add parent space
                            </div>
                        </div>
                        {/* <div className={styles.field}>
                            <div className={styles.linkText} onClick={() => openSettingModal('remove-parent-holon')}>Remove parent space</div>
                        </div> */}
                    </div>
                </div>
            )}

            {selectedSection === 'requests' &&
                requests.map((notification) => (
                    <SpaceNotificationCard
                        notification={notification}
                        // index={index}
                        key={notification}
                        getRequestsData={getRequestsData}
                    />
                ))}
        </div>
    )
}

export default HolonPageSettings
