import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/CoverImage.module.scss'

function CoverImage(props) {
    const { coverImagePath, imageUploadType, canEdit } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)

    return (
        <div className={styles.coverImageWrapper}>
            {coverImagePath === null
                ? <div className={styles.placeholder}/>
                : <div className={styles.coverImage} style={{ backgroundImage: `url(${coverImagePath})`}}/>//<img className={styles.coverImage} src={coverImagePath}/>
            }
            {canEdit &&
                <div 
                    className={styles.uploadButton}
                    onClick={() => { setImageUploadType(imageUploadType); setImageUploadModalOpen(true) }}>
                    Upload new cover image
                </div>
            }
        </div>
    )
}

export default CoverImage
