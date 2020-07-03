import React, { useContext, useState } from 'react'
//import AvatarEditor from 'react-avatar-editor'
import ImageUploader from 'react-images-upload';
import { Link } from 'react-router-dom'
import { AccountContext } from '../contexts/AccountContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/ImageUploadModal.module.scss'
import axios from 'axios'
import config from '../Config'
import Cookies from 'universal-cookie';

function ImageUploadModal(props) {
    const { setImageUploadModalOpen } = props
    const { updateAccountContext, accountData } = useContext(AccountContext)
    const { updateUserContext, userData } = useContext(UserContext)
    const [image, setImage] = useState([])

    function imageSelected(image) {
        setImage(image)
    }

    let cookies = new Cookies()

    function sendImage() {
        let accessToken = cookies.get('accessToken')
        let formData = new FormData()
        formData.append('image', image[0])
        axios
            .create({
                baseURL: config.environmentURL,
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .post(config.environmentURL + `/image-upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(res => { 
                //console.log('res.data: ', res.data)
                if (res.data === 'success') { 
                    setImageUploadModalOpen(false)
                    setTimeout(() => { 
                        updateAccountContext(accountData.name)
                        updateUserContext(userData.name) 
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
                <div className="wecoButton" onClick={() => sendImage()}>Save image</div>
                {/* <AvatarEditor
                    image="https://scx2.b-cdn.net/gfx/news/hires/2016/63-scientistsdi.jpg"
                    width={250}
                    height={250}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                /> */}
            </div>
        </div>
    )
}

export default ImageUploadModal