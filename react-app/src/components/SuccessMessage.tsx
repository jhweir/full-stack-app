import React from 'react'
import styles from '@styles/components/SuccessMessage.module.scss'
import { ReactComponent as SuccessIconSVG } from '@svgs/check-circle-solid.svg'

const SuccessMessage = (props: { text: string }): JSX.Element => {
    const { text } = props
    return (
        <div className={styles.wrapper}>
            <p>{text}</p>
            <SuccessIconSVG />
        </div>
    )
}

export default SuccessMessage
