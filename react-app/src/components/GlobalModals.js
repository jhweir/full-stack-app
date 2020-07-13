import React from 'react'
import AlertModal from './GlobalModals/AlertModal'
import AuthModal from './GlobalModals/AuthModal'
import UserControlsModal from './GlobalModals/UserControlsModal'
import ImageUploadModal from './GlobalModals/ImageUploadModal'
import CreatePostModal from './GlobalModals/CreatePostModal'
import CreateHolonModal from './GlobalModals/CreateHolonModal'

function GlobalModals() {
    return (
        <>
            <AlertModal/>
            <AuthModal/>
            <UserControlsModal/>
            <ImageUploadModal/>
            <CreatePostModal/>
            <CreateHolonModal/>
        </>
    )
}

export default GlobalModals