import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/SideBarButton.module.scss'

const SideBarButton = (props: {
    icon: string
    text: string
    url?: string | null
    selected?: boolean | null
    onClickFunction?: (() => void) | null
    marginBottom: number
    total?: number | null
}): JSX.Element => {
    const { icon, text, url, selected, onClickFunction, marginBottom, total } = props

    const handleClick = () => {
        if (onClickFunction) onClickFunction()
    }

    if (url) {
        return (
            <Link
                to={url}
                className={`${styles.button} ${selected && styles.selected}`}
                style={{ marginBottom }}
                onClick={handleClick}
            >
                <img className={styles.icon} src={`/icons/${icon}`} alt={`${text} button`} />
                <span className={styles.text}>{text}</span>
                {total !== undefined && (
                    <div className={styles.numberWrapper}>
                        <span className={styles.number}>{total === undefined ? 0 : total}</span>
                    </div>
                )}
            </Link>
        )
    }

    return (
        <div
            className={`${styles.button}`} // ${text !== 'Not Following' && styles.selected}`}
            style={{ marginBottom }}
            role='button'
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleClick}
        >
            <img className={styles.icon} src={`/icons/${icon}`} alt={`${text} button`} />
            <span className={styles.text}>{text}</span>
        </div>
    )
}

SideBarButton.defaultProps = {
    url: null,
    selected: null,
    total: null,
    onClickFunction: null,
}

export default SideBarButton
