import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/FlagImage.module.scss'
import { ReactComponent as UserIconSVG } from '../svgs/user-solid.svg'
import { ReactComponent as UsersIconSVG } from '../svgs/users-solid.svg'
import { ReactComponent as PostIconSVG } from '../svgs/edit-solid.svg'

const FlagImage = (props: {
    size: number
    type: string
    imagePath: string | undefined
    outline?: boolean
    shadow?: boolean
    canEdit?: boolean
}): JSX.Element => {
    const { size, type, imagePath, outline, shadow, canEdit } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    let iconSVG
    let iconWidth
    if (type === 'space') {
        iconSVG = <UsersIconSVG />
        iconWidth = '60%'
    }
    if (type === 'user') {
        iconSVG = <UserIconSVG />
        iconWidth = '45%'
    }
    if (type === 'post') {
        iconSVG = <PostIconSVG />
        iconWidth = '50%'
    }

    function openImageUploadModal() {
        setImageUploadType(type === 'space' ? 'holon-flag-image' : 'user-flag-image')
        setImageUploadModalOpen(true)
    }

    return (
        <div
            className={`${styles.wrapper} ${outline && styles.outline} ${shadow && styles.shadow}`}
            style={{ width: size, height: size }}
        >
            {imagePath ? (
                <div
                    className={styles.flagImage}
                    style={{ backgroundImage: `url(${imagePath})` }}
                />
            ) : (
                <div className={styles.placeholderWrapper}>
                    <div className={styles.placeholderIcon} style={{ width: iconWidth }}>
                        {iconSVG}
                    </div>
                </div>
            )}
            {canEdit && (
                <div
                    className={styles.uploadButton}
                    role='button'
                    tabIndex={0}
                    onClick={openImageUploadModal}
                    onKeyDown={openImageUploadModal}
                >
                    Upload new flag image
                </div>
            )}
        </div>
    )
}

FlagImage.defaultProps = {
    outline: false,
    shadow: false,
    canEdit: false,
}

export default FlagImage
