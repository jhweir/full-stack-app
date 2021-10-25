import React from 'react'
import styles from '@styles/components/Column.module.scss'

const Column = (props: {
    children: any
    margin?: string
    centerX?: boolean
    centerY?: boolean
}): JSX.Element => {
    const { children, margin, centerX, centerY } = props

    return (
        <div
            className={`${styles.column} ${centerX && styles.centerX} ${centerY && styles.centerY}`}
            style={{ margin }}
        >
            {children}
        </div>
    )
}

Column.defaultProps = {
    margin: null,
    centerX: false,
    centerY: false,
}

export default Column
