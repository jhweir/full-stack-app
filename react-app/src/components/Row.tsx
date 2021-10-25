import React from 'react'
import styles from '@styles/components/Row.module.scss'

const Row = (props: {
    children: any
    margin?: string
    centerX?: boolean
    centerY?: boolean
}): JSX.Element => {
    const { children, margin, centerX, centerY } = props

    return (
        <div
            className={`${styles.row} ${centerX && styles.centerX} ${centerY && styles.centerY}`}
            style={{ margin }}
        >
            {children}
        </div>
    )
}

Row.defaultProps = {
    margin: null,
    centerX: false,
    centerY: false,
}

export default Row
