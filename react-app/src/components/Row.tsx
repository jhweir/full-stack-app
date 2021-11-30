import React from 'react'
import styles from '@styles/components/Row.module.scss'

const Row = (props: {
    children: any
    centerX?: boolean
    centerY?: boolean
    spaceBetween?: boolean
    wrap?: boolean
    style?: any
}): JSX.Element => {
    const { children, centerX, centerY, spaceBetween, wrap, style } = props

    return (
        <div
            className={`
                ${styles.row} 
                ${centerX && styles.centerX} 
                ${centerY && styles.centerY} 
                ${spaceBetween && styles.spaceBetween} 
                ${wrap && styles.wrap}
            `}
            style={style}
        >
            {children}
        </div>
    )
}

Row.defaultProps = {
    centerX: false,
    centerY: false,
    spaceBetween: false,
    wrap: false,
    style: null,
}

export default Row
