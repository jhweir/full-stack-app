import React from 'react'
import styles from '@styles/components/Button.module.scss'
import LoadingWheel from '@components/LoadingWheel'

const Button = (props: {
    text?: string
    icon?: JSX.Element
    colour: string
    size: string
    margin?: string
    disabled?: boolean
    loading?: boolean
    submit?: boolean
    onClick?: () => void
}): JSX.Element => {
    const { text, icon, colour, size, margin, disabled, loading, submit, onClick } = props

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
            {!!text && <p>{text}</p>}
            {!!icon && icon}
            {loading && <LoadingWheel size={25} />}
        </button>
    )
}

Button.defaultProps = {
    text: null,
    icon: null,
    margin: '0 0 0 0',
    disabled: false,
    loading: false,
    submit: false,
    onClick: null,
}

export default Button
