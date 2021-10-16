import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import config from '@src/Config'
import styles from '@styles/components/HolonPageSettings.module.scss'
import NotificationCard from '@components/Cards/NotificationCard'
// import SpaceNotificationCard from '@components/Cards/SpaceNotificationCard'
import Button from '@components/Button'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import UpdateSpaceHandleModal from '@components/Modals/UpdateSpaceHandleModal'
import UpdateSpaceNameModal from '@components/Modals/UpdateSpaceNameModal'
import UpdateSpaceDescriptionModal from '@components/Modals/UpdateSpaceDescriptionModal'
import InviteSpaceModeratorModal from '@components/Modals/InviteSpaceModeratorModal'
import RemoveSpaceModeratorModal from '@components/Modals/RemoveSpaceModeratorModal'
import ParentSpaceRequestModal from '@components/Modals/ParentSpaceRequestModal'
import RemoveParentSpaceModal from '@components/Modals/RemoveParentSpaceModal'
import RemoveChildSpaceModal from '@components/Modals/RemoveChildSpaceModal'
import DeleteSpaceModal from '@components/Modals/DeleteSpaceModal'

const HolonPageSettings = ({
    match,
}: {
    match: { params: { spaceHandle: string } }
}): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const {
        // accountData,
        accountDataLoading,
        // setSettingModalType,
        // setSettingModalOpen,
    } = useContext(AccountContext)
    const {
        spaceData,
        getSpaceData,
        spaceDataLoading,
        // setSpaceData,
        isModerator,
        setSelectedSpaceSubPage,
    } = useContext(SpaceContext)

    const [selectedSection, setSelectedSection] = useState('settings')
    const [requests, setRequests] = useState([])

    // modals
    const [updateSpaceHandleModalOpen, setUpdateSpaceHandleModalOpen] = useState(false)
    const [updateSpaceNameModalOpen, setUpdateSpaceNameModalOpen] = useState(false)
    const [updateSpaceDescriptionModalOpen, setUpdateSpaceDescriptionModalOpen] = useState(false)
    const [inviteSpaceModeratorModalOpen, setInviteSpaceModeratorModalOpen] = useState(false)
    const [removeSpaceModeratorModalOpen, setRemoveSpaceModeratorModalOpen] = useState(false)
    const [parentSpaceRequestModalOpen, setParentSpaceRequestModalOpen] = useState(false)
    const [removeParentSpaceModalOpen, setRemoveParentSpaceModalOpen] = useState(false)
    const [removeChildSpaceModalOpen, setRemoveChildSpaceModalOpen] = useState(false)
    const [deleteSpaceModalOpen, setDeleteSpaceModalOpen] = useState(false)

    function getRequestsData() {
        axios
            .get(`${config.apiURL}/holon-requests?holonId=${spaceData.id}`)
            .then((res) => setRequests(res.data))
    }

    useEffect(() => {
        setSelectedSpaceSubPage('settings')
        if (!accountDataLoading && spaceHandle !== spaceData.handle) {
            getSpaceData(spaceHandle, false)
        }
    }, [accountDataLoading, isModerator, spaceHandle])

    useEffect(() => {
        if (selectedSection === 'requests') getRequestsData()
    }, [selectedSection])

    return (
        <div className={styles.wrapper}>
            {isModerator ? (
                <>
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
                            General
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
                            <div className={styles.row}>
                                <h4>Handle:</h4>
                                <p>{spaceData.handle}</p>
                                <Button
                                    text='Edit'
                                    colour='blue'
                                    size='small'
                                    onClick={() => setUpdateSpaceHandleModalOpen(true)}
                                />
                                {updateSpaceHandleModalOpen && (
                                    <UpdateSpaceHandleModal
                                        close={() => setUpdateSpaceHandleModalOpen(false)}
                                    />
                                )}
                            </div>
                            <div className={styles.row}>
                                <h4>Name:</h4>
                                <p>{spaceData.name}</p>
                                <Button
                                    text='Edit'
                                    colour='blue'
                                    size='small'
                                    onClick={() => setUpdateSpaceNameModalOpen(true)}
                                />
                                {updateSpaceNameModalOpen && (
                                    <UpdateSpaceNameModal
                                        close={() => setUpdateSpaceNameModalOpen(false)}
                                    />
                                )}
                            </div>
                            <div className={styles.column}>
                                <h4>Description:</h4>
                                <ShowMoreLess height={75}>
                                    <Markdown text={spaceData.description || ''} />
                                </ShowMoreLess>
                                <Button
                                    text='Edit'
                                    colour='blue'
                                    size='small'
                                    onClick={() => setUpdateSpaceDescriptionModalOpen(true)}
                                />
                                {updateSpaceDescriptionModalOpen && (
                                    <UpdateSpaceDescriptionModal
                                        close={() => setUpdateSpaceDescriptionModalOpen(false)}
                                    />
                                )}
                            </div>
                            <div className={styles.row}>
                                <Button
                                    text='Invite moderator'
                                    colour='blue'
                                    size='medium'
                                    onClick={() => setInviteSpaceModeratorModalOpen(true)}
                                />
                                {inviteSpaceModeratorModalOpen && (
                                    <InviteSpaceModeratorModal
                                        close={() => setInviteSpaceModeratorModalOpen(false)}
                                    />
                                )}
                            </div>
                            <div className={styles.row}>
                                <Button
                                    text='Remove moderator'
                                    colour='blue'
                                    size='medium'
                                    onClick={() => setRemoveSpaceModeratorModalOpen(true)}
                                />
                                {removeSpaceModeratorModalOpen && (
                                    <RemoveSpaceModeratorModal
                                        close={() => setRemoveSpaceModeratorModalOpen(false)}
                                    />
                                )}
                            </div>
                            {spaceData.id !== 1 && (
                                <>
                                    <div className={styles.row}>
                                        <Button
                                            text='Add parent space'
                                            colour='blue'
                                            size='medium'
                                            onClick={() => setParentSpaceRequestModalOpen(true)}
                                        />
                                        {parentSpaceRequestModalOpen && (
                                            <ParentSpaceRequestModal
                                                close={() => setParentSpaceRequestModalOpen(false)}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.row}>
                                        <Button
                                            text='Remove parent space'
                                            colour='blue'
                                            size='medium'
                                            onClick={() => setRemoveParentSpaceModalOpen(true)}
                                        />
                                        {removeParentSpaceModalOpen && (
                                            <RemoveParentSpaceModal
                                                close={() => setRemoveParentSpaceModalOpen(false)}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.row}>
                                        <Button
                                            text='Remove child space'
                                            colour='blue'
                                            size='medium'
                                            onClick={() => setRemoveChildSpaceModalOpen(true)}
                                        />
                                        {removeChildSpaceModalOpen && (
                                            <RemoveChildSpaceModal
                                                close={() => setRemoveChildSpaceModalOpen(false)}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.row}>
                                        <Button
                                            text='Delete'
                                            colour='red'
                                            size='medium'
                                            onClick={() => setDeleteSpaceModalOpen(true)}
                                        />
                                        {deleteSpaceModalOpen && (
                                            <DeleteSpaceModal
                                                close={() => setDeleteSpaceModalOpen(false)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {selectedSection === 'requests' &&
                        requests.map((notification: any) => (
                            <NotificationCard
                                notification={notification}
                                location='space'
                                key={notification.id}
                            />
                        ))}
                </>
            ) : (
                <>
                    {accountDataLoading || spaceDataLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <p>Not moderator</p>
                    )}
                </>
            )}
        </div>
    )
}

export default HolonPageSettings
