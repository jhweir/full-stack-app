import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '@src/Config'
import styles from '@styles/components/PostCardRatingModal.module.scss'
import SmallFlagImage from '@components/SmallFlagImage'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import { IPost } from '@src/Interfaces'
import Modal from '@components/Modal'
import Column from '@components/Column'
import Row from '@components/Row'
import Button from '@components/Button'
import ImageTitle from '@components/ImageTitle'

const PostCardRatingModal = (props: {
    postData: Partial<IPost>
    ratings: any[]
    setRatingModalOpen: (payload: boolean) => void
    getReactionData: () => void
    totalReactions: number
    setTotalReactions: (payload: number) => void
    totalRatings: number
    setTotalRatings: (payload: number) => void
    totalRatingPoints: number
    setTotalRatingPoints: (payload: number) => void
    accountRating: number
    setAccountRating: (payload: number) => void
}): JSX.Element => {
    const {
        postData,
        ratings,
        setRatingModalOpen,
        getReactionData,
        totalReactions,
        setTotalReactions,
        totalRatings,
        setTotalRatings,
        totalRatingPoints,
        setTotalRatingPoints,
        accountRating,
        setAccountRating,
    } = props

    const { accountData } = useContext(AccountContext)
    const { spaceData } = useContext(SpaceContext)

    const [newRating, setNewRating] = useState<null | number>(null)
    const [newRatingError, setNewRatingError] = useState(false)

    function averageScore() {
        if (totalRatings) {
            return `${(totalRatingPoints / totalRatings).toFixed(2)}%`
        }
        return 'N/A'
    }

    function addRating() {
        console.log('addRating')
        const invalidRating = !newRating || newRating > 100 || newRating < 0
        if (invalidRating) {
            setNewRatingError(true)
        } else {
            setTotalRatings(totalRatings + 1)
            setTotalReactions(totalReactions + 1)
            setTotalRatingPoints(newRating ? totalRatingPoints + newRating : totalRatingPoints)
            setAccountRating(accountRating + 1)
            axios
                .post(`${config.apiURL}/add-rating`, {
                    accountId: accountData.id,
                    accountHandle: accountData.handle,
                    accountName: accountData.name,
                    postId: postData.id,
                    holonId: window.location.pathname.includes('/s/') ? spaceData.id : null,
                    newRating,
                })
                .then((res) => {
                    if (res.data === 'success') {
                        setNewRating(null)
                        setTimeout(() => getReactionData(), 200)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    function newTotalRatingPoints() {
        const oldAccountRating = ratings.filter(
            (rating) => rating.creator.handle === accountData.handle
        )[0]
        // console.log('oldAccountRating: ', oldAccountRating)
        return totalRatingPoints - oldAccountRating.value
    }

    function removeRating() {
        console.log('removeRating')
        setTotalRatings(totalRatings - 1)
        setTotalReactions(totalReactions - 1)
        setTotalRatingPoints(newTotalRatingPoints())
        setAccountRating(0)
        axios
            .post(`${config.apiURL}/remove-rating`, {
                accountId: accountData.id,
                postId: postData.id,
                holonId: spaceData.id,
            })
            .then((res) => {
                if (res.data === 'success') {
                    setTimeout(() => getReactionData(), 200)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Modal close={() => setRatingModalOpen(false)} centered>
            <span className={styles.title}>Ratings</span>
            {!ratings ? (
                <span className={`${styles.text} mb-20`}>
                    <i>No ratings yet...</i>
                </span>
            ) : (
                <div className={styles.ratings}>
                    <div className={`${styles.rating} ${styles.averageScore}`}>
                        <span className={`${styles.text} mr-10`}>Average score:</span>
                        <div className={styles.totalScoreBar}>
                            <div
                                className={styles.averageScorePercentage}
                                style={{ width: totalReactions ? averageScore() : 0 }}
                            />
                            <div className={styles.totalScoreText}>{averageScore()}</div>
                        </div>
                    </div>
                    {ratings.map((rating) => (
                        <div className={styles.rating} key={rating}>
                            <Link
                                className={styles.imageTextLink}
                                to={`/u/${rating.creator.handle}`}
                            >
                                <SmallFlagImage
                                    type='user'
                                    size={30}
                                    imagePath={rating.creator.flagImagePath}
                                />
                                <span className={`${styles.text} ml-5`}>{rating.creator.name}</span>
                            </Link>
                            <div className={styles.totalScoreBar}>
                                <div
                                    className={styles.totalScorePercentage}
                                    style={{ width: `${rating.value}%` }}
                                />
                                <div className={styles.totalScoreText}>{`${rating.value}%`}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {accountRating < 1 ? (
                <div className={styles.inputWrapper}>
                    <input
                        className={`wecoInput mr-10 ${newRatingError && 'error'}`}
                        style={{ width: 40, padding: '0 10px', fontSize: 16 }}
                        value={newRating || undefined}
                        type='text'
                        onChange={(e) => {
                            setNewRating(+e.target.value)
                            setNewRatingError(false)
                        }}
                    />
                    <div className='mr-10'>/ 100</div>
                    <div
                        className='wecoButton'
                        role='button'
                        tabIndex={0}
                        onClick={addRating}
                        onKeyDown={addRating}
                    >
                        Add Rating
                    </div>
                </div>
            ) : (
                <div
                    className='wecoButton'
                    role='button'
                    tabIndex={0}
                    onClick={removeRating}
                    onKeyDown={removeRating}
                >
                    Remove Rating
                </div>
            )}
        </Modal>
    )
}

export default PostCardRatingModal
