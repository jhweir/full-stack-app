import React, { useContext, useState } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'
import SpaceInput from '../../SpaceInput'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'
import { Link } from 'react-router-dom'


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

    // TODO: create close button component
    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <img 
                    className={styles.closeButton}
                    src='/icons/close-01.svg'
                    onClick={() => setRepostModalOpen(false)}
                />
                <span className={styles.title}>Reposts</span>
                {reposts.length > 0 &&
                    <div className={styles.reposts}>
                        {reposts.map((repost, index) =>
                            <div className={styles.item} key={index}>
                                <Link to={ `/u/${repost.creator.handle}`} className={styles.creator}>
                                    {repost.creator.flagImagePath
                                        ? <img className={styles.image} src={repost.creator.flagImagePath}/>
                                        : <div className={styles.placeholderWrapper}>
                                            <img className={styles.placeholder} src='/icons/user-solid.svg' alt=''/>
                                        </div>
                                    }
                                    <div className={`${styles.text} mr-10`}>{repost.creator.name}</div>
                                </Link>
                                <div className={`${styles.text} mr-10`}>to</div>
                                <Link to={ `/s/${repost.space.handle}`} className={styles.space} onClick={() => setHolonHandle(repost.space.handle)}>
                                    {repost.space.flagImagePath
                                        ? <img className={styles.image} src={repost.space.flagImagePath}/>
                                        : <div className={styles.placeholderWrapper}>
                                            <img className={styles.placeholder} src='/icons/users-solid.svg' alt=''/>
                                        </div>
                                    }
                                    <div className={styles.text}>{repost.space.name}</div>
                                </Link>
                            </div>
                        )}
                    </div>
                }
                {reposts.length < 1 && <span className={`${styles.text} mb-20`}><i>No reposts yet...</i></span>}
                <span className={`${styles.text} mb-20`}>Repost {postData.creator.name}'s post{reposts.length > 0 && ' somewhere else'}:</span>
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
