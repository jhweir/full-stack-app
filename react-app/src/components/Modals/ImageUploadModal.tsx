import React, { useContext, useState } from 'react'
import ImageUploader from 'react-images-upload'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/ImageUploadModal.module.scss'
import config from '../../Config'
import CloseButton from '../CloseButton'
import CloseOnClickOutside from '../CloseOnClickOutside'

const ImageUploadModal = (): JSX.Element => {
    const { setImageUploadModalOpen, imageUploadType, getAccountData } = useContext(AccountContext)
    const { spaceData, getSpaceData } = useContext(SpaceContext)
    const { getUserData } = useContext(UserContext)
    const [image, setImage] = useState<File[]>([])

    const cookies = new Cookies()

    function saveImage() {
        const holonQuery = `?holonId=${spaceData && spaceData.id}`
        const accessToken = cookies.get('accessToken')
        const formData = new FormData()
        formData.append('image', image[0])
        axios
            .create({
                baseURL: config.apiURL,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .post(`${config.apiURL}/${imageUploadType}-upload${holonQuery}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Access-Control-Allow-Origin': '*'
                },
            })
            .then((res) => {
                if (res.data === 'success') {
                    setImageUploadModalOpen(false)
                    setTimeout(() => {
                        if (imageUploadType.includes('holon')) {
                            getSpaceData()
                            getAccountData()
                        }
                        if (imageUploadType.includes('user')) {
                            getUserData()
                            getAccountData()
                        }
                    }, 200)
                }
            })
    }

    return (
        <div className={styles.imageUploadModalWrapper}>
            <CloseOnClickOutside onClick={() => setImageUploadModalOpen(false)}>
                <div className={styles.imageUploadModal}>
                    <CloseButton onClick={() => setImageUploadModalOpen(false)} />
                    <ImageUploader
                        withIcon
                        withPreview
                        buttonText='Choose images'
                        onChange={(imageFile) => setImage(imageFile)}
                        imgExtension={['.jpg', '.jpeg', '.gif', '.png']}
                        maxFileSize={5242880}
                        singleImage
                    />
                    <div
                        className='wecoButton'
                        role='button'
                        tabIndex={0}
                        onClick={() => saveImage()}
                        onKeyDown={() => saveImage()}
                    >
                        Save image
                    </div>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default ImageUploadModal
