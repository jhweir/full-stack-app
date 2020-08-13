import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/SideBarButton.module.scss'

function SideBarButton(props) {
    const { icon, text, url, selected, onClickFunction, marginBottom } = props

    if (url) {
        return (
            <Link to={url}
                className={`${styles.navButton} ${selected && styles.selected}`}
                style={{marginBottom: marginBottom}}
                onClick={() => { if (onClickFunction) { onClickFunction() } }}>
                <img className={styles.navButtonIcon} src={`/icons/${icon}`}/>
                <span className={styles.navButtonText}>{ text }</span>
            </Link>
        )
    }
    else {
        return (
            <div className={`${styles.navButton} ${text !== 'Not Following' && styles.selected}`}
                style={{marginBottom: marginBottom}}
                onClick={() => { if (onClickFunction) { onClickFunction() } }}>
                <img className={styles.navButtonIcon} src={`/icons/${icon}`}/>
                <span className={styles.navButtonText}>{ text }</span>
            </div>
        )
    }
}

export default SideBarButton
