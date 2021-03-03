import React, { useContext, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../contexts/AccountContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/NavBarDropDownModal.module.scss'

function NavBarDropDownModal() {
    const { setNavBarDropDownModalOpen, setAccountData, accountData, logOut, notifications } = useContext(AccountContext)
    const { setUserHandle } = useContext(UserContext)

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setNavBarDropDownModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modalPositioner}>
                <div className={styles.modal} ref={ref}>
                    <Link to={`/u/${accountData.handle}/notifications`}
                        className={styles.link}
                        onClick={() => { setNavBarDropDownModalOpen(false); setUserHandle(accountData.handle) }}>
                        <img className={styles.linkIcon} src={`/icons/bell-solid.svg`}/>
                        <span className={`${styles.linkText} ${accountData.unseen_notifications && 'ml-10'}`}>Notifications</span>
                        {accountData.unseen_notifications > 0 &&
                            <div className={styles.notification}>{ accountData.unseen_notifications }</div>
                        }
                    </Link>
                    <Link to={`/u/${accountData.handle}/messages`}
                        className={styles.link}
                        onClick={() => { setNavBarDropDownModalOpen(false); setUserHandle(accountData.handle) }}>
                        <img className={styles.linkIcon} src={`/icons/envelope-solid.svg`}/>
                        <span className={styles.linkText}>Messages</span>
                    </Link>
                    <Link to={`/u/${accountData.handle}/posts`}
                        className={styles.link}
                        onClick={() => { setNavBarDropDownModalOpen(false); setUserHandle(accountData.handle) }}>
                        <img className={styles.linkIcon} src={`/icons/edit-solid.svg`}/>
                        <span className={styles.linkText}>Posts</span>
                    </Link>
                    {/* <Link to={`/u/${accountData.handle}/about`}
                        className={styles.link}
                        onClick={() => { setNavBarDropDownModalOpen(false); setUserHandle(accountData.handle) }}>
                        <img className={styles.linkIcon} src={`/icons/book-open-solid.svg`}/>
                        <span className={styles.linkText}>About</span>
                    </Link> */}
                    <Link to={`/u/${accountData.handle}/settings`}
                        className={styles.link}
                        onClick={() => { setNavBarDropDownModalOpen(false); setUserHandle(accountData.handle) }}>
                        <img className={styles.linkIcon} src={`/icons/cog-solid.svg`}/>
                        <span className={styles.linkText}>Settings</span>
                    </Link>
                    <div className="wecoButton mt-10" onClick={() => {
                        setAccountData(null)
                        logOut()
                        setNavBarDropDownModalOpen(false)
                    }}>
                        Log Out
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBarDropDownModal