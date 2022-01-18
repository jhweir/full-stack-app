import React from 'react'
import styles from '@styles/components/Column.module.scss'

const Column = (props: {
    children: any
    style?: any
    className?: any
    id?: string
    centerX?: boolean
    centerY?: boolean
    spaceBetween?: boolean
    scroll?: boolean
}): JSX.Element => {
    const { children, style, className, id, centerX, centerY, spaceBetween, scroll } = props

    const classes = [styles.wrapper]
    if (className) classes.unshift(className)
    if (centerX) classes.push(styles.centerX)
    if (centerY) classes.push(styles.centerY)
    if (spaceBetween) classes.push(styles.spaceBetween)
    if (scroll) classes.push(styles.scroll)

    return (
        <div className={classes.join(' ')} style={style} id={id}>
            {children}
        </div>
    )
}

Column.defaultProps = {
    style: null,
    className: false,
    id: null,
    centerX: false,
    centerY: false,
    spaceBetween: false,
    scroll: false,
}

export default Column
