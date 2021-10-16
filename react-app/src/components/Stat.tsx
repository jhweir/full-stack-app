import React from 'react'
import styles from '@styles/components/Stat.module.scss'

const Stat = (props: {
    icon: any
    value: number
    title: string
    small?: boolean
    onClick?: () => void
}): JSX.Element => {
    const { icon, value, title, small, onClick } = props

    return (
        <div
            className={styles.wrapper}
            role='button'
            tabIndex={0}
            onClick={onClick}
            onKeyDown={onClick}
            title={`${value} ${title}`}
        >
            <div className={styles.icon}>{icon}</div>
            <p>{value}</p>
            {!small && <p>{title}</p>}
        </div>
    )
}

Stat.defaultProps = {
    small: false,
    onClick: null,
}

export default Stat
