import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/CoverImage.module.scss'

const CoverImage = (props: {
    coverImagePath: string | null | undefined
    imageUploadType: string
    canEdit: boolean
}): JSX.Element => {
    const { coverImagePath, imageUploadType, canEdit } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    const handleClick = () => {
        setImageUploadType(imageUploadType)
        setImageUploadModalOpen(true)
    }

    return (
        <div className={styles.coverImageWrapper}>
            {coverImagePath === null ? (
                <div className={styles.placeholder} />
            ) : (
                <div
                    className={styles.coverImage}
                    style={{ backgroundImage: `url(${coverImagePath})` }}
                />
            )}
            {canEdit && (
                <div
                    className={styles.uploadButton}
                    role='button'
                    tabIndex={0}
                    onClick={handleClick}
                    onKeyDown={handleClick}
                >
                    Upload new cover image
                </div>
            )}
        </div>
    )
}

export default CoverImage
