import React from 'react'
import styles from '../styles/components/SmallFlagImage.module.scss'

function SmallFlagImage(props) {
    const { type, imagePath, size } = props

    let placeholderPath
    if (type === 'user') placeholderPath = 'user-solid.svg'
    if (type === 'space') placeholderPath = 'users-solid.svg'

    return (
        <div className={styles.flagImageWrapper} style={{ width: size, height: size }}>
            {imagePath === null
                ? <div className={styles.placeholderWrapper}>
                    <img className={`${styles.placeholder} ${type === 'user' && styles.user}`} src={`/icons/${placeholderPath}`} alt=''/>
                </div>
                : <img className={styles.flagImage} src={imagePath} alt=''/>
            }
        </div>
    )
}

export default SmallFlagImage