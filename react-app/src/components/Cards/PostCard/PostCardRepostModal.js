import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'
import SpaceInput from '../../SpaceInput'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'

function PostCardRepostModal(props) {
    const {
        postData,
        reposts,
        setRepostModalOpen,
        getReactionData,
        totalReactions, setTotalReactions,
        totalReposts, setTotalReposts,
        accountRepost, setAccountRepost,
        blockedSpaces, setBlockedSpaces
    } = props

    const { accountData } = useContext(AccountContext)
    const { setHolonHandle, holonData } = useContext(HolonContext)

    const [addedSpaces, setAddedSpaces] = useState([])
    const [newSpaceError, setNewSpaceError] = useState(false)

    function repost() {
        if (addedSpaces < 1) { setNewSpaceError(true) }
        else {
            axios.post(config.apiURL + '/repost-post', { 
                accountId: accountData.id,
                accountHandle: accountData.handle,
                accountName: accountData.name,
                postId: postData.id,
                holonId: window.location.pathname.includes('/s/') ? holonData.id : null,
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

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setRepostModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setRepostModalOpen(false)}/>
                <span className={styles.title}>Reposts</span>
                {!reposts.length
                    ? <span className={`${styles.text} mb-20`}><i>No reposts yet...</i></span>
                    : <div className={styles.reposts}>
                        {reposts.map((repost, index) =>
                            <div className={styles.repost} key={index}>
                                <Link className={styles.imageTextLink} to={`/u/${repost.creator.handle}`}>
                                    <SmallFlagImage type='user' size={30} imagePath={repost.creator.flagImagePath}/>
                                    <span className={styles.linkText}>{repost.creator.name}</span>
                                </Link>
                                <div className={`${styles.text} greyText mr-10`}>
                                    to
                                </div>
                                <Link className={styles.imageTextLink} to={`/s/${repost.space.handle}`} onClick={() => setHolonHandle(repost.space.handle)}>
                                    <SmallFlagImage type='space' size={30} imagePath={repost.space.flagImagePath}/>
                                    <span className={styles.linkText}>{repost.space.name}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                }
                <span className={`${styles.text} mb-20`}>
                    Repost {postData.creator.name}'s post{reposts !== null && ' somewhere else'}:
                </span>
                <SpaceInput
                    blockedSpaces={blockedSpaces}
                    addedSpaces={addedSpaces} setAddedSpaces={setAddedSpaces}
                    newSpaceError={newSpaceError} setNewSpaceError={setNewSpaceError}
                    setParentModalOpen={setRepostModalOpen}
                    centered={true}
                />
                <div
                    className={`wecoButton ${!addedSpaces.length && 'disabled'}`}
                    onClick={() => { if (addedSpaces.length) { repost() } }}>
                    Repost
                </div>
            </div>
        </div>
    )
}

export default PostCardRepostModal
