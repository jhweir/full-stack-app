import React from 'react'
import styles from '@styles/components/Modal.module.scss'
import CloseOnClickOutside from '@components/CloseOnClickOutside'
import CloseButton from '@components/CloseButton'

const Modal = (props: {
    close: () => void
    children: any
    style?: any
    centered?: boolean
}): JSX.Element => {
    const { close, children, style, centered } = props
    return (
        <div className={`${styles.background} hide-scrollbars`}>
            <CloseOnClickOutside onClick={close}>
                <div
                    className={`${styles.modal} ${centered && styles.centered} hide-scrollbars`}
                    style={style}
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
    style: null,
    centered: false,
}

export default Modal
