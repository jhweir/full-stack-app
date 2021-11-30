import React from 'react'
import styles from '@styles/components/StatButton.module.scss'

const StatButton = (props: {
    icon: any
    text?: string
    title?: string
    color?: 'blue'
    iconSize?: number
    margin?: string
    onClick?: () => void
}): JSX.Element => {
    const { icon, text, title, color, iconSize, margin, onClick } = props

    return (
        <button
            className={styles.wrapper}
            style={{ margin }}
            type='button'
            title={title}
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
    margin: null,
    onClick: null,
}

export default StatButton
