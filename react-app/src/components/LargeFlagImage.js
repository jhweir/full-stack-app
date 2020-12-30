import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/LargeFlagImage.module.scss'

function LargeFlagImage(props) {
    const { size, imagePath, canEdit, type } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    let iconPath, imageUploadType
    if (type === 'space') { iconPath = '/icons/users-solid.svg'; imageUploadType = 'holon-flag-image' }
    if (type === 'user') { iconPath = '/icons/user-solid.svg'; imageUploadType = 'user-flag-image' }

    return (
        <div className={styles.flagImageWrapper} style={{ width: size, height: size }}>
            {imagePath === null ?
                <div className={styles.placeholderWrapper}>
                    <img className={styles.placeholder} src={iconPath} alt='' style={{ width: type === 'user' && '50%' }}/>
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