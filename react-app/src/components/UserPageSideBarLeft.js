import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../contexts/AccountContext'
// import { HolonContext } from '../contexts/HolonContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageSideBarLeft.module.scss'
//import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'

function UserPageSideBarLeft() {
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)
    const { userData, selectedSubPage, setSelectedSubPage, isOwnAccount } = useContext(UserContext)

    return (
        <div className={styles.sideBarLeft}>
            {/* <SideBarLeftPlaceholder/> */}
            <div className={styles.flagImageWrapper}>
                {userData.profileImagePath === null ?
                    <div className={styles.flagImagePlaceholderWrapper}>
                        <img className={styles.flagImagePlaceholder} src='/icons/user-solid.svg' alt=''/>
                    </div> :
                    <img className={styles.flagImage} src={userData.profileImagePath} alt=''/>
                }
                {isOwnAccount &&
                    <div 
                        className={styles.flagImageUploadButton}
                        onClick={() => { setImageUploadType('user-flag-image'); setImageUploadModalOpen(true) }}>
                        Upload new image
                    </div>
                }
            </div>
            <div className={styles.userName}>{ userData.name }</div>
            <div className={styles.navButtons}>
                {isOwnAccount &&
                    <Link className={`${styles.navButton} ${selectedSubPage === 'settings' && styles.selected}`}
                        to={`/u/${userData.name}/settings`} style={{marginBottom: 10}}
                        onClick={() => setSelectedSubPage('settings')}>
                        <img className={styles.navButtonIcon} src='/icons/cog-solid.svg'/>
                        <span className={styles.navButtonText}>Settings</span>
                    </Link>
                }
                <Link className={`${styles.navButton} ${selectedSubPage === 'about' && styles.selected}`}
                    to={`/u/${userData.name}`}
                    onClick={() => setSelectedSubPage('about')}>
                    <img className={styles.navButtonIcon} src='/icons/book-open-solid.svg'/>
                    <span className={styles.navButtonText}>About</span>
                </Link>
                <Link className={`${styles.navButton} ${selectedSubPage === 'created-posts' && styles.selected}`}
                    to={`/u/${userData.name}/created-posts`}
                    onClick={() => setSelectedSubPage('created-posts')}>
                    <img className={styles.navButtonIcon} src='/icons/edit-solid.svg'/>
                    <span className={styles.navButtonText}>Created Posts</span>
                </Link>
                <span className="sub-text mt-20">{userData.bio}</span>
            </div>
        </div>
    )
}

export default UserPageSideBarLeft