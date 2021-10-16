import React, { useContext } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/CoverImage.module.scss'
import ImageFade from '@components/ImageFade'

const CoverImage = (props: {
    coverImagePath: string | null
    imageUploadType: string
    canEdit: boolean
}): JSX.Element => {
    const { coverImagePath, imageUploadType, canEdit } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    const handleClick = () => {
        setImageUploadType(imageUploadType)
        setImageUploadModalOpen(true)
    }

    // todo: try moshs website colours in background

    return (
        <div className={styles.wrapper}>
            <ImageFade imagePath={coverImagePath} speed={1000}>
                <div className={styles.placeholder} />
            </ImageFade>
            {canEdit && (
                <button type='button' className={styles.uploadButton} onClick={handleClick}>
                    Upload new cover image
                </button>
            )}
        </div>
    )
}

export default CoverImage
