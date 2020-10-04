import React from 'react'
import styles from '../styles/components/SmallFlagImage.module.scss'

function SmallFlagImage(props) {
    const { imagePath, size } = props
    return (
        <div className={styles.flagImageWrapper} style={{ width: size, height: size }}>
            {imagePath === null
                ? <div className={styles.placeholderWrapper}>
                    <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                </div>
                : <img className={styles.flagImage} src={imagePath} alt=''/>
            }
        </div>
    )
}

export default SmallFlagImage