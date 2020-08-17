import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import AlertModal from './GlobalModals/AlertModal'
import AuthModal from './GlobalModals/AuthModal'
import UserControlsModal from './GlobalModals/UserControlsModal'
import ImageUploadModal from './GlobalModals/ImageUploadModal'
import CreatePostModal from './GlobalModals/CreatePostModal'
import CreateHolonModal from './GlobalModals/CreateHolonModal'
import CreateCommentModal from './GlobalModals/CreateCommentModal'
import SettingModal from './GlobalModals/SettingModal'

function GlobalModals() {
    const {
        alertModalOpen,
        authModalOpen,
        userControlsModalOpen,
        imageUploadModalOpen,
        createPostModalOpen,
        createHolonModalOpen,
        createCommentModalOpen,
        settingModalOpen
    } = useContext(AccountContext)

    return (
        <>
            {alertModalOpen && <AlertModal/>}
            {authModalOpen && <AuthModal/>}
            {userControlsModalOpen && <UserControlsModal/>}
            {imageUploadModalOpen && <ImageUploadModal/>}
            {createPostModalOpen && <CreatePostModal/>}
            {createHolonModalOpen && <CreateHolonModal/>}
            {createCommentModalOpen && <CreateCommentModal/>}
            {settingModalOpen && <SettingModal/>}
        </>
    )
}

export default GlobalModals