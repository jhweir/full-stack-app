import React from 'react'
import styles from '@styles/components/Modal.module.scss'
import CloseOnClickOutside from '@components/CloseOnClickOutside'
import CloseButton from '@components/CloseButton'

const Modal = (props: { close: () => void; children: any; maxWidth?: number }): JSX.Element => {
    const { close, children, maxWidth } = props
    return (
        <div className={styles.background}>
            <CloseOnClickOutside onClick={close}>
                <div className={styles.modal} style={{ maxWidth }}>
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
    maxWidth: null,
}

export default Modal
