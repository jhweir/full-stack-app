import React, { useState, useEffect } from 'react'
import styles from '../styles/components/Toggle.module.scss'

const Toggle = (props: {
    leftText: string
    rightText: string
    onClickFunction: () => void
    positionLeft: boolean
}): JSX.Element => {
    const { leftText, rightText, onClickFunction, positionLeft } = props

    const [toggleLeft, setToggleLeft] = useState(true)

    function toggleClick() {
        onClickFunction()
        setToggleLeft(!toggleLeft)
    }
    function textClickLeft() {
        if (!toggleLeft) {
            onClickFunction()
            setToggleLeft(!toggleLeft)
        }
    }
    function textClickRight() {
        if (toggleLeft) {
            onClickFunction()
            setToggleLeft(!toggleLeft)
        }
    }

    useEffect(() => {
        if (!positionLeft) setToggleLeft(false)
    }, [])

    return (
        <div className={styles.toggleWrapper}>
            <span
                className={styles.leftText}
                onClick={textClickLeft}
                onKeyDown={textClickLeft}
                role='button'
                tabIndex={-1}
            >
                {leftText}
            </span>
            <div
                className={`${styles.toggle} ${toggleLeft && styles.toggleLeft}`}
                onClick={toggleClick}
                onKeyDown={toggleClick}
                role='button'
                tabIndex={0}
            >
                <div className={styles.toggleButton} />
            </div>
            <span
                className={styles.rightText}
                onClick={textClickRight}
                onKeyDown={textClickRight}
                role='button'
                tabIndex={-1}
            >
                {rightText}
            </span>
        </div>
    )
}

export default Toggle
