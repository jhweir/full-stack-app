import React from 'react'
import styles from '@styles/components/StatButton.module.scss'

const StatButton = (props: {
    icon: any
    text?: string
    title?: string
    color?: 'blue'
    iconSize?: number
    style?: any
    disabled?: boolean
    onClick?: () => void
}): JSX.Element => {
    const { icon, text, title, color, iconSize, style, disabled, onClick } = props

    return (
        <button
            className={styles.wrapper}
            type='button'
            title={title}
            style={style}
            disabled={disabled}
            onClick={onClick}
        >
            <div
                className={`${styles.icon} ${color && styles[color]}`}
                style={{ width: iconSize, height: iconSize }}
            >
                {icon}
            </div>
            <p>{text}</p>
        </button>
    )
}

StatButton.defaultProps = {
    text: null,
    title: null,
    color: false,
    iconSize: 20,
    style: null,
    disabled: false,
    onClick: null,
}

export default StatButton
