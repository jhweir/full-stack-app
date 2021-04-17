import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import AlertModal from './Modals/AlertModal'
import AuthModal from './Modals/AuthModal'
import NavBarDropDownModal from './Modals/NavBarDropDownModal'
import ImageUploadModal from './Modals/ImageUploadModal'
import CreatePostModal from './Modals/CreatePostModal'
import CreateHolonModal from './Modals/CreateHolonModal'
import CreateCommentModal from './Modals/CreateCommentModal'
import SettingModal from './Modals/SettingModal'
import ResetPasswordModal from './Modals/ResetPasswordModal'

const Modals = (): JSX.Element => {
    const {
        alertModalOpen,
        authModalOpen,
        navBarDropDownModalOpen,
        imageUploadModalOpen,
        createPostModalOpen,
        createHolonModalOpen,
        createCommentModalOpen,
        settingModalOpen,
        resetPasswordModalOpen,
    } = useContext(AccountContext)

    return (
        <>
            {alertModalOpen && <AlertModal />}
            {authModalOpen && <AuthModal />}
            {navBarDropDownModalOpen && <NavBarDropDownModal />}
            {imageUploadModalOpen && <ImageUploadModal />}
            {createPostModalOpen && <CreatePostModal />}
            {createHolonModalOpen && <CreateHolonModal />}
            {createCommentModalOpen && <CreateCommentModal />}
            {settingModalOpen && <SettingModal />}
            {resetPasswordModalOpen && <ResetPasswordModal />}
        </>
    )
}

export default Modals
