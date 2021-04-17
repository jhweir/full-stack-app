import React from 'react'
import styles from '../styles/components/SmallFlagImage.module.scss'

const SmallFlagImage = (props: {
    type: string
    imagePath: string | undefined
    size: number
    outline?: boolean
}): JSX.Element => {
    const { type, imagePath, size, outline } = props

    let placeholderPath
    if (type === 'user') placeholderPath = 'user-solid.svg'
    if (type === 'space') placeholderPath = 'users-solid.svg'
    if (type === 'post') placeholderPath = 'edit-solid.svg'

    return (
        <div
            className={`${styles.flagImageWrapper} ${outline && styles.outline}`}
            style={{ width: size, height: size }}
        >
            {imagePath == null ? (
                <div className={styles.placeholderWrapper}>
                    <img
                        className={`${styles.placeholder} ${type === 'post' && styles.medium} ${
                            type === 'user' && styles.small
                        }`}
                        src={`/icons/${placeholderPath}`}
                        alt=''
                    />
                </div>
            ) : (
                <img className={styles.flagImage} src={imagePath} alt='' />
            )}
        </div>
    )
}

SmallFlagImage.defaultProps = {
    outline: false,
}

export default SmallFlagImage
