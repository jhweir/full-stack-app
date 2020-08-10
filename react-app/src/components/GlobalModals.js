import React, { useContext } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import AlertModal from './GlobalModals/AlertModal'
import AuthModal from './GlobalModals/AuthModal'
import UserControlsModal from './GlobalModals/UserControlsModal'
import ImageUploadModal from './GlobalModals/ImageUploadModal'
import CreatePostModal from './GlobalModals/CreatePostModal'
import CreateHolonModal from './GlobalModals/CreateHolonModal'
import CreateCommentModal from './GlobalModals/CreateCommentModal'

function GlobalModals() {
    const { createCommentModalOpen } = useContext(AccountContext)

    return (
        <>
            <AlertModal/>
            <AuthModal/>
            <UserControlsModal/>
            <ImageUploadModal/>
            <CreatePostModal/>
            <CreateHolonModal/>
            {createCommentModalOpen && <CreateCommentModal/>}
        </>
    )
}

export default GlobalModals