import React from 'react'
import styles from '../../styles/components/UrlPreview.module.scss'

function UrlPreview(props) {
    const {
        url,
        urlLoading,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription,
        urlFlashMessage
    } = props

    return (
        <>
            {urlLoading &&
                <div className={styles.container}>
                    <img className={styles.loadingImage} src="/images/cube-loading.gif"/>
                </div>
            }

            {urlFlashMessage !== '' &&
                <div className={styles.container}>
                    <div className={styles.flashMessage}>{urlFlashMessage}</div>
                </div>
            }

            {(urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null) && !urlLoading &&
                <div className={styles.container}>
                    <img className={styles.image} src={urlImage}/>
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

export default UrlPreview
