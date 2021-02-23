import React, { useState, useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'
import styles from '../../../styles/components/PostCard.module.scss'
import colors from '../../../styles/Colors.module.scss'
import PostCardUrlPreview from './PostCardUrlPreview'
import SmallFlagImage from '../../SmallFlagImage'
import { dateCreated } from '../../../GlobalFunctions'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

function PostCard(props) {
    const { type, spaces, text, url, urlImage, urlDomain, urlTitle, urlDescription } = props
    const { accountData } = useContext(AccountContext)
    const { setHolonHandle } = useContext(HolonContext)

    const now = new Date()
    const minute = 1000 * 60 + 1000
    const createdAt = new Date(now.getTime() - minute).toISOString()
    console.log('createdAt: ', createdAt)

    const [totalComments, setTotalComments] = useState(0)
    const [totalReactions, setTotalReactions] = useState(0)
    // const [totalLikes, setTotalLikes] = useState(0)
    // const [totalRatings, setTotalRatings] = useState(0)
    // const [totalRatingPoints, setTotalRatingPoints] = useState(0)
    // const [totalReposts, setTotalReposts] = useState(0)
    // const [totalLinks, setTotalLinks] = useState(0)
    const [accountLike, setAccountLike] = useState(0)
    const [accountRating, setAccountRating] = useState(0)
    const [accountRepost, setAccountRepost] = useState(0)
    const [accountLink, setAccountLink] = useState(0)

    const [blockedSpaces, setBlockedSpaces] = useState([])
    const [reactionsOpen, setReactionsOpen] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)

    const [textOverflow, setTextOverflow] = useState(false)
    const [showFullText, setShowFullText] = useState(false)

    // const finishedLoading = location !== 'post-page' || !postContextLoading
    // const isOwnPost = finishedLoading && accountData.id === creator.id
    const showLinkPreview = (urlImage !== null || urlDomain !== null || urlTitle !== null || urlDescription !== null)
    //const postSpaces = DirectSpaces && DirectSpaces.filter(space => space.type === 'post')

    let backgroundColor
    if (type === 'text') backgroundColor = colors.green
    if (type === 'url') backgroundColor = colors.yellow
    if (type === 'poll') backgroundColor = colors.red
    if (type === 'glass-bead') backgroundColor = colors.blue
    if (type === 'plot-graph') backgroundColor = colors.orange
    if (type === 'prism') backgroundColor = colors.purple

    const textRef = useRef()
    useEffect(() => {
        if (textRef.current && textRef.current.scrollHeight > 200) {
            setTextOverflow(true)
        } else {
            setTextOverflow(false)
        }
    }, [text])

    return (
        <div className={styles.post}>
            <div className={styles.body}>
                <div className={styles.tags}>
                    <div className={styles.creator}>
                        <SmallFlagImage type='user' size={35} imagePath={accountData.flagImagePath}/>
                        <span className='ml-10 mr-5'>{ accountData.name }</span>
                    </div>
                    <span className={styles.subText}>to</span>
                    <div className={styles.postSpaces}>
                        {spaces.length > 0
                            ? spaces.map((space, index) =>
                                <div style={{marginRight: 10}} key={index}>
                                    {space}
                                </div>)
                            : <div style={{marginRight: 10}}>
                                all
                            </div>
                        }
                    </div>
                    <span className={styles.subText}>•</span>
                    <div className={styles.link}>
                        <img className={styles.linkIcon} src={'/icons/link-solid.svg'} alt=''/>
                        <span className={styles.subText} title={dateCreated(createdAt)}>
                            now
                            {/* {timeSinceCreated(createdAt)} */}
                        </span>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={`${styles.text} ${showFullText ? styles.showFullText : ''}`} ref={textRef}>
                        <ReactMarkdown plugins={[gfm]} children={text.length > 0 ? text : '*text...*'}/>
                    </div>
                    {textOverflow &&
                        <div className={styles.showMore} onClick={() => setShowFullText(!showFullText)}>
                            {showFullText ? 'show less' : 'show more'}
                        </div>
                    }
                    {showLinkPreview &&
                        <PostCardUrlPreview
                            url={url}
                            urlImage={urlImage}
                            urlDomain={urlDomain}
                            urlTitle={urlTitle}
                            urlDescription={urlDescription}
                        />
                    }
                    <div className={styles.interact}>
                        <div className={styles.interactItem}>
                            <img 
                                className={`${styles.icon} ${(accountLike || accountRating || accountRepost || accountLink > 0) && styles.selected}`}
                                src="/icons/fire-alt-solid.svg" alt=''
                            />
                            <span className={'greyText'}>{totalReactions} Reactions</span>
                        </div>
                        <div className={styles.interactItem}>
                            <img className={styles.icon} src="/icons/comment-solid.svg" alt=''/>
                            <span className='greyText'>{ totalComments } Comments</span>
                        </div>
                        {type === 'glass-bead' &&
                            <div className={styles.interactItem}>
                                <img 
                                    className={styles.icon}
                                    src="/icons/arrow-alt-circle-right-solid.svg" alt=''
                                />
                                <span className={'greyText'}>Add turn</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard
