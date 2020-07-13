import React, { useContext, useState } from 'react'
import ImageUploader from 'react-images-upload'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/ImageUploadModal.module.scss'
import axios from 'axios'
import config from '../../Config'
import Cookies from 'universal-cookie';

function ImageUploadModal() {
    const { imageUploadModalOpen, setImageUploadModalOpen, imageUploadType } = useContext(AccountContext)
    const { holonData, getHolonData } = useContext(HolonContext)
    const { getUserData, userData } = useContext(UserContext)
    const [image, setImage] = useState([])

    // does this require a function?
    function imageSelected(image) {
        setImage(image)
    }

    let cookies = new Cookies()

    function saveImage() {
        let holonQuery = `?holonId=${holonData && holonData.id}`
        let accessToken = cookies.get('accessToken')
        let formData = new FormData()
        formData.append('image', image[0])
        axios
            .create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .post(
                config.environmentURL + 
                `/${imageUploadType}-upload${holonQuery}`, 
                formData,{ headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => { 
                if (res.data === 'success') { 
                    setImageUploadModalOpen(false)
                    setTimeout(() => {
                        if (imageUploadType.includes('holon')) { getHolonData() }
                        if (imageUploadType.includes('user')) { getUserData(userData.name) }
                    }, 200)
                }
            })
    }

    if (imageUploadModalOpen) {
        return (
            <div className={styles.imageUploadModalWrapper}>
                <div className={styles.imageUploadModal}>
                    <img 
                        className={styles.imageUploadModalCloseButton}
                        src="/icons/close-01.svg"
                        onClick={() => setImageUploadModalOpen(false)}
                    />
                    <ImageUploader
                        withIcon={true}
                        withPreview={true}
                        buttonText='Choose images'
                        onChange={imageSelected}
                        imgExtension={['.jpg', '.jpeg', '.gif', '.png']}
                        maxFileSize={5242880}
                        singleImage={true}
                    />
                    <div className="wecoButton" onClick={() => saveImage()}>
                        Save image
                    </div>
                </div>
            </div>
        )
    } else { return null }
}

export default ImageUploadModal