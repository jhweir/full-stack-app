import React from 'react'
import styles from '@styles/components/Column.module.scss'

const Column = (props: {
    children: any
    style?: any
    centerX?: boolean
    centerY?: boolean
    scroll?: boolean
}): JSX.Element => {
    const { children, style, centerX, centerY, scroll } = props

    return (
        <div
            className={`${styles.column} ${centerX && styles.centerX} ${
                centerY && styles.centerY
            } ${scroll && styles.scroll} hide-scrollbars`}
            style={style}
        >
            {children}
        </div>
    )
}

Column.defaultProps = {
    style: null,
    centerX: false,
    centerY: false,
    scroll: false,
}

export default Column
