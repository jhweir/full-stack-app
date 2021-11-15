import React from 'react'
import styles from '@styles/components/Column.module.scss'

const Column = (props: {
    children: any
    margin?: string
    centerX?: boolean
    centerY?: boolean
    width?: number | string
    maxHeight?: number
    scroll?: boolean
}): JSX.Element => {
    const { children, margin, centerX, centerY, width, maxHeight, scroll } = props

    return (
        <div
            className={`${styles.column} ${centerX && styles.centerX} ${
                centerY && styles.centerY
            } ${scroll && styles.scroll} hide-scrollbars`}
            style={{ margin, width, maxHeight }}
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
    maxHeight: null,
    scroll: false,
}

export default Column
