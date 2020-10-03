import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/LargeFlagImage.module.scss'

function LargeFlagImage(props) {
    const { imagePath, canEdit, imageUploadType } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    return (
        <div className={styles.flagImageWrapper}>
            {imagePath === null
                ? <div className={styles.placeholderWrapper}>
                    <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                </div>
                : <img className={styles.flagImage} src={imagePath} alt=''/>
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

export default LargeFlagImage