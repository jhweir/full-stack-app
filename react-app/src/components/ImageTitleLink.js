import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/ImageTitleLink.module.scss'

function ImageTitleLink(props) {
    const { imagePath, title, link, onClick } = props

    return (
        <Link className={styles.container} to={link} onClick={onClick}>
            {imagePath
                ? <img className={styles.image} src={imagePath}/>
                : <div className={styles.placeholderWrapper}>
                    <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                </div>
            }
            <div className={`${styles.title} mr-10`}>{title}</div>
        </Link>
    )
}

export default ImageTitleLink