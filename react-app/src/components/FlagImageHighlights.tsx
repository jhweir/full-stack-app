import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/FlagImageHighlights.module.scss'
import FlagImage from '@components/FlagImage'

const FlagImageHighlights = (props: {
    type: 'user' | 'space' | 'post'
    imagePaths: string[]
    imageSize?: number
    text?: string
    style?: any
    outline?: boolean
    shadow?: boolean
}): JSX.Element => {
    const { type, imagePaths, imageSize, text, style, outline, shadow } = props
    const { spaceData } = useContext(SpaceContext)
    const path = type === 'user' ? 'people' : `${type}s`
    return (
        <Link
            to={`/s/${spaceData.handle || 'all'}/${path}`}
            className={styles.wrapper}
            style={style}
        >
            {imagePaths.length > 0 && (
                <div className={styles.item1}>
                    <FlagImage
                        type={type}
                        imagePath={imagePaths[0]}
                        size={imageSize!}
                        shadow={shadow}
                        outline={outline}
                    />
                </div>
            )}
            {imagePaths.length > 1 && (
                <div className={styles.item2}>
                    <FlagImage
                        type={type}
                        imagePath={imagePaths[1]}
                        size={imageSize!}
                        shadow={shadow}
                        outline={outline}
                    />
                </div>
            )}
            {imagePaths.length > 2 && (
                <div className={styles.item3}>
                    <FlagImage
                        type={type}
                        imagePath={imagePaths[2]}
                        size={imageSize!}
                        shadow={shadow}
                        outline={outline}
                    />
                </div>
            )}
            {!!text && <p>{text}</p>}
        </Link>
    )
}

FlagImageHighlights.defaultProps = {
    imageSize: 35,
    text: null,
    style: null,
    outline: false,
    shadow: false,
}

export default FlagImageHighlights
