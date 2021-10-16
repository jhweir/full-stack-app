import React from 'react'
import styles from '@styles/components/LoadingWheel.module.scss'
import { ReactComponent as LoadingWheelIconSVG } from '@svgs/spinner.svg'

const LoadingWheel = (props: { size?: string }): JSX.Element => {
    const { size } = props
    return (
        <div className={styles.wrapper} style={{ width: size, height: size }}>
            <LoadingWheelIconSVG width={size} height={size} />
        </div>
    )
}

LoadingWheel.defaultProps = {
    size: 40,
}

export default LoadingWheel
