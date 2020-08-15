import React from 'react'
import styles from '../../styles/components/CreatePostModalUrlPreview.module.scss'

function CreatePostModalUrlPreview(props) {
    const {
        url,
        urlLoading,
        urlImage,
        urlDomain,
        urlTitle,
        urlDescription
    } = props

    return (
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
    )
}

export default CreatePostModalUrlPreview
