import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/LargeFlagImage.module.scss'

const LargeFlagImage = (props: {
    size: number
    imagePath: string | undefined
    canEdit: boolean
    type: string
    yOffset?: number
}): JSX.Element => {
    const { size, imagePath, canEdit, type, yOffset } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    let iconPath
    let imageUploadType
    if (type === 'space') {
        iconPath = '/icons/users-solid.svg'
        imageUploadType = 'holon-flag-image'
    }
    if (type === 'user') {
        iconPath = '/icons/user-solid.svg'
        imageUploadType = 'user-flag-image'
    }

    const handleClick = () => {
        setImageUploadType(imageUploadType)
        setImageUploadModalOpen(true)
    }

    return (
        <div
            className={styles.flagImageWrapper}
            style={{ width: size, height: size, top: yOffset }}
        >
            {imagePath === null ? (
                <div className={styles.placeholderWrapper}>
                    <img
                        className={styles.placeholder}
                        src={iconPath}
                        alt='placeholder'
                        style={{ width: type === 'user' ? '50%' : '' }}
                    />
                </div>
            ) : (
                <img className={styles.flagImage} src={imagePath} alt='' />
            )}
            {canEdit && (
                <div
                    className={styles.uploadButton}
                    role='button'
                    tabIndex={0}
                    onClick={handleClick}
                    onKeyDown={handleClick}
                >
                    Upload new flag image
                </div>
            )}
        </div>
    )
}

LargeFlagImage.defaultProps = {
    yOffset: null,
}

export default LargeFlagImage
