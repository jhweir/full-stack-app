import React from 'react'
import { Link } from 'react-router-dom'
import FlagImage from '../FlagImage'
import ShowMoreLess from '../ShowMoreLess'
import Markdown from '../Markdown'
import styles from '../../styles/components/VerticalCard.module.scss'

const VerticalCard = (props: {
    path: string
    onClick?: () => void
    coverImagePath: string
    flagImagePath: string
    title: string
    subTitle: string
    text: string
    footer?: any
}): JSX.Element => {
    const { path, onClick, coverImagePath, flagImagePath, title, subTitle, text, footer } = props

    const backgroundImage = coverImagePath
        ? `url(${coverImagePath})`
        : 'linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%'

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.coverImage} style={{ backgroundImage }} />
                <Link to={path} onClick={onClick}>
                    <div className={styles.flagImageWrapper}>
                        <FlagImage
                            size={150}
                            type='user'
                            imagePath={flagImagePath}
                            outline
                            shadow
                        />
                    </div>
                </Link>
                <div className={styles.text}>
                    <Link to={path} onClick={onClick}>
                        <p className={styles.title}>{title}</p>
                        <p className={styles.subTitle}>{subTitle}</p>
                    </Link>
                    <ShowMoreLess height={75}>
                        <Markdown text={text} />
                    </ShowMoreLess>
                </div>
            </div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    )
}
VerticalCard.defaultProps = {
    onClick: null,
    footer: null,
}

export default VerticalCard
