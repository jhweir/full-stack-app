import React from 'react'
import styles from '@styles/components/Row.module.scss'

const Row = (props: {
    children: any
    style?: any
    className?: any
    id?: string
    centerX?: boolean
    centerY?: boolean
    spaceBetween?: boolean
    wrap?: boolean
    scroll?: boolean
}): JSX.Element => {
    const { children, style, className, id, centerX, centerY, spaceBetween, wrap, scroll } = props

    const classes = [styles.wrapper]
    if (className) classes.unshift(className)
    if (centerX) classes.push(styles.centerX)
    if (centerY) classes.push(styles.centerY)
    if (spaceBetween) classes.push(styles.spaceBetween)
    if (wrap) classes.push(styles.wrap)
    if (scroll) classes.push(styles.scroll)

    return (
        <div className={classes.join(' ')} style={style} id={id}>
            {children}
        </div>
    )
}

Row.defaultProps = {
    style: null,
    className: false,
    id: null,
    centerX: false,
    centerY: false,
    spaceBetween: false,
    wrap: false,
    scroll: false,
}

export default Row
