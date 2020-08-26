import React, { useState } from 'react'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'

function PostCardRepostModal(props) {
    const {
        postCreator,
        setRepostModalOpen,
        totalRepost,
        accountRepost
    } = props

    const [newSpace, setNewSpace] = useState('')
    const [newSpaceError, setNewSpaceError] = useState(false)
    const [suggestedSpacesOpen, setSuggestedSpacesOpen] = useState(false)
    const [suggestedHandles, setSuggestedHandles] = useState([])
    const [addedSpaces, setAddedSpaces] = useState([])


    function addSpace(e) {

    }

    function repost() {
        
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeButton}
                    src='/icons/close-01.svg'
                    onClick={() => setRepostModalOpen(false)}
                />
                <span className={styles.title}>Repost {postCreator.name}'s post</span>
                <span className={styles.text}>Add the unique handles of the spaces where you want to repost this post</span>
                <div className={styles.inputWrapper}>
                    <input
                        className={`wecoInput mr-10 ${newSpaceError && styles.error}`}
                        value={newSpace} type='text'
                        onChange={(e) => { setNewSpace(e.target.value); setNewSpaceError(false) }}
                    />
                    <div className='wecoButton' onClick={() => addSpace()}>Add space</div>
                </div>
                <div className='wecoButton' onClick={() => repost()}>Repost</div>
            </div>
        </div>
    )
}

export default PostCardRepostModal