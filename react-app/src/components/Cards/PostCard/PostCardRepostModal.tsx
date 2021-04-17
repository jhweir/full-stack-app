import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardRepostModal.module.scss'
import SpaceInput from '../../SpaceInput'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'
import { SpaceContext } from '../../../contexts/SpaceContext'
import { IPost } from '../../../Interfaces'
import CloseOnClickOutside from '../../CloseOnClickOutside'

const PostCardRepostModal = (props: {
    postData: Partial<IPost>
    reposts: any[]
    setRepostModalOpen: (payload: boolean) => void
    getReactionData: () => void
    totalReactions: number
    setTotalReactions: (payload: number) => void
    totalReposts: number
    setTotalReposts: (payload: number) => void
    accountRepost: number
    setAccountRepost: (payload: number) => void
    blockedSpaces: string[]
    setBlockedSpaces: (payload: string[]) => void
}): JSX.Element => {
    const {
        postData,
        reposts,
        setRepostModalOpen,
        getReactionData,
        totalReactions,
        setTotalReactions,
        totalReposts,
        setTotalReposts,
        accountRepost,
        setAccountRepost,
        blockedSpaces,
        setBlockedSpaces,
    } = props

    const { accountData } = useContext(AccountContext)
    const { setSpaceHandle, spaceData } = useContext(SpaceContext)

    const [addedSpaces, setAddedSpaces] = useState([])
    const [newSpaceError, setNewSpaceError] = useState(false)

    function submitRepost() {
        if (addedSpaces.length < 1) {
            setNewSpaceError(true)
        } else {
            axios
                .post(`${config.apiURL}/repost-post`, {
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    postId: postData.id,
                    holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    spaces: addedSpaces,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setBlockedSpaces([...blockedSpaces, ...addedSpaces])
                        setRepostModalOpen(false)
                        setTotalReactions(totalReactions + addedSpaces.length)
                        setTotalReposts(totalReposts + addedSpaces.length)
                        setAccountRepost(accountRepost + addedSpaces.length)
                        setTimeout(() => {
                            getReactionData()
                        }, 200)
                    } else {
                        console.log('error: ', res)
                    }
                })
        }
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={() => setRepostModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setRepostModalOpen(false)} />
                    <span className={styles.title}>Reposts</span>
                    {reposts.length === 0 ? (
                        <span className={`${styles.text} mb-20`}>
                            <i>No reposts yet...</i>
                        </span>
                    ) : (
                        <div className={styles.reposts}>
                            {reposts.map((repost) => (
                                <div className={styles.repost} key={repost}>
                                    <Link
                                        className={styles.imageTextLink}
                                        to={`/u/${repost.creator.handle}`}
                                    >
                                        <SmallFlagImage
                                            type='user'
                                            size={30}
                                            imagePath={repost.creator.flagImagePath}
                                        />
                                        <span className={styles.linkText}>
                                            {repost.creator.name}
                                        </span>
                                    </Link>
                                    <div className={`${styles.text} greyText mr-10`}>to</div>
                                    <Link
                                        className={styles.imageTextLink}
                                        to={`/s/${repost.space.handle}`}
                                        onClick={() => setSpaceHandle(repost.space.handle)}
                                    >
                                        <SmallFlagImage
                                            type='space'
                                            size={30}
                                            imagePath={repost.space.flagImagePath}
                                        />
                                        <span className={styles.linkText}>{repost.space.name}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    <span className={`${styles.text} mb-20`}>
                        Repost {postData.creator && postData.creator.name}&apos;s post
                        {reposts !== null && ' somewhere else'}:
                    </span>
                    <SpaceInput
                        blockedSpaces={blockedSpaces}
                        addedSpaces={addedSpaces}
                        setAddedSpaces={setAddedSpaces}
                        newSpaceError={newSpaceError}
                        setNewSpaceError={setNewSpaceError}
                        setParentModalOpen={setRepostModalOpen}
                        centered
                    />
                    <div
                        className={`wecoButton ${!addedSpaces.length && 'disabled'}`}
                        role='button'
                        tabIndex={0}
                        onClick={() => {
                            if (addedSpaces.length) {
                                submitRepost()
                            }
                        }}
                        onKeyDown={() => {
                            if (addedSpaces.length) {
                                submitRepost()
                            }
                        }}
                    >
                        Repost
                    </div>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default PostCardRepostModal
