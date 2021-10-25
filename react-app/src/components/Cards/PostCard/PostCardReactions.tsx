import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardReactions.module.scss'
import PostCardReactionItem from './PostCardReactionItem'
import PostCardLikeModal from './PostCardLikeModal'
import PostCardRepostModal from './PostCardRepostModal'
import PostCardRatingModal from './PostCardRatingModal'
import PostCardLinkModal from './PostCardLinkModal'
import { AccountContext } from '../../../contexts/AccountContext'
import { IPost } from '../../../Interfaces'

const PostCardReactions = (props: {
    postData: Partial<IPost>
    totalReactions: number | undefined
    totalLikes: number | undefined
    totalReposts: number | undefined
    totalRatings: number | undefined
    totalRatingPoints: number | undefined
    totalLinks: number | undefined
    accountLike: number | undefined
    accountRepost: number | undefined
    accountRating: number | undefined
    accountLink: number | undefined
    blockedSpaces: any[]
    setTotalReactions: (payload: number) => void
    setTotalLikes: (payload: number) => void
    setTotalReposts: (payload: number) => void
    setTotalRatings: (payload: number) => void
    setTotalRatingPoints: (payload: number) => void
    setTotalLinks: (payload: number) => void
    setAccountLike: (payload: number) => void
    setAccountRepost: (payload: number) => void
    setAccountRating: (payload: number) => void
    setAccountLink: (payload: number) => void
    setBlockedSpaces: (payload: any[]) => void
}): JSX.Element => {
    const {
        postData,
        totalReactions,
        totalLikes,
        totalReposts,
        totalRatings,
        totalRatingPoints,
        totalLinks,
        accountLike,
        accountRepost,
        accountRating,
        accountLink,
        blockedSpaces,
        setTotalReactions,
        setTotalLikes,
        setTotalReposts,
        setTotalRatings,
        setTotalRatingPoints,
        setTotalLinks,
        setAccountLike,
        setAccountRepost,
        setAccountRating,
        setAccountLink,
        setBlockedSpaces,
    } = props

    const { loggedIn, setAlertMessage, setAlertModalOpen } = useContext(AccountContext)

    const [reactionData, setReactionData] = useState({ Reactions: [] })
    const [likePreviewOpen, setLikePreviewOpen] = useState(false)
    const [likeModalOpen, setLikeModalOpen] = useState(false)
    const [repostPreviewOpen, setRepostPreviewOpen] = useState(false)
    const [repostModalOpen, setRepostModalOpen] = useState(false)
    const [ratingPreviewOpen, setRatingPreviewOpen] = useState(false)
    const [ratingModalOpen, setRatingModalOpen] = useState(false)
    const [linkPreviewOpen, setLinkPreviewOpen] = useState(false)
    const [linkModalOpen, setLinkModalOpen] = useState(false)
    const [links, setLinks] = useState({ outgoingLinks: [], incomingLinks: [] })

    function getReactionData() {
        console.log('PostCardReactions: getReactionData')
        axios
            .get(`${config.apiURL}/post-reaction-data?postId=${postData.id}`)
            .then((res) => setReactionData(res.data))
    }

    function getPostLinkData() {
        axios
            .get(`${config.apiURL}/post-link-data?postId=${postData.id}`)
            .then((res) => setLinks(res.data))
    }

    useEffect(() => {
        getReactionData()
        if (totalLinks && totalLinks > 0) getPostLinkData()
    }, [])

    return (
        <div className={styles.postCardReactions}>
            <PostCardReactionItem
                text='Likes'
                reactions={
                    reactionData &&
                    reactionData.Reactions.filter(
                        (label: { type: string }) => label.type === 'like'
                    )
                }
                previewOpen={likePreviewOpen}
                setPreviewOpen={setLikePreviewOpen}
                accountReaction={accountLike || 0}
                totalReactions={totalLikes || 0}
                iconPath='thumbs-up-solid.svg'
                onClick={() => {
                    if (loggedIn) {
                        setLikeModalOpen(true)
                    } else {
                        setAlertMessage('Log in to like post')
                        setAlertModalOpen(true)
                    }
                }}
            />
            <PostCardReactionItem
                text='Reposts'
                reactions={
                    reactionData &&
                    reactionData.Reactions.filter(
                        (label: { type: string }) => label.type === 'repost'
                    )
                }
                previewOpen={repostPreviewOpen}
                setPreviewOpen={setRepostPreviewOpen}
                accountReaction={accountRepost || 0}
                totalReactions={totalReposts || 0}
                iconPath='retweet-solid.svg'
                onClick={() => {
                    if (loggedIn) {
                        setRepostModalOpen(true)
                    } else {
                        setAlertMessage('Log in to repost post')
                        setAlertModalOpen(true)
                    }
                }}
            />
            <PostCardReactionItem
                text='Ratings'
                reactions={
                    reactionData &&
                    reactionData.Reactions.filter(
                        (label: { type: string }) => label.type === 'rating'
                    )
                }
                // mainModalOpen={ratingModalOpen} setMainModalOpen={setRatingModalOpen}
                previewOpen={ratingPreviewOpen}
                setPreviewOpen={setRatingPreviewOpen}
                accountReaction={accountRating || 0}
                totalReactions={totalRatings || 0}
                totalReactionPoints={totalRatingPoints}
                iconPath='star-solid.svg'
                onClick={() => {
                    if (loggedIn) {
                        setRatingModalOpen(true)
                    } else {
                        setAlertMessage('Log in to rate post')
                        setAlertModalOpen(true)
                    }
                }}
            />
            <PostCardReactionItem
                text='Links'
                reactions={links && links}
                previewOpen={linkPreviewOpen}
                setPreviewOpen={setLinkPreviewOpen}
                accountReaction={accountLink || 0}
                totalReactions={totalLinks || 0}
                iconPath='link-solid.svg'
                onClick={() => {
                    if (loggedIn) {
                        setLinkModalOpen(true)
                    } else {
                        setAlertMessage('Log in to link post')
                        setAlertModalOpen(true)
                    }
                }}
            />
            {/* TODO: Move modals into PostCardReactionItems? */}
            {likeModalOpen && (
                <PostCardLikeModal
                    postData={postData}
                    likes={
                        reactionData
                            ? reactionData.Reactions.filter(
                                  (label: { type: string }) => label.type === 'like'
                              )
                            : []
                    }
                    setLikeModalOpen={setLikeModalOpen}
                    totalReactions={totalReactions || 0}
                    setTotalReactions={setTotalReactions}
                    totalLikes={totalLikes || 0}
                    setTotalLikes={setTotalLikes}
                    accountLike={accountLike || 0}
                    setAccountLike={setAccountLike}
                    getReactionData={getReactionData}
                />
            )}
            {repostModalOpen && (
                <PostCardRepostModal
                    postData={postData}
                    reposts={
                        reactionData
                            ? reactionData.Reactions.filter(
                                  (label: { type: string }) => label.type === 'repost'
                              )
                            : []
                    }
                    setRepostModalOpen={setRepostModalOpen}
                    totalReactions={totalReactions || 0}
                    setTotalReactions={setTotalReactions}
                    totalReposts={totalReposts || 0}
                    setTotalReposts={setTotalReposts}
                    accountRepost={accountRepost || 0}
                    setAccountRepost={setAccountRepost}
                    getReactionData={getReactionData}
                    blockedSpaces={blockedSpaces}
                    setBlockedSpaces={setBlockedSpaces}
                />
            )}
            {ratingModalOpen && (
                <PostCardRatingModal // TODO: update like repost modal (use postData)?
                    postData={postData}
                    ratings={
                        reactionData &&
                        reactionData.Reactions.filter(
                            (label: { type: string }) => label.type === 'rating'
                        )
                    }
                    setRatingModalOpen={setRatingModalOpen}
                    totalReactions={totalReactions || 0}
                    setTotalReactions={setTotalReactions}
                    totalRatings={totalRatings || 0}
                    setTotalRatings={setTotalRatings}
                    totalRatingPoints={totalRatingPoints || 0}
                    setTotalRatingPoints={setTotalRatingPoints}
                    accountRating={accountRating || 0}
                    setAccountRating={setAccountRating}
                    getReactionData={getReactionData}
                />
            )}
            {linkModalOpen && (
                <PostCardLinkModal
                    postData={postData}
                    links={links}
                    setLinkModalOpen={setLinkModalOpen}
                    getReactionData={getReactionData}
                    totalReactions={totalReactions || 0}
                    setTotalReactions={setTotalReactions}
                    totalLinks={totalLinks || 0}
                    setTotalLinks={setTotalLinks}
                    // accountLink={accountLink}
                    setAccountLink={setAccountLink}
                />
            )}
        </div>
    )
}

export default PostCardReactions
