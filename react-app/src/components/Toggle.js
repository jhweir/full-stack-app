import React, { useState } from 'react'
import styles from '../styles/components/Toggle.module.scss'

function Toggle(props) {
    const { leftText, rightText, onClickFunction } = props

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

    return (
        <div className={styles.toggleWrapper}>
            <span className={styles.leftText} onClick={textClickLeft}>{ leftText }</span>
            <div className={`${styles.toggle} ${toggleLeft && styles.toggleLeft}`} onClick={toggleClick}>
                <div className={styles.toggleButton}/>
            </div>
            <span className={styles.rightText} onClick={textClickRight}>{ rightText }</span>
        </div>
    )

}

export default Toggle