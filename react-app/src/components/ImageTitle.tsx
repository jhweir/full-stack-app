import React from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/ImageTitle.module.scss'
import FlagImage from '@components/FlagImage'

const ImageTitle = (props: {
    type: 'space' | 'user'
    imagePath: string
    title: string
    link?: string
    imageSize?: number
    fontSize?: number
    margin?: string
    onClick?: () => void
}): JSX.Element => {
    const { type, imagePath, title, link, imageSize, fontSize, margin, onClick } = props
    if (link) {
        return (
            <Link
                to={link}
                onClick={onClick}
                className={`${styles.container} ${styles.cursorPointer}`}
                style={{ margin }}
            >
                <FlagImage type={type} size={imageSize!} imagePath={imagePath} />
                <p style={{ fontSize }}>{title}</p>
            </Link>
        )
    }
    if (onClick) {
        return (
            <button
                type='button'
                onClick={onClick}
                className={`${styles.container} ${styles.cursorPointer}`}
                style={{ margin }}
            >
                <FlagImage type={type} size={imageSize!} imagePath={imagePath} />
                <p style={{ fontSize }}>{title}</p>
            </button>
        )
    }
    return (
        <div className={styles.container} style={{ margin }}>
            <FlagImage type={type} size={imageSize!} imagePath={imagePath} />
            <p style={{ fontSize }}>{title}</p>
        </div>
    )
}

ImageTitle.defaultProps = {
    onClick: null,
    link: null,
    imageSize: 30,
    fontSize: 14,
    margin: null,
}

export default ImageTitle
