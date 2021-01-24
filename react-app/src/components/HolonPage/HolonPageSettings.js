import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSettings.module.scss'
import SpaceNotificationCard from '../Cards/SpaceNotificationCard'

function HolonPageSettings() {
    const { setSettingModalType, setSettingModalOpen, getAccountData } = useContext(AccountContext)
    const { holonData, setSelectedHolonSubPage } = useContext(HolonContext)

    const [selectedSection, setSelectedSection] = useState('settings')
    const [requests, setRequests] = useState([])

    function openSettingModal(type) {
        setSettingModalType(type)
        setSettingModalOpen(true)
    }

    function getRequestsData() {
        axios
            .get(config.apiURL + `/holon-requests?holonId=${holonData.id}`)
            .then(res => {
                //console.log('res.data: ', res.data)
                setRequests(res.data)
            })
    }

    useEffect(() => {
        setSelectedHolonSubPage('settings')
    }, [])

    useEffect(() => {
        if (selectedSection === 'requests') getRequestsData()
    }, [selectedSection])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div
                    className={`${styles.headerItem} ${selectedSection === 'settings' && styles.selected}`}
                    onClick={() => setSelectedSection('settings')}
                >
                    Settings
                </div>
                <div
                    className={`${styles.headerItem} ${selectedSection === 'requests' && styles.selected}`}
                    onClick={() => setSelectedSection('requests')}
                >
                    Requests
                </div>
                <div
                    className={`${styles.headerItem} ${selectedSection === 'flags' && styles.selected}`}
                    onClick={() => setSelectedSection('flags')}
                >
                    Flags
                </div>
            </div>
            
            {selectedSection === 'settings' &&
                <div className={styles.content}>
                    <div className={styles.section}>
                        {/* <div className={styles.title}>About</div> */}
                        <div className={styles.field}>
                            <div className={styles.text}>
                                <span className='mr-10'><b>Handle:</b> {holonData && holonData.handle}</span>
                                <span className={styles.linkText} onClick={() => openSettingModal('change-holon-handle')}>Change</span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.text}>
                                <span className='mr-10'><b>Name:</b> {holonData && holonData.name}</span>
                                <span className={styles.linkText} onClick={() => openSettingModal('change-holon-name')}>Change</span>
                            </div>
                            
                        </div>
                        <div className={styles.field}>
                            <div className={styles.text}>
                                <span className='mr-10'><b>Description:</b> {holonData && holonData.description}</span>
                                <span className={styles.linkText} onClick={() => openSettingModal('change-holon-description')}>Change</span>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.linkText} onClick={() => openSettingModal('add-new-moderator')}>Add moderator</div>
                        </div>
                        <div className={styles.field}>
                            <div className={styles.linkText} onClick={() => openSettingModal('add-parent-holon')}>Add parent space</div>
                        </div>
                        {/* <div className={styles.field}>
                            <div className={styles.linkText} onClick={() => openSettingModal('remove-parent-holon')}>Remove parent space</div>
                        </div> */}
                    </div>
                </div>
            }

            {selectedSection === 'requests' &&
                requests.map((notification, index) =>
                    <SpaceNotificationCard notification={notification} index={index} key={index} getRequestsData={getRequestsData}/>
                )
            }
        </div>
    )
}

export default HolonPageSettings