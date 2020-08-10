import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/SideBarButton.module.scss'

function SideBarButton(props) {
    const { text, path, icon, type, marginBottom, onClickFunction } = props
    const { holonData, selectedHolonSubPage } = useContext(HolonContext)
    const { userData, selectedUserSubPage } = useContext(UserContext)

    let url, selectedSubPage

    if (type === 'holon-page-left') {
        url = `/s/${holonData.handle}/${path}`
        selectedSubPage = selectedHolonSubPage
    }

    if (type === 'user-page-left') { 
        url = `/u/${userData.handle}/${path}`
        selectedSubPage = selectedUserSubPage
    }

    if (path) {
        return (
            <Link to={url}
                className={`${styles.navButton} ${selectedSubPage === path && styles.selected}`}
                style={{marginBottom: marginBottom}}
                onClick={() => { if (onClickFunction){ onClickFunction() } }}>
                <img className={styles.navButtonIcon} src={`/icons/${icon}`}/>
                <span className={styles.navButtonText}>{ text }</span>
            </Link>
        )
    } else {
        return (
            <div className={`${styles.navButton} ${text !== 'Not Following' && styles.selected}`}
                style={{marginBottom: marginBottom}}
                onClick={() => { if (onClickFunction){ onClickFunction() } }}>
                <img className={styles.navButtonIcon} src={`/icons/${icon}`}/>
                <span className={styles.navButtonText}>{ text }</span>
            </div>
        )
    }
}

export default SideBarButton
