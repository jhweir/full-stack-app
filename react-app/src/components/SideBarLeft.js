import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/SideBarLeft.module.scss'
import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'

function SideBarLeft() {
    const { holonData, updateHolonContext, isLoading, selectedHolonSubPage, setSelectedHolonSubPage, isFollowing, setIsFollowing } = useContext(HolonContext)
    const { accountData } = useContext(AccountContext)

    function followSpace() {
        console.log('followSpace run')
        // if space is already followed by user, unfollow space
        if (isFollowing) {
            setIsFollowing(false)
            axios
                .put(config.environmentURL + `/unfollowHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(res => { console.log(res) })
                .catch(error => { console.log(error) })
        } else {
            // otherwise follow space
            setIsFollowing(true)
            axios
                .post(config.environmentURL + `/followHolon`, { holonId: holonData.id, userId: accountData.id })
                .then(res => { console.log(res) })
                .catch(error => { console.log(error) })
        }
    }

    if (holonData) {
        return (
            <div className={styles.sideBarLeft}>
                <SideBarLeftPlaceholder/>
                <div className={`${styles.content} ${(!isLoading && styles.visible)}`}>
                    <div className={styles.holonName}>{ holonData.name }</div>
                    <div className={styles.flagImageWrapper}>
                        <img className={styles.flagImagePlaceholder} src='/icons/users-solid.svg' alt='space-flag'/>
                    </div>
                    <div className={styles.navButtons}>
                        {accountData &&
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
                            onClick={() => { updateHolonContext(holonData.handle); setSelectedHolonSubPage('about') }}>
                            <img className={styles.navButtonIcon} src='/icons/book-open-solid.svg'/>
                            <span className={styles.navButtonText}>About</span>
                        </Link>
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'posts' && styles.selected}`}
                            to={`/h/${holonData.handle}/posts`}
                            onClick={() => { updateHolonContext(holonData.handle); setSelectedHolonSubPage('posts') }}>
                            <img className={styles.navButtonIcon} src='/icons/edit-solid.svg'/>
                            <span className={styles.navButtonText}>Posts</span>
                        </Link>
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'spaces' && styles.selected}`}
                            to={`/h/${holonData.handle}/spaces`}
                            onClick={() => { updateHolonContext(holonData.handle); setSelectedHolonSubPage('spaces') }}>
                            <img className={styles.navButtonIcon} src='/icons/overlapping-circles-thick.svg'/>
                            <span className={styles.navButtonText}>Spaces</span>
                        </Link>
                        <Link className={`${styles.navButton} ${selectedHolonSubPage === 'users' && styles.selected}`}
                            to={`/h/${holonData.handle}/users`}
                            onClick={() => { updateHolonContext(holonData.handle); setSelectedHolonSubPage('users') }}>
                            <img className={styles.navButtonIcon} src='/icons/users-solid.svg'/>
                            <span className={styles.navButtonText}>Users</span>
                        </Link>
                        <span className="sub-text mt-20">{holonData.description}</span>
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default SideBarLeft
