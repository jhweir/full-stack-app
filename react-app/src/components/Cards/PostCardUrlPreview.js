import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/components/PostCardUrlPreview.module.scss'

function PostCardUrlPreview(props) {
    const {
        url,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription
    } = props

    return (
        <>
            {(urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null) &&
                <div className={styles.container}>
                    <a href={url}>
                        <img className={styles.image} src={urlImage}/>
                    </a>
                    <div className={styles.text}>
                        <div className={styles.title}>{urlTitle}</div>
                        <div className={styles.description}>{urlDescription}</div>
                        <a className={styles.domain} href={url}>
                            <img className={styles.icon} src="/icons/link-solid.svg"/>
                            <div className={styles.domainText}>{urlDomain}</div>
                        </a>
                    </div>
                </div>
            }
        </>
    )
}

export default PostCardUrlPreview
