import React from 'react'
import styles from '../styles/components/CloseButton.module.scss'

function CloseButton(props) {
    const { onClick } = props

    return (
        <img 
            className={styles.closeButton}
            src='/icons/close-01.svg'
            onClick={onClick}
        />
    )
}

export default CloseButton