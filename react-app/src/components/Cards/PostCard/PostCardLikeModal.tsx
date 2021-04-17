import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardLikeModal.module.scss'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'
import { SpaceContext } from '../../../contexts/SpaceContext'
import CloseOnClickOutside from '../../CloseOnClickOutside'
import { IPost } from '../../../Interfaces'

const PostCardLikeModal = (props: {
    postData: Partial<IPost>
    likes: any[]
    setLikeModalOpen: (payload: boolean) => void
    getReactionData: () => void
    totalReactions: number
    setTotalReactions: (payload: number) => void
    totalLikes: number
    setTotalLikes: (payload: number) => void
    accountLike: number
    setAccountLike: (payload: number) => void
}): JSX.Element => {
    const {
        postData,
        likes,
        setLikeModalOpen,
        getReactionData,
        totalReactions,
        setTotalReactions,
        totalLikes,
        setTotalLikes,
        accountLike,
        setAccountLike,
    } = props

    const { accountData } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)

    function addLike() {
        console.log('PostCardLikeModal: addLike')
        axios
            .post(`${config.apiURL}/add-like`, {
                accountId: accountData.id,
                accountHandle: accountData.handle,
                accountName: accountData.name,
                postId: postData.id,
                holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
            })
            .then((res) => {
                if (res.data === 'success') {
                    setLikeModalOpen(false)
                    setTotalReactions(totalReactions + 1)
                    setTotalLikes(totalLikes + 1)
                    setAccountLike(1)
                    setTimeout(() => {
                        getReactionData()
                    }, 200)
                } else {
                    console.log('error: ', res)
                }
            })
    }

    function removeLike() {
        console.log('PostCardLikeModal: removeLike')
        axios
            .post(`${config.apiURL}/remove-like`, {
                accountId: accountData.id,
                postId: postData.id,
            })
            .then((res) => {
                if (res.data === 'success') {
                    setLikeModalOpen(false)
                    setTotalReactions(totalReactions - 1)
                    setTotalLikes(totalLikes - 1)
                    setAccountLike(0)
                    setTimeout(() => {
                        getReactionData()
                    }, 200)
                } else {
                    console.log('error: ', res)
                }
            })
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={() => setLikeModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setLikeModalOpen(false)} />
                    <span className={styles.title}>Likes</span>
                    {likes.length === 0 ? (
                        <span className={`${styles.text} mb-20`}>
                            <i>No likes yet...</i>
                        </span>
                    ) : (
                        <div className={styles.likes}>
                            {likes.map((like) => (
                                <div className={styles.like} key={like}>
                                    <Link
                                        className={styles.imageTextLink}
                                        to={`/u/${like.creator.handle}`}
                                    >
                                        <SmallFlagImage
                                            type='user'
                                            size={30}
                                            imagePath={like.creator.flagImagePath}
                                        />
                                        <span className={`${styles.text} ml-5`}>
                                            {like.creator.name}
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    {accountLike === 0 ? (
                        <div
                            className='wecoButton'
                            role='button'
                            tabIndex={0}
                            onClick={addLike}
                            onKeyDown={addLike}
                        >
                            Add Like
                        </div>
                    ) : (
                        <div
                            className='wecoButton'
                            role='button'
                            tabIndex={0}
                            onClick={removeLike}
                            onKeyDown={removeLike}
                        >
                            Remove Like
                        </div>
                    )}
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

export default PostCardLikeModal
