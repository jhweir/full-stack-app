import React from 'react'
import styles from '@styles/components/Button.module.scss'

const Button = (props: {
    text?: string
    icon?: JSX.Element
    colour: string
    size: string
    margin?: string
    disabled?: boolean
    submit?: boolean
    onClick?: () => void
}): JSX.Element => {
    const { text, icon, colour, size, margin, disabled, submit, onClick } = props

    return (
        <button
            className={`${styles.button} ${styles[colour]} ${styles[size]} ${
                disabled && styles.disabled
            }`}
            style={{ margin }}
            type={submit ? 'submit' : 'button'}
            disabled={disabled}
            onClick={onClick}
        >
            {text || icon}
        </button>
    )
}

Button.defaultProps = {
    text: null,
    icon: null,
    margin: '0 0 0 0',
    disabled: false,
    submit: false,
    onClick: null,
}

export default Button
