import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import { UserContext } from '../../contexts/UserContext'
import styles from '../../styles/components/NotificationCard.module.scss'
import SmallFlagImage from '../SmallFlagImage'
import config from '../../Config'
import { timeSinceCreated, dateCreated } from '../../Functions'

const NotificationCard = (props: { notification: any }): JSX.Element => {
    const { notification } = props

    const { setUserHandle } = useContext(UserContext)
    const { accountData, getAccountData } = useContext(AccountContext)
    const { setPostId } = useContext(PostContext)

    const [seen, setSeen] = useState(true)

    const cookies = new Cookies()
    const accessToken = cookies.get('accessToken')

    useEffect(() => {
        if (notification.id) {
            setSeen(notification.seen)
        }
    }, [notification.id])

    function toggleSeen() {
        if (accessToken) {
            setSeen(!seen)
            axios
                .post(
                    `${config.apiURL}/toggle-notification-seen`,
                    { notificationId: notification.id, seen: !seen },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                .then((res) => {
                    if (res.data === 'success') {
                        setTimeout(() => {
                            getAccountData()
                        }, 300)
                    }
                })
        }
    }

    return (
        <div className={`${styles.wrapper} ${seen && styles.seen}`}>
            {/* <div className={styles.index}>{ index + 1 }</div> */}

            {notification.type === 'welcome-message' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.iconLarge} src='/icons/baby-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <div className={`${styles.text} mr-10`}>Account created</div>
                        <img
                            className={styles.checkIcon}
                            src='/icons/check-circle-regular.svg'
                            alt=''
                        />
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'email-verified' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/envelope-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <div className={`${styles.text} mr-10`}>Email verified</div>
                        <img
                            className={styles.checkIcon}
                            src='/icons/check-circle-regular.svg'
                            alt=''
                        />
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'post-like' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/thumbs-up-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={styles.text}>liked your</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/p/${notification.postId}`}
                            onClick={() => setPostId(notification.postId)}
                        >
                            <span className='blueText'>post</span>
                        </Link>
                        {notification.triggerSpace && (
                            <>
                                <div className={`${styles.text} mr-10`}>in</div>
                                <Link
                                    className={styles.imageTextLink}
                                    to={`/s/${notification.triggerSpace.handle}`}
                                >
                                    <SmallFlagImage
                                        type='space'
                                        size={30}
                                        imagePath={notification.triggerSpace.flagImagePath}
                                    />
                                    <span>{notification.triggerSpace.name}</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'post-comment' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/comment-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={styles.text}>commented on your</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/p/${notification.postId}`}
                            onClick={() => setPostId(notification.postId)}
                        >
                            <span className='blueText'>post</span>
                        </Link>
                        {notification.triggerSpace && (
                            <>
                                <div className={`${styles.text} mr-10`}>in</div>
                                <Link
                                    className={styles.imageTextLink}
                                    to={`/s/${notification.triggerSpace.handle}`}
                                >
                                    <SmallFlagImage
                                        type='space'
                                        size={30}
                                        imagePath={notification.triggerSpace.flagImagePath}
                                    />
                                    <span>{notification.triggerSpace.name}</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'post-repost' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.iconLarge} src='/icons/retweet-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={styles.text}>reposted your</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/p/${notification.postId}`}
                            onClick={() => setPostId(notification.postId)}
                        >
                            <span className='blueText'>post</span>
                        </Link>
                        {notification.triggerSpace && (
                            <>
                                <div className={`${styles.text} mr-10`}>in</div>
                                <Link
                                    className={styles.imageTextLink}
                                    to={`/s/${notification.triggerSpace.handle}`}
                                >
                                    <SmallFlagImage
                                        type='space'
                                        size={30}
                                        imagePath={notification.triggerSpace.flagImagePath}
                                    />
                                    <span>{notification.triggerSpace.name}</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'post-rating' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/star-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={styles.text}>rated your</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/p/${notification.postId}`}
                            onClick={() => setPostId(notification.postId)}
                        >
                            <span className='blueText'>post</span>
                        </Link>
                        {notification.triggerSpace && (
                            <>
                                <div className={`${styles.text} mr-10`}>in</div>
                                <Link
                                    className={styles.imageTextLink}
                                    to={`/s/${notification.triggerSpace.handle}`}
                                >
                                    <SmallFlagImage
                                        type='space'
                                        size={30}
                                        imagePath={notification.triggerSpace.flagImagePath}
                                    />
                                    <span>{notification.triggerSpace.name}</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'post-link' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img className={styles.icon} src='/icons/link-solid.svg' alt='' />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={styles.text}>linked your</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/p/${notification.postId}`}
                            onClick={() => setPostId(notification.postId)}
                        >
                            <span className='blueText'>post</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>to another post</div>
                        {notification.triggerSpace && (
                            <>
                                <div className={`${styles.text} mr-10`}>in</div>
                                <Link
                                    className={styles.imageTextLink}
                                    to={`/s/${notification.triggerSpace.handle}`}
                                >
                                    <SmallFlagImage
                                        type='space'
                                        size={30}
                                        imagePath={notification.triggerSpace.flagImagePath}
                                    />
                                    <span>{notification.triggerSpace.name}</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'comment-reply' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img
                            className={`${styles.icon} ${styles.rotated}`}
                            src='/icons/reply-solid.svg'
                            alt=''
                        />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={styles.text}>replied to your</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/p/${notification.postId}`}
                            onClick={() => setPostId(notification.postId)}
                        >
                            <span className='blueText'>comment</span>
                        </Link>
                        {notification.triggerSpace && (
                            <>
                                <div className={`${styles.text} mr-10`}>in</div>
                                <Link
                                    className={styles.imageTextLink}
                                    to={`/s/${notification.triggerSpace.handle}`}
                                >
                                    <SmallFlagImage
                                        type='space'
                                        size={30}
                                        imagePath={notification.triggerSpace.flagImagePath}
                                    />
                                    <span>{notification.triggerSpace.name}</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'parent-space-request' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img
                            className={styles.iconLarge}
                            src='/icons/overlapping-circles-thick.svg'
                            alt=''
                        />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${notification.triggerUser.handle}`}
                            onClick={() => setUserHandle(notification.triggerUser.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={notification.triggerUser.flagImagePath}
                            />
                            <span>
                                {accountData.id === notification.triggerUser.id
                                    ? 'You'
                                    : notification.triggerUser.name}
                            </span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>requested</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.triggerSpace.handle}`}
                        >
                            <SmallFlagImage
                                type='space'
                                size={30}
                                imagePath={notification.triggerSpace.flagImagePath}
                            />
                            <span>{notification.triggerSpace.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>become a child space of</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.secondarySpace.handle}`}
                        >
                            <SmallFlagImage
                                type='space'
                                size={30}
                                imagePath={notification.secondarySpace.flagImagePath}
                            />
                            <span>{notification.secondarySpace.name}</span>
                        </Link>
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            | {timeSinceCreated(notification.createdAt)}
                        </div>
                        {/* <div className={}>
                            Accept
                        </div> */}
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'parent-space-request-accepted' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img
                            className={styles.iconLarge}
                            src='/icons/overlapping-circles-thick.svg'
                            alt=''
                        />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${accountData.handle}`}
                            onClick={() => setUserHandle(accountData.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={accountData.flagImagePath}
                            />
                            <span>Your</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>request for</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.triggerSpace.handle}`}
                        >
                            <SmallFlagImage
                                type='space'
                                size={30}
                                imagePath={notification.triggerSpace.flagImagePath}
                            />
                            <span>{notification.triggerSpace.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>to become a child space of</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.secondarySpace.handle}`}
                        >
                            <SmallFlagImage
                                type='space'
                                size={30}
                                imagePath={notification.secondarySpace.flagImagePath}
                            />
                            <span>{notification.secondarySpace.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>has been accepted</div>
                        <img
                            className={styles.checkIcon}
                            src='/icons/check-circle-regular.svg'
                            alt=''
                        />
                        <div className={`${styles.text} ml-10 mr-10`}>•</div>
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}

            {notification.type === 'parent-space-request-rejected' && (
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img
                            className={styles.iconLarge}
                            src='/icons/overlapping-circles-thick.svg'
                            alt=''
                        />
                    </div>
                    <div className={styles.info}>
                        <Link
                            className={styles.imageTextLink}
                            to={`/u/${accountData.handle}`}
                            onClick={() => setUserHandle(accountData.handle)}
                        >
                            <SmallFlagImage
                                type='user'
                                size={30}
                                imagePath={accountData.flagImagePath}
                            />
                            <span>Your</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>request for</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.triggerSpace.handle}`}
                        >
                            <SmallFlagImage
                                type='space'
                                size={30}
                                imagePath={notification.triggerSpace.flagImagePath}
                            />
                            <span>{notification.triggerSpace.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>to become a child space of</div>
                        <Link
                            className={styles.imageTextLink}
                            to={`/s/${notification.secondarySpace.handle}`}
                        >
                            <SmallFlagImage
                                type='space'
                                size={30}
                                imagePath={notification.secondarySpace.flagImagePath}
                            />
                            <span>{notification.secondarySpace.name}</span>
                        </Link>
                        <div className={`${styles.text} mr-10`}>has been rejected</div>
                        <img
                            className={styles.timesIcon}
                            src='/icons/times-circle-regular.svg'
                            alt=''
                        />
                        <div className={`${styles.text} ml-10 mr-10`}>•</div>
                        <div className={styles.text} title={dateCreated(notification.createdAt)}>
                            {timeSinceCreated(notification.createdAt)}
                        </div>
                    </div>
                    <div
                        role='button'
                        tabIndex={0}
                        onClick={() => toggleSeen()}
                        onKeyDown={() => toggleSeen()}
                    >
                        <img
                            className={styles.seenIcon}
                            src={`/icons/${seen ? 'eye-solid.svg' : 'eye-slash-solid.svg'}`}
                            aria-label='seen'
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationCard
