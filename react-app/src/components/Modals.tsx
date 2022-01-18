import React, { useContext } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import AlertModal from '@components/Modals/AlertModal'
import NavbarDropDownModal from '@components/Modals/NavbarDropDownModal'
import ImageUploadModal from '@components/Modals/ImageUploadModal'
import CreatePostModal from '@components/Modals/CreatePostModal'
// import CreateSpaceModal from './Modals/CreateSpaceModal'
// import CreateCommentModal from './Modals/CreateCommentModal'
// import SettingModal from '@components/Modals/SettingModal'
import ResetPasswordModal from '@components/Modals/ResetPasswordModal'
import LogInModal from '@components/Modals/LogInModal'
import RegisterModal from '@components/Modals/RegisterModal'
import ForgotPasswordModal from '@components/Modals/ForgotPasswordModal'

const Modals = (): JSX.Element => {
    const {
        alertModalOpen,
        logInModalOpen,
        setLogInModalOpen,
        registerModalOpen,
        setRegisterModalOpen,
        forgotPasswordModalOpen,
        setForgotPasswordModalOpen,
        navBarDropDownModalOpen,
        imageUploadModalOpen,
        createPostModalOpen,
        // createSpaceModalOpen,
        // createCommentModalOpen,
        // settingModalOpen,
        resetPasswordModalOpen,
    } = useContext(AccountContext)

    return (
        <>
            {alertModalOpen && <AlertModal />}
            {logInModalOpen && <LogInModal close={() => setLogInModalOpen(false)} />}
            {registerModalOpen && <RegisterModal close={() => setRegisterModalOpen(false)} />}
            {forgotPasswordModalOpen && (
                <ForgotPasswordModal close={() => setForgotPasswordModalOpen(false)} />
            )}
            {navBarDropDownModalOpen && <NavbarDropDownModal />}
            {imageUploadModalOpen && <ImageUploadModal />}
            {createPostModalOpen && <CreatePostModal />}
            {/* {createSpaceModalOpen && <CreateSpaceModal />} */}
            {/* {createCommentModalOpen && <CreateCommentModal />} */}
            {/* {settingModalOpen && <SettingModal />} */}
            {resetPasswordModalOpen && <ResetPasswordModal />}
        </>
    )
}

export default Modals
