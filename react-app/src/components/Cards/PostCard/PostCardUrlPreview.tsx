import React from 'react'
import styles from '../../../styles/components/PostCardUrlPreview.module.scss'

const PostCardUrlPreview = (props: {
    url?: string
    urlImage?: string
    urlDomain?: string
    urlTitle?: string
    urlDescription?: string
}): JSX.Element => {
    const { url, urlImage, urlDomain, urlTitle, urlDescription } = props

    const availableContent =
        urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null

    function handleImageError(e) {
        e.target.onerror = null
        if (!e.target.src.includes('//images.weserv.nl/')) {
            e.target.src = `//images.weserv.nl/?url=${urlImage}`
        } else {
            e.target.src = '/images/placeholders/broken-image.jpg'
        }
    }

    return (
        <>
            {availableContent && (
                <div className={styles.container}>
                    <a href={url}>
                        <img
                            className={styles.image}
                            src={urlImage && urlImage}
                            onError={(e) => handleImageError(e)}
                            aria-label='url image'
                        />
                    </a>
                    <div className={styles.text}>
                        <div className={styles.title}>{urlTitle}</div>
                        <div className={styles.description}>{urlDescription}</div>
                        <a className={styles.domain} href={url}>
                            <img
                                className={styles.icon}
                                src='/icons/link-solid.svg'
                                aria-label='link'
                            />
                            <div className={styles.domainText}>{urlDomain}</div>
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

PostCardUrlPreview.defaultProps = {
    url: null,
    urlImage: null,
    urlDomain: null,
    urlTitle: null,
    urlDescription: null,
}

export default PostCardUrlPreview
