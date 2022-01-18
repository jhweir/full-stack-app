import React, { useContext } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/FlagImage.module.scss'
import FlagImagePlaceholder from '@components/FlagImagePlaceholder'

const FlagImage = (props: {
    type: 'space' | 'user' | 'post'
    size: number
    imagePath: string | null
    className?: string
    outline?: boolean
    shadow?: boolean
    // canEdit?: boolean
}): JSX.Element => {
    const { size, type, imagePath, className, outline, shadow } = props
    // const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    const classes = [styles.wrapper]
    if (className) classes.unshift(className)
    if (outline) classes.push(styles.outline)
    if (shadow) classes.push(styles.shadow)
    if (size < 50) classes.push(styles.small)

    // function uploadImage() {
    //     setImageUploadType(type === 'space' ? 'holon-flag-image' : 'user-flag-image')
    //     setImageUploadModalOpen(true)
    // }

    return (
        <div className={classes.join(' ')} style={{ width: size, height: size }}>
            {imagePath ? (
                <>
                    <div className={styles.background} />
                    <img className={styles.flagImage} src={imagePath} alt='' />
                </>
            ) : (
                <FlagImagePlaceholder type={type} />
            )}
            {/* {canEdit && (
                <button className={styles.uploadButton} type='button' onClick={uploadImage}>
                    Upload new flag image
                </button>
            )} */}
        </div>
    )
}

FlagImage.defaultProps = {
    className: null,
    outline: false,
    shadow: false,
    // canEdit: false,
}

export default FlagImage
