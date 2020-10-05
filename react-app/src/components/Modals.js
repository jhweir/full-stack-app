import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import AlertModal from './Modals/AlertModal'
import AuthModal from './Modals/AuthModal'
import UserControlsModal from './Modals/UserControlsModal'
import ImageUploadModal from './Modals/ImageUploadModal'
import CreatePostModal from './Modals/CreatePostModal'
import CreateHolonModal from './Modals/CreateHolonModal'
import CreateCommentModal from './Modals/CreateCommentModal'
import SettingModal from './Modals/SettingModal'

function Modals() {
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

export default Modals