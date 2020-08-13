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
                : <img className={styles.coverImage} src={coverImagePath}/>
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
