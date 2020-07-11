import React, { useContext, useState } from 'react'
import ImageUploader from 'react-images-upload';
import { AccountContext } from '../contexts/AccountContext'
import { HolonContext } from '../contexts/HolonContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/HolonFlagImageUploadModal.module.scss'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie';

function HolonFlagImageUploadModal(props) {
    const { setHolonFlagImageUploadModalOpen } = props
    const { getAccountData, accountData } = useContext(AccountContext)
    const { holonData, getHolonData } = useContext(HolonContext)
    const { getUserData, userData } = useContext(UserContext)
    const [image, setImage] = useState([])

    function imageSelected(image) {
        setImage(image)
    }

    let cookies = new Cookies()

    function sendImage() {
        let accessToken = cookies.get('accessToken')
        let formData = new FormData()
        formData.append('image', image[0])
        //formData.append('holonId', holonData.id)
        axios
            .create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .post(config.environmentURL + `/holon-flag-image-upload?holonId=${holonData.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => { 
                //console.log('res.data: ', res.data)
                if (res.data === 'success') { 
                    setHolonFlagImageUploadModalOpen(false)
                    setTimeout(() => { 
                        getHolonData()
                    }, 200)
                }
            })
    }

    return (
        <div className={styles.imageUploadModalWrapper}>
            <div className={styles.imageUploadModal}>
                <img 
                    className={styles.imageUploadModalCloseButton}
                    src="/icons/close-01.svg"
                    onClick={() => setHolonFlagImageUploadModalOpen(false)}
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
                <div className="wecoButton" onClick={() => sendImage()}>Save image</div>
            </div>
        </div>
    )
}

export default HolonFlagImageUploadModal