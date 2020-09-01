import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'
import SpaceInput from '../../SpaceInput'
import CloseButton from '../../CloseButton'
import ImageTitleLink from '../../ImageTitleLink'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'



function PostCardRepostModal(props) {
    const {
        postData,
        reposts,
        setRepostModalOpen,
        totalReactions, setTotalReactions,
        totalReposts, setTotalReposts,
        accountRepost, setAccountRepost,
        getReactionData,
        blockedSpaces, setBlockedSpaces
    } = props

    const { accountData } = useContext(AccountContext)
    const { setHolonHandle } = useContext(HolonContext)

    const [addedSpaces, setAddedSpaces] = useState([])
    const [newSpaceError, setNewSpaceError] = useState(false)

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
                        setBlockedSpaces([...blockedSpaces, ...addedSpaces])
                        setRepostModalOpen(false)
                        setTotalReactions(totalReactions + addedSpaces.length)
                        setTotalReposts(totalReposts + addedSpaces.length)
                        setAccountRepost(accountRepost + addedSpaces.length)
                        setTimeout(() => { getReactionData() }, 200)
                    }
                    else { console.log('error: ', res) }
                })
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <CloseButton onClick={() => setRepostModalOpen(false)}/>
                <span className={styles.title}>Reposts</span>
                {reposts.length < 1
                    ? <span className={`${styles.text} mb-20`}><i>No reposts yet...</i></span>
                    : <div className={styles.reposts}>
                        {reposts.map((repost, index) =>
                            <div className={styles.repost} key={index}>
                                <ImageTitleLink
                                    imagePath={repost.creator.flagImagePath}
                                    title={repost.creator.name}
                                    link={`/u/${repost.creator.handle}`}
                                />
                                <div className={`${styles.text} mr-10`}>to</div>
                                <ImageTitleLink
                                    imagePath={repost.space.flagImagePath}
                                    title={repost.space.name}
                                    link={`/s/${repost.space.handle}`}
                                    onClick={() => setHolonHandle(repost.space.handle)}
                                />
                            </div>
                        )}
                    </div>
                }
                {/* {reposts.length < 1 && 
                    <span className={`${styles.text} mb-20`}><i>No reposts yet...</i></span>
                } */}
                <span className={`${styles.text} mb-20`}>
                    Repost {postData.creator.name}'s post{reposts.length > 0 && ' somewhere else'}:
                </span>
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