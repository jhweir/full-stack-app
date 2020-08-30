import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'
import SpaceInput from '../../SpaceInput'
import { AccountContext } from '../../../contexts/AccountContext'


function PostCardRepostModal(props) {
    const {
        postData,
        setRepostModalOpen,
        totalReactions, setTotalReactions,
        totalReposts, setTotalReposts,
        accountRepost, setAccountRepost,
        getReactionData
    } = props

    const { accountData } = useContext(AccountContext)

    const [addedSpaces, setAddedSpaces] = useState([])
    const [newSpaceError, setNewSpaceError] = useState(false)

    const blockedSpaces = [...postData.DirectSpaces, ...postData.IndirectSpaces]

    function repost() {
        if (addedSpaces < 1) { setNewSpaceError(true) }
        else {
            axios
                .post(config.environmentURL + '/repost-post', { 
                    accountId: accountData.id, 
                    postId: postData.id, 
                    spaces: addedSpaces
                })
                .then(res => {
                    if (res.data === 'success') {
                        setRepostModalOpen(false)
                        setTotalReactions(totalReactions + 1)
                        setTotalReposts(totalReposts + 1)
                        setAccountRepost(accountRepost + 1)
                        setTimeout(() => { getReactionData() }, 200)
                    }
                    else { console.log('error: ', res) }
                })
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
                <span className={styles.title}>Repost {postData.creator.name}'s post in:</span>
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
