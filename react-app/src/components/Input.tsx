import React from 'react'
import styles from '@styles/components/Input.module.scss'
import { ReactComponent as DangerIconSVG } from '@svgs/exclamation-circle-solid.svg'
import { ReactComponent as SuccessIconSVG } from '@svgs/check-circle-solid.svg'

const Input = (props: {
    type: 'text' | 'number' | 'text-area'
    title?: string
    prefix?: string
    placeholder?: string
    state: 'default' | 'valid' | 'invalid'
    errors?: string[]
    value: string
    onChange: (payload: string) => void
    rows?: number
}): JSX.Element => {
    const { type, title, prefix, placeholder, state, errors, value, onChange, rows } = props

    return (
        <div className={styles.wrapper}>
            {title && <h1>{title}</h1>}
            {state === 'invalid' && errors && errors.map((error) => <h2 key={error}>{error}</h2>)}
            <div className={styles[state]}>
                {prefix && <span>{prefix}</span>}
                {type === 'text-area' ? (
                    <textarea
                        rows={rows}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                ) : (
                    <input
                        placeholder={placeholder}
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
                {state === 'invalid' && <DangerIconSVG />}
                {state === 'valid' && <SuccessIconSVG />}
            </div>
        </div>
    )
}

Input.defaultProps = {
    title: null,
    prefix: null,
    placeholder: null,
    errors: null,
    rows: null,
}

export default Input
