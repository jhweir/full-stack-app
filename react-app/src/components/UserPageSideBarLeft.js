import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../contexts/AccountContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/UserPageSideBarLeft.module.scss'
//import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'

function UserPageSideBarLeft(props) {
    const { isOwnAccount, setImageUploadModalOpen } = props
    const { accountData } = useContext(AccountContext)
    const { userData } = useContext(UserContext)
    //let isOwnAccount = accountData && userData.id === accountData.id

    return (
        <div className={styles.sideBarLeft}>
            {/* <SideBarLeftPlaceholder/> */}
            <div className={styles.sideBarLeftHolonName}>{ userData && userData.name }</div>
            {userData.profileImagePath != null &&
                <img className={styles.sideBarLeftFlagImage} src={userData.profileImagePath} alt=''/>
            }
            {userData.profileImagePath === null &&
                <div className={styles.sideBarLeftFlagImagePlaceholderWrapper}>
                    <img className={styles.sideBarLeftFlagImagePlaceholder} src='/icons/user-solid.svg' alt=''/>
                </div>
            }
            <div className={styles.sideBarLeftNavButtons}>
                {isOwnAccount &&
                    <>
                        <div className="wecoButton" onClick={() => setImageUploadModalOpen(true)}>Upload new image</div>
                        <Link className={styles.sideBarLeftNavButton}
                            to={ `/u/${userData && userData.name}/settings` }>
                            Settings
                        </Link>
                    </>
                }
                <Link className={styles.sideBarLeftNavButton}
                    to={ `/u/${userData && userData.name}` }>
                    About
                </Link>
                <Link className={styles.sideBarLeftNavButton}
                    to={ `/u/${userData && userData.name}/created-posts` }>
                    Created Posts
                </Link>
                <span className="sub-text mt-20">{userData && userData.bio}</span>
            </div>
        </div>
    )
}

export default UserPageSideBarLeft