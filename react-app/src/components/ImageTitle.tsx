import React from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/ImageTitle.module.scss'
import FlagImage from '@components/FlagImage'

const ImageTitle = (props: {
    type: 'space' | 'user'
    imagePath: string
    title: string
    link?: string
    onClick?: () => void
}): JSX.Element => {
    const { type, imagePath, title, link, onClick } = props
    if (link) {
        return (
            <Link
                className={`${styles.container} ${styles.cursorPointer}`}
                to={link}
                onClick={onClick}
            >
                <FlagImage type={type} size={30} imagePath={imagePath} />
                <p>{title}</p>
            </Link>
        )
    }
    if (onClick) {
        return (
            <button
                type='button'
                className={`${styles.container} ${styles.cursorPointer}`}
                onClick={onClick}
            >
                <FlagImage type={type} size={30} imagePath={imagePath} />
                <p>{title}</p>
            </button>
        )
    }
    return (
        <div className={styles.container}>
            <FlagImage type={type} size={30} imagePath={imagePath} />
            <p>{title}</p>
        </div>
    )
}

ImageTitle.defaultProps = {
    onClick: null,
    link: null,
}

export default ImageTitle
