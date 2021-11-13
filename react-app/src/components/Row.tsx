import React from 'react'
import styles from '@styles/components/Row.module.scss'

const Row = (props: {
    children: any
    margin?: string
    centerX?: boolean
    centerY?: boolean
    wrap?: boolean
}): JSX.Element => {
    const { children, margin, centerX, centerY, wrap } = props

    return (
        <div
            className={`${styles.row} ${centerX && styles.centerX} ${centerY && styles.centerY} ${
                wrap && styles.wrap
            }`}
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
    wrap: false,
}

export default Row
