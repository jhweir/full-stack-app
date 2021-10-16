import React from 'react'
import styles from '@styles/components/CloseButton.module.scss'
import { ReactComponent as TimesIconSVG } from '@svgs/times-solid.svg'

const CloseButton = (props: { size: number; onClick: () => void }): JSX.Element => {
    const { size, onClick } = props

    return (
        <button
            className={styles.closeButton}
            type='button'
            onClick={onClick}
            style={{ width: size, height: size }}
        >
            <TimesIconSVG width={size} height={size} />
        </button>
    )
}

export default CloseButton
