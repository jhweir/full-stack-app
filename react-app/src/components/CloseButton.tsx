import React from 'react'
import styles from '../styles/components/CloseButton.module.scss'

const CloseButton = (props: { onClick: () => void }): JSX.Element => {
    const { onClick } = props

    return (
        <div role='button' tabIndex={0} onClick={onClick} onKeyDown={onClick}>
            <img className={styles.closeButton} src='/icons/close-01.svg' aria-label='test' />
        </div>
    )
}

export default CloseButton
