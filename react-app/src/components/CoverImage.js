import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import { HolonContext } from '../contexts/HolonContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/CoverImage.module.scss'

function CoverImage(props) {
    const { type } = props
    const { setImageUploadType, setImageUploadModalOpen } = useContext(AccountContext)
    const { holonData, isModerator } = useContext(HolonContext)
    const { userData, isOwnAccount } = useContext(UserContext)

    let data = []
    let canEdit = false
    if (holonData && type === 'holon') { data = holonData; canEdit = isModerator }
    if (userData && type === 'user') { data = userData; canEdit = isOwnAccount }

    return (
        <div className={styles.coverImageWrapper}>
            {data.id && data.coverImagePath === null
                ? <div className={styles.placeholder}/>
                : <img className={styles.coverImage} src={data.coverImagePath}/>
            }
            {/* {canEdit && */}
                <div 
                    className={styles.uploadButton}
                    onClick={() => { setImageUploadType(`${type}-cover-image`); setImageUploadModalOpen(true) }}>
                    Upload new cover image
                </div>
            {/* } */}
        </div>
    )
}

export default CoverImage
