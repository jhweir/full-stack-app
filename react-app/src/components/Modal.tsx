import React from 'react'
import styles from '@styles/components/Modal.module.scss'
import CloseOnClickOutside from '@components/CloseOnClickOutside'
import CloseButton from '@components/CloseButton'

const Modal = (props: {
    close: () => void
    children: any
    minWidth?: number
    maxWidth?: number
    centered?: boolean
}): JSX.Element => {
    const { close, children, minWidth, maxWidth, centered } = props
    return (
        <div className={styles.background}>
            <CloseOnClickOutside onClick={close}>
                <div
                    className={`${styles.modal} ${centered && styles.centered}`}
                    style={{ minWidth, maxWidth }}
                >
                    <div className={styles.closeButtonWrapper}>
                        <CloseButton size={20} onClick={close} />
                    </div>
                    {children}
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

Modal.defaultProps = {
    minWidth: null,
    maxWidth: null,
    centered: false,
}

export default Modal
