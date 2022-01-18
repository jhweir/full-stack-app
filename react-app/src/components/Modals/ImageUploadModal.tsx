import React, { useContext, useState } from 'react'
import ImageUploader from 'react-images-upload'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/ImageUploadModal.module.scss'
import config from '@src/Config'
import Button from '@components/Button'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import CloseButton from '../CloseButton'
import CloseOnClickOutside from '../CloseOnClickOutside'

const ImageUploadModal = (): JSX.Element => {
    const { accountData, setImageUploadModalOpen, imageUploadType, getAccountData } = useContext(AccountContext)
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
                    // todo: update context directly
                    // setTimeout(() => {
                    //     if (imageUploadType.includes('holon')) {
                    //         getSpaceData()
                    //         getAccountData()
                    //     }
                    //     if (imageUploadType.includes('user')) {
                    //         getUserData(accountData.id)
                    //         getAccountData()
                    //     }
                    // }, 200)
                }
            })
    }

    return (
        <Modal close={() => setImageUploadModalOpen(false)} centered>
            <ImageUploader
                withIcon
                withPreview
                buttonText='Choose images'
                onChange={(imageFile) => setImage(imageFile)}
                imgExtension={['.jpg', '.jpeg', '.gif', '.png']}
                maxFileSize={1 * 1024 * 1024}
                singleImage
            />
            <Button
                text='Save image'
                color='blue'
                disabled={!image[0]}
                style={{ marginRight: 10 }}
                onClick={saveImage}
            />
        </Modal>
    )
}

export default ImageUploadModal
