import React from 'react'
import styles from '@styles/components/Button.module.scss'
import LoadingWheel from '@components/LoadingWheel'

const Button = (props: {
    text?: string
    icon?: JSX.Element
    colour: string
    size?: 'small' | 'medium' | 'large'
    style?: any
    disabled?: boolean
    loading?: boolean
    submit?: boolean
    onClick?: () => void
}): JSX.Element => {
    const { text, icon, colour, size, style, disabled, loading, submit, onClick } = props

    return (
        <button
            className={`${styles.button} ${styles[colour]} ${styles[size || 'medium']} ${
                (disabled || loading) && styles.disabled
            }`}
            style={style}
            type={submit ? 'submit' : 'button'}
            disabled={disabled || loading}
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
    size: 'medium',
    style: null,
    disabled: false,
    loading: false,
    submit: false,
    onClick: null,
}

export default Button
