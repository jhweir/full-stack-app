import React, { useContext, useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/PostCardRatingModal.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'
import Input from '@components/Input'
import { pluralise } from '@src/Functions'

const PostCardRatingModal = (props: {
    close: () => void
    postData: any
    setPostData: (payload: any) => void
}): JSX.Element => {
    const { close, postData, setPostData } = props
    const {
        loggedIn,
        accountData,
        setLogInModalOpen,
        setAlertMessage,
        setAlertModalOpen,
    } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)
    const [newRating, setNewRating] = useState(100)
    const [loading, setLoading] = useState(false)
    const cookies = new Cookies()
    const ratings = postData.Reactions.filter((r) => r.type === 'rating')
    const headerText = ratings.length
        ? `${ratings.length} rating${pluralise(ratings.length)}`
        : 'No ratings yet...'
    const averageScore = `${(postData.totalRatingPoints / ratings.length).toFixed(2)}%`

    function addRating() {
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        if (accessToken) {
            const data = {
                accountHandle: accountData.handle,
                accountName: accountData.name,
                postId: postData.id,
                spaceId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                newRating,
            }
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/add-rating`, data, authHeader)
                .then(() => {
                    setPostData({
                        ...postData,
                        totalReactions: postData.totalReactions + 1,
                        totalRatings: postData.totalRatings + 1,
                        totalRatingPoints: postData.totalRatingPoints + newRating,
                        accountRating: true,
                        Reactions: [
                            ...postData.Reactions,
                            {
                                type: 'rating',
                                value: newRating,
                                Creator: {
                                    id: accountData.id,
                                    handle: accountData.handle,
                                    name: accountData.name,
                                    flagImagePath: accountData.flagImagePath,
                                },
                            },
                        ],
                    })
                    close()
                })
                .catch((error) => console.log(error))
        } else {
            close()
            setAlertMessage('Log in to rate posts')
            setAlertModalOpen(true)
        }
    }

    function removeRating() {
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        if (accessToken) {
            const data = {
                postId: postData.id,
                spaceId: window.location.pathname.includes('/s/') ? spaceData.id : null,
            }
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios
                .post(`${config.apiURL}/remove-rating`, data, authHeader)
                .then(() => {
                    const removedRating = ratings.find((r) => r.Creator.id === accountData.id)
                    setPostData({
                        ...postData,
                        totalReactions: postData.totalReactions - 1,
                        totalRatings: postData.totalRatings - 1,
                        totalRatingPoints: postData.totalRatingPoints - +removedRating.value,
                        accountRating: false,
                        Reactions: [
                            ...postData.Reactions.filter(
                                (r) => !(r.type === 'rating' && r.Creator.id === accountData.id)
                            ),
                        ],
                    })
                    close()
                })
                .catch((error) => console.log(error))
        } else {
            close()
            setAlertMessage('Log in to rate posts')
            setAlertModalOpen(true)
        }
    }

    return (
        <Modal close={close} centered style={{ width: 400 }}>
            <h1>{headerText}</h1>
            {ratings.length > 0 && (
                <Column style={{ marginBottom: 10 }}>
                    <Row centerY spaceBetween style={{ marginBottom: 15 }}>
                        <p>Average score:</p>
                        <div className={`${styles.scoreBar} ${styles.aqua}`}>
                            <div style={{ width: averageScore }} />
                            <p>{averageScore}</p>
                        </div>
                    </Row>
                    {ratings.map((rating) => (
                        <Row centerY spaceBetween style={{ marginBottom: 15 }} key={rating.id}>
                            <ImageTitle
                                type='user'
                                imagePath={rating.Creator.flagImagePath}
                                title={rating.Creator.name}
                                link={`/u/${rating.Creator.handle}`}
                            />
                            <div className={styles.scoreBar}>
                                <div style={{ width: `${rating.value}%` }} />
                                <p>{`${rating.value}%`}</p>
                            </div>
                        </Row>
                    ))}
                </Column>
            )}
            {loggedIn ? (
                <Column>
                    {!postData.accountRating && (
                        <Row centerY style={{ marginBottom: 20 }}>
                            <Input
                                type='text'
                                style={{ width: 60, marginRight: 10 }}
                                value={newRating}
                                onChange={(v) => setNewRating(+v.replace(/\D/g, ''))}
                            />
                            <p>/ 100</p>
                        </Row>
                    )}
                    <Button
                        text={`${postData.accountRating ? 'Remove' : 'Add'} rating`}
                        colour={postData.accountRating ? 'red' : 'blue'}
                        disabled={newRating > 100}
                        loading={loading}
                        onClick={postData.accountRating ? removeRating : addRating}
                    />
                </Column>
            ) : (
                <Row centerY style={{ marginTop: ratings.length ? 20 : 0 }}>
                    <Button
                        text='Log in'
                        colour='blue'
                        style={{ marginRight: 5 }}
                        onClick={() => {
                            setLogInModalOpen(true)
                            close()
                        }}
                    />
                    <p>to rate posts</p>
                </Row>
            )}
        </Modal>
    )
}

export default PostCardRatingModal
