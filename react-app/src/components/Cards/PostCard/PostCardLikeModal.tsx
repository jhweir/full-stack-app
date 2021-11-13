import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/PostCardLikeModal.module.scss'
// import CloseButton from '@components/CloseButton'
import SmallFlagImage from '@components/SmallFlagImage'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
// import CloseOnClickOutside from '../../CloseOnClickOutside'
import { IPost } from '@src/Interfaces'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'
import { v4 as uuidv4 } from 'uuid'
import { isPlural, pluralise } from '@src/Functions'

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

    console.log('likes: ', likes)

    const { accountData } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)

    // todo: rethink state management, add success message, require auth token

    function addLike() {
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
                    // todo: update state directly
                    setTimeout(() => {
                        getReactionData()
                    }, 200)
                } else {
                    console.log('error: ', res)
                }
            })
    }

    function removeLike() {
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
                    // todo: update state directly
                    setTimeout(() => {
                        getReactionData()
                    }, 200)
                } else {
                    console.log('error: ', res)
                }
            })
    }

    return (
        <Modal close={() => setLikeModalOpen(false)} centered>
            <Column centerX width={250}>
                <h1>
                    {likes.length
                        ? `${likes.length} like${pluralise(likes.length)}`
                        : 'No likes yet...'}
                </h1>
                {!!likes && (
                    <Column>
                        {likes.map((like) => (
                            <ImageTitle
                                key={like.id}
                                type='user'
                                imagePath={like.creator.flagImagePath}
                                title={like.creator.name}
                                link={`/u/${like.creator.handle}`}
                                margin='0 0 10px 0'
                            />
                        ))}
                    </Column>
                )}
                <Button
                    text={`${accountLike < 1 ? 'Add' : 'Remove'} like`}
                    colour={accountLike < 1 ? 'blue' : 'red'}
                    size='medium'
                    margin={likes.length ? '20px 0 0 0' : ''}
                    onClick={() => (accountLike < 1 ? addLike() : removeLike())}
                />
            </Column>
        </Modal>
    )
}

export default PostCardLikeModal
