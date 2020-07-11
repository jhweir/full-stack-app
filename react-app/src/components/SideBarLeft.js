import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/SideBarLeft.module.scss'
import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'

function SideBarLeft() {
    const { isLoggedIn, accountData, setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)
    const { 
        holonContextLoading,
        getHolonData,
        getHolonPosts,
        getHolonFollowers,
        holonData,
        isFollowing,
        setIsFollowing,
        isModerator,
        selectedHolonSubPage,
        setSelectedHolonSubPage
    } = useContext(HolonContext)

    function followSpace() {
        if (isFollowing) {
            setIsFollowing(false)
            axios
                .put(config.environmentURL + `/unfollowHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(setTimeout(() => { getHolonFollowers() }, 200))
                .catch(error => { console.log(error) })
        } else {
            setIsFollowing(true)
            axios
                .post(config.environmentURL + `/followHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(setTimeout(() => { getHolonFollowers() }, 200))
                .catch(error => { console.log(error) })
        }
    }

    if (holonData) {
        return (
            <div className={styles.sideBarLeft}>
                <SideBarLeftPlaceholder/>
                <div className={`${styles.content} ${(!holonContextLoading && styles.visible)}`}>
                    {/* TODO: Create flag image component */}
                    <div className={styles.flagImageWrapper}>
                        {holonData.flagImagePath === null
                            ? <div className={styles.flagImagePlaceholderWrapper}>
                                <img className={styles.flagImagePlaceholder} src='/icons/users-solid.svg' alt='space-flag'/>
                            </div>
                            : <img className={styles.flagImage} src={holonData.flagImagePath} alt=''/>
                        }
                        {isModerator &&
                            <div 
                                className={styles.flagImageUploadButton}
                                onClick={() => { setImageUploadType('holon-flag-image'); setImageUploadModalOpen(true)  }}>
                                Upload new image
                            </div>
                        }
                    </div>
                    <div className={styles.holonName}>{ holonData.name }</div>
                    <div className={styles.navButtons}>
                        {isModerator &&
                            <div className={styles.navButton} style={{marginBottom: 10}}>
                                <img className={styles.navButtonIcon} src='/icons/crown-solid.svg'/>
                                <span className={styles.navButtonText}>Moderator</span>
                            </div>
                        }
                        {isLoggedIn && holonData.id !== 1 &&
                            <div className={styles.navButton} style={{marginBottom: 10}} onClick={() => { followSpace() }}>
                                <img
                                    className={styles.navButtonIcon}
                                    src={isFollowing ? '/icons/eye-solid.svg' : '/icons/eye-slash-solid.svg'}
                                />
                                <span className={styles.navButtonText}>{isFollowing ? 'Following' : 'Not Following'}</span>
                            </div>
                        }
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'about' && styles.selected}`}
                            to={`/h/${holonData.handle}/about`}
                            onClick={() => { setSelectedHolonSubPage('about') }}>
                            <img className={styles.navButtonIcon} src='/icons/book-open-solid.svg'/>
                            <span className={styles.navButtonText}>About</span>
                        </Link>
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'posts' && styles.selected}`}
                            to={`/h/${holonData.handle}/posts`}
                            onClick={() => { setSelectedHolonSubPage('posts') }}>
                            <img className={styles.navButtonIcon} src='/icons/edit-solid.svg'/>
                            <span className={styles.navButtonText}>Posts</span>
                        </Link>
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'spaces' && styles.selected}`}
                            to={`/h/${holonData.handle}/spaces`}
                            onClick={() => { getHolonData(); setSelectedHolonSubPage('spaces') }}>
                            <img className={styles.navButtonIcon} src='/icons/overlapping-circles-thick.svg'/>
                            <span className={styles.navButtonText}>Spaces</span>
                        </Link>
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'users' && styles.selected}`}
                            to={`/h/${holonData.handle}/users`}
                            onClick={() => { setSelectedHolonSubPage('users') }}>
                            <img className={styles.navButtonIcon} src='/icons/users-solid.svg'/>
                            <span className={styles.navButtonText}>{holonData.handle === 'root' ? 'Users' : 'Followers'}</span>
                        </Link>
                        <span className="sub-text mt-20">{holonData.description}</span>
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default SideBarLeft
