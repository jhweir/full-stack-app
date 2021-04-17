import React from 'react'
import styles from '../../styles/components/UrlPreview.module.scss'

const UrlPreview = (props: {
    url: string
    urlLoading: boolean
    urlImage: string
    urlDomain: string
    urlTitle: string
    urlDescription: string
    urlFlashMessage: string
}): JSX.Element => {
    const {
        url,
        urlLoading,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription,
        urlFlashMessage,
    } = props

    return (
        <>
            {urlLoading && (
                <div className={styles.container}>
                    <img
                        className={styles.loadingImage}
                        src='/images/cube-loading.gif'
                        aria-label='loading'
                    />
                </div>
            )}

            {urlFlashMessage !== '' && (
                <div className={styles.container}>
                    <div className={styles.flashMessage}>{urlFlashMessage}</div>
                </div>
            )}

            {(urlImage !== null ||
                urlDomain !== null ||
                urlTitle !== null ||
                urlDescription !== null) &&
                !urlLoading && (
                    <div className={styles.container}>
                        <img className={styles.image} src={urlImage} aria-label='url image' />
                        <div className={styles.text}>
                            <div className={styles.title}>{urlTitle}</div>
                            <div className={styles.description}>{urlDescription}</div>
                            <a className={styles.domain} href={url}>
                                <img
                                    className={styles.icon}
                                    src='/icons/link-solid.svg'
                                    aria-label='url domain'
                                />
                                <div className={styles.domainText}>{urlDomain}</div>
                            </a>
                        </div>
                    </div>
                )}
        </>
    )
}

export default UrlPreview
