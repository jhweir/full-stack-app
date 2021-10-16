import React from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/TextLink.module.scss'

const TextLink = (props: { text: string; link: string; onClick?: () => void }): JSX.Element => {
    const { text, link, onClick } = props
    return (
        <Link className={styles.container} to={link} onClick={onClick}>
            <p>{text}</p>
        </Link>
    )
}

TextLink.defaultProps = {
    onClick: null,
}

export default TextLink
