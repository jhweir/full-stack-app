import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPageSettings.module.scss'
import Button from '@components/Button'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import Column from '@components/Column'
import Row from '@components/Row'
import UpdateUserNameModal from '@components/Modals/UpdateUserNameModal'
import UpdateUserBioModal from '@components/Modals/UpdateUserBioModal'

const UserPageSettings = (): JSX.Element => {
    const { accountData, setSettingModalType, setSettingModalOpen } = useContext(AccountContext)
    const { setSelectedUserSubPage } = useContext(UserContext)
    const { handle, name, bio } = accountData

    const [updateUserNameModalOpen, setUpdateUserNameModalOpen] = useState(false)
    const [updateUserBioModalOpen, setUpdateUserBioModalOpen] = useState(false)

    const handleClick = (settingType: string) => {
        setSettingModalType(settingType)
        setSettingModalOpen(true)
    }

    useEffect(() => {
        setSelectedUserSubPage('settings')
    }, [])

    return (
        <Column className={styles.wrapper}>
            <Column className={styles.content}>
                {/* <Row centerY>
                    <h1>Handle:</h1>
                    <p>{handle}</p>
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
                </Row> */}
                <Row centerY>
                    <h1>Name:</h1>
                    <p>{name}</p>
                    <Button
                        text='Edit'
                        color='blue'
                        size='small'
                        onClick={() => setUpdateUserNameModalOpen(true)}
                    />
                    {updateUserNameModalOpen && (
                        <UpdateUserNameModal close={() => setUpdateUserNameModalOpen(false)} />
                    )}
                </Row>
                <Column style={{ alignItems: 'start' }}>
                    <h1>Bio:</h1>
                    <ShowMoreLess height={75}>
                        <Markdown text={bio} />
                    </ShowMoreLess>
                    <Button
                        text='Edit'
                        color='blue'
                        size='small'
                        style={{ marginTop: 10 }}
                        onClick={() => setUpdateUserBioModalOpen(true)}
                    />
                    {updateUserBioModalOpen && (
                        <UpdateUserBioModal close={() => setUpdateUserBioModalOpen(false)} />
                    )}
                </Column>
            </Column>
        </Column>
        // <div className={styles.wrapper}>
        //     <div className={styles.header}>Settings</div>
        //     <div className={styles.body}>
        //         <div className={styles.field}>
        //             <div className={styles.text}>
        //                 <b>Name:</b> {accountData && accountData.name}
        //             </div>
        //             <div
        //                 className={styles.linkText}
        //                 role='button'
        //                 tabIndex={0}
        //                 onClick={() => handleClick('change-user-name')}
        //                 onKeyDown={() => handleClick('change-user-name')}
        //             >
        //                 Change
        //             </div>
        //         </div>
        //         <div className={styles.field}>
        //             <div className={styles.text}>
        //                 <b>Bio:</b> {accountData && accountData.bio}
        //             </div>
        //             <div
        //                 className={styles.linkText}
        //                 role='button'
        //                 tabIndex={0}
        //                 onClick={() => handleClick('change-user-bio')}
        //                 onKeyDown={() => handleClick('change-user-bio')}
        //             >
        //                 Change
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default UserPageSettings
