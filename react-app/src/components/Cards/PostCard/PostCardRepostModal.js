import React, { useState } from 'react'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'
import SpaceInput from '../../SpaceInput'

function PostCardRepostModal(props) {
    const {
        postCreator,
        setRepostModalOpen,
        DirectSpaces,
        IndirectSpaces,
        totalRepost,
        accountRepost
    } = props

    const [addedSpaces, setAddedSpaces] = useState([])
    const [newSpaceError, setNewSpaceError] = useState(false)

    const blockedSpaces = [...DirectSpaces, ...IndirectSpaces]

    function repost() {
        if (addedSpaces < 1) { setNewSpaceError(true) }
        else {
            //
        }
    }

    // TODO: create close button component
    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeButton}
                    src='/icons/close-01.svg'
                    onClick={() => setRepostModalOpen(false)}
                />
                <span className={styles.title}>Repost {postCreator.name}'s post in:</span>
                <SpaceInput
                    blockedSpaces={blockedSpaces}
                    addedSpaces={addedSpaces} setAddedSpaces={setAddedSpaces}
                    newSpaceError={newSpaceError} setNewSpaceError={setNewSpaceError}
                    setParentModalOpen={setRepostModalOpen}
                />
                <div className='wecoButton' onClick={repost}>Repost</div>
            </div>
        </div>
    )
}

export default PostCardRepostModal
