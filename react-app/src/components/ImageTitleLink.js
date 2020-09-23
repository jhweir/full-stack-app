import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/ImageTitleLink.module.scss'

function ImageTitleLink(props) {
    const { type, imagePath, title, link, onClick } = props

    let placeholderImagePath
    if (type === 'user') { placeholderImagePath = 'user-solid.svg' }
    if (type === 'space') { placeholderImagePath = 'users-solid.svg' }

    return (
        <Link className={styles.container} to={link} onClick={onClick}>
            {imagePath
                ? <img className={styles.image} src={imagePath}/>
                : <div className={styles.placeholderWrapper}>
                    <img className={styles.placeholder} src={`/icons/${placeholderImagePath}`} alt=''/>
                </div>
            }
            <div className={styles.title}>{title}</div>
        </Link>
    )
}

export default ImageTitleLink