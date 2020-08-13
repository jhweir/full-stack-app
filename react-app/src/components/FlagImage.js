import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/FlagImage.module.scss'

function FlagImage(props) {
    const { flagImagePath, imageUploadType, canEdit } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    return (
        <div className={styles.flagImageWrapper}>
            {flagImagePath === null
                ? <div className={styles.placeholderWrapper}>
                    <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                </div>
                : <img className={styles.flagImage} src={flagImagePath} alt=''/>
            }
            {canEdit &&
                <div 
                    className={styles.uploadButton}
                    onClick={() => { setImageUploadType(imageUploadType); setImageUploadModalOpen(true) }}>
                    Upload new flag image
                </div>
            }
        </div>
    )
}

export default FlagImage