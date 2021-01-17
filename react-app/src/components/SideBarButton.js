import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/SideBarButton.module.scss'

function SideBarButton(props) {
    const { icon, text, url, selected, onClickFunction, marginBottom, total } = props

    if (url) {
        return (
            <Link to={url} className={`${styles.button} ${selected && styles.selected}`}
                style={{marginBottom: marginBottom}}
                onClick={() => { if (onClickFunction) { onClickFunction() } }}
            >
                <img className={styles.icon} src={`/icons/${icon}`}/>
                <span className={styles.text}>{ text }</span>
                {total !== undefined &&
                    <div className={styles.numberWrapper}>
                        <span className={styles.number}>{ total === undefined ? 0 : total}</span>
                    </div>
                }
            </Link>
        )
    }
    else {
        return (
            <div className={`${styles.button}`}// ${text !== 'Not Following' && styles.selected}`}
                style={{marginBottom: marginBottom}}
                onClick={() => { if (onClickFunction) { onClickFunction() } }}
            >
                <img className={styles.icon} src={`/icons/${icon}`}/>
                <span className={styles.text}>{ text }</span>
            </div>
        )
    }
}

export default SideBarButton
