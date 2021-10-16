import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/NavBarDropDownModal.module.scss'
import CloseOnClickOutside from '@components/CloseOnClickOutside'

const NavBarDropDownModal = (): JSX.Element => {
    const { setNavBarDropDownModalOpen, accountData, logOut } = useContext(AccountContext)

    return (
        <div className={styles.modalWrapper}>
            {/* <div className={styles.modalPositioner}> */}
            <CloseOnClickOutside onClick={() => setNavBarDropDownModalOpen(false)}>
                <div className={styles.modal}>
                    {/* <Link
                            to={`/u/${accountData.handle}/notifications`}
                            className={styles.link}
                            onClick={() => {
                                setNavBarDropDownModalOpen(false)
                            }}
                        >
                            <img
                                className={styles.linkIcon}
                                src='/icons/bell-solid.svg'
                                aria-label='bell'
                            />
                            <span
                                className={`${styles.linkText} ${
                                    accountData.unseen_notifications && 'ml-10'
                                }`}
                            >
                                Notifications
                            </span>
                            {accountData.unseen_notifications > 0 && (
                                <div className={styles.notification}>
                                    {accountData.unseen_notifications}
                                </div>
                            )}
                        </Link>
                        <Link
                            to={`/u/${accountData.handle}/messages`}
                            className={styles.link}
                            onClick={() => {
                                setNavBarDropDownModalOpen(false)
                            }}
                        >
                            <img
                                className={styles.linkIcon}
                                src='/icons/envelope-solid.svg'
                                aria-label='envelope'
                            />
                            <span className={styles.linkText}>Messages</span>
                        </Link>
                        <Link
                            to={`/u/${accountData.handle}/posts`}
                            className={styles.link}
                            onClick={() => {
                                setNavBarDropDownModalOpen(false)
                            }}
                        >
                            <img
                                className={styles.linkIcon}
                                src='/icons/edit-solid.svg'
                                aria-label='posts'
                            />
                            <span className={styles.linkText}>Posts</span>
                        </Link> */}
                    <Link
                        to={`/u/${accountData.handle}/about`}
                        className={styles.link}
                        onClick={() => {
                            setNavBarDropDownModalOpen(false)
                        }}
                    >
                        <img className={styles.linkIcon} src='/icons/user-solid.svg' />
                        <span className={styles.linkText}>Profile</span>
                    </Link>
                    {/* <Link
                            to={`/u/${accountData.handle}/settings`}
                            className={styles.link}
                            onClick={() => {
                                setNavBarDropDownModalOpen(false)
                            }}
                        >
                            <img
                                className={styles.linkIcon}
                                src='/icons/cog-solid.svg'
                                aria-label='settings'
                            />
                            <span className={styles.linkText}>Settings</span>
                        </Link> */}
                    <div
                        className='wecoButton mt-10'
                        role='button'
                        tabIndex={0}
                        onClick={() => {
                            logOut()
                            setNavBarDropDownModalOpen(false)
                        }}
                        onKeyDown={() => {
                            logOut()
                            setNavBarDropDownModalOpen(false)
                        }}
                    >
                        Log Out
                    </div>
                </div>
            </CloseOnClickOutside>
            {/* </div> */}
        </div>
    )
}

export default NavBarDropDownModal
