import React from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/ImageNameLink.module.scss'
import FlagImage from '@components/FlagImage'

const ImageNameLink = (props: {
    type: 'space' | 'user'
    data: {
        name: string
        handle: string
        flagImagePath: string
    }
    onClick?: () => void
}): JSX.Element => {
    const { type, data, onClick } = props
    const route = `/${type[0]}/${data.handle}`
    return (
        <Link className={styles.container} to={route} onClick={onClick}>
            <FlagImage type={type} size={30} imagePath={data.flagImagePath} />
            <p>{data.name}</p>
        </Link>
    )
}

ImageNameLink.defaultProps = {
    onClick: null,
}

export default ImageNameLink
