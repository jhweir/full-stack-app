import React from 'react'
import styles from '@styles/components/Column.module.scss'

const Column = (props: {
    children: any
    margin?: string
    centerX?: boolean
    centerY?: boolean
    width?: number | string
}): JSX.Element => {
    const { children, margin, centerX, centerY, width } = props

    return (
        <div
            className={`${styles.column} ${centerX && styles.centerX} ${centerY && styles.centerY}`}
            style={{ margin, width }}
        >
            {children}
        </div>
    )
}

Column.defaultProps = {
    margin: null,
    centerX: false,
    centerY: false,
    width: null,
}

export default Column
