import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import config from '@src/Config'
import styles from '@styles/components/SpacePageSettings.module.scss'
import NotificationCard from '@components/Cards/NotificationCard'
// import SpaceNotificationCard from '@components/Cards/SpaceNotificationCard'
import Button from '@components/Button'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import Column from '@components/Column'
import Row from '@components/Row'
import UpdateSpaceHandleModal from '@components/Modals/UpdateSpaceHandleModal'
import UpdateSpaceNameModal from '@components/Modals/UpdateSpaceNameModal'
import UpdateSpaceDescriptionModal from '@components/Modals/UpdateSpaceDescriptionModal'
import InviteSpaceModeratorModal from '@components/Modals/InviteSpaceModeratorModal'
import RemoveSpaceModeratorModal from '@components/Modals/RemoveSpaceModeratorModal'
import ParentSpaceRequestModal from '@components/Modals/ParentSpaceRequestModal'
import RemoveParentSpaceModal from '@components/Modals/RemoveParentSpaceModal'
import RemoveChildSpaceModal from '@components/Modals/RemoveChildSpaceModal'
import DeleteSpaceModal from '@components/Modals/DeleteSpaceModal'

const SpacePageSettings = ({
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

    // function getRequestsData() {
    //     axios
    //         .get(`${config.apiURL}/holon-requests?holonId=${spaceData.id}`)
    //         .then((res) => setRequests(res.data))
    // }

    useEffect(() => {
        setSelectedSpaceSubPage('settings')
        if (!accountDataLoading && spaceHandle !== spaceData.handle) {
            getSpaceData(spaceHandle, false)
        }
    }, [accountDataLoading, isModerator, spaceHandle])

    // useEffect(() => {
    //     if (selectedSection === 'requests') getRequestsData()
    // }, [selectedSection])

    return (
        <Column className={styles.wrapper}>
            <Column className={styles.content}>
                <Row centerY>
                    <h1>Handle:</h1>
                    <p>{spaceData.handle}</p>
                    <Button
                        text='Edit'
                        color='blue'
                        size='small'
                        onClick={() => setUpdateSpaceHandleModalOpen(true)}
                    />
                    {updateSpaceHandleModalOpen && (
                        <UpdateSpaceHandleModal
                            close={() => setUpdateSpaceHandleModalOpen(false)}
                        />
                    )}
                </Row>
                <Row centerY>
                    <h1>Name:</h1>
                    <p>{spaceData.name}</p>
                    <Button
                        text='Edit'
                        color='blue'
                        size='small'
                        onClick={() => setUpdateSpaceNameModalOpen(true)}
                    />
                    {updateSpaceNameModalOpen && (
                        <UpdateSpaceNameModal close={() => setUpdateSpaceNameModalOpen(false)} />
                    )}
                </Row>
                <Column style={{ alignItems: 'start' }}>
                    <h1>Description:</h1>
                    <ShowMoreLess height={75}>
                        <Markdown text={spaceData.description || ''} />
                    </ShowMoreLess>
                    <Button
                        text='Edit'
                        color='blue'
                        size='small'
                        style={{ marginTop: 10 }}
                        onClick={() => setUpdateSpaceDescriptionModalOpen(true)}
                    />
                    {updateSpaceDescriptionModalOpen && (
                        <UpdateSpaceDescriptionModal
                            close={() => setUpdateSpaceDescriptionModalOpen(false)}
                        />
                    )}
                </Column>
                <Row>
                    <Button
                        text='Invite moderator'
                        color='blue'
                        onClick={() => setInviteSpaceModeratorModalOpen(true)}
                    />
                    {inviteSpaceModeratorModalOpen && (
                        <InviteSpaceModeratorModal
                            close={() => setInviteSpaceModeratorModalOpen(false)}
                        />
                    )}
                </Row>
                <Row>
                    <Button
                        text='Remove moderator'
                        color='blue'
                        onClick={() => setRemoveSpaceModeratorModalOpen(true)}
                    />
                    {removeSpaceModeratorModalOpen && (
                        <RemoveSpaceModeratorModal
                            close={() => setRemoveSpaceModeratorModalOpen(false)}
                        />
                    )}
                </Row>
                {spaceData.id !== 1 && (
                    <>
                        <Row>
                            <Button
                                text='Add parent space'
                                color='blue'
                                onClick={() => setParentSpaceRequestModalOpen(true)}
                            />
                            {parentSpaceRequestModalOpen && (
                                <ParentSpaceRequestModal
                                    close={() => setParentSpaceRequestModalOpen(false)}
                                />
                            )}
                        </Row>
                        <Row>
                            <Button
                                text='Remove parent space'
                                color='blue'
                                onClick={() => setRemoveParentSpaceModalOpen(true)}
                            />
                            {removeParentSpaceModalOpen && (
                                <RemoveParentSpaceModal
                                    close={() => setRemoveParentSpaceModalOpen(false)}
                                />
                            )}
                        </Row>
                        <Row>
                            <Button
                                text='Remove child space'
                                color='blue'
                                onClick={() => setRemoveChildSpaceModalOpen(true)}
                            />
                            {removeChildSpaceModalOpen && (
                                <RemoveChildSpaceModal
                                    close={() => setRemoveChildSpaceModalOpen(false)}
                                />
                            )}
                        </Row>
                        <Row>
                            <Button
                                text='Delete'
                                color='red'
                                onClick={() => setDeleteSpaceModalOpen(true)}
                            />
                            {deleteSpaceModalOpen && (
                                <DeleteSpaceModal close={() => setDeleteSpaceModalOpen(false)} />
                            )}
                        </Row>
                    </>
                )}
            </Column>
        </Column>
    )
}

export default SpacePageSettings

// function updateNotification(id, key, payload)
//     // const newNotifications = [...notifications]
//     // const notification = newNotifications.find((n) => n.id === id)
//     // notification[key] = payload
//     // setNotifications(newNotifications)
//     // console.log('newNotifications: ', newNotifications)
//

// {selectedSection === 'requests' &&
//     requests.map((notification: any) => (
//         <NotificationCard
//             notification={notification}
//             location='space'
//             key={notification.id}
//             updateNotification={updateNotification}
//         />
//     ))}

/* <div className={styles.header}>
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
</div> */

// {accountDataLoading || spaceDataLoading ? (
//     <p>Loading...</p>
// ) : (
//     <p>Not moderator</p>
// )}
