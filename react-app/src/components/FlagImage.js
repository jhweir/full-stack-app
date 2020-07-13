import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import { HolonContext } from '../contexts/HolonContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/FlagImage.module.scss'

function FlagImage(props) {
    const { type } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)
    const { holonData, isModerator } = useContext(HolonContext)
    const { userData, isOwnAccount } = useContext(UserContext)

    let data = []
    let canEdit = false
    if (type === 'holon') { data = holonData; canEdit = isModerator }
    if (type === 'user') { data = userData; canEdit = isOwnAccount }

    return (
        <div className={styles.flagImageWrapper}>
            {data.flagImagePath === null
                ? <div className={styles.placeholderContainer}>
                    <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                </div>
                : <img className={styles.flagImage} src={data.flagImagePath} alt=''/>
            }
            {/* {canEdit && */}
                <div 
                    className={styles.uploadButton}
                    onClick={() => { setImageUploadType(`${type}-flag-image`); setImageUploadModalOpen(true)  }}>
                    Upload new flag image
                </div>
            {/* } */}
        </div>
    )
}

export default FlagImage