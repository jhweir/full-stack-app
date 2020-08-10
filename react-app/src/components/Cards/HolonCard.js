import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonCard.module.scss'

function HolonCard(props) {
    const {
        id,
        handle,
        name,
        description,
        flagImagePath,
        total_followers,
        total_posts,
        total_comments,
        total_reactions,
        total_likes,
        total_hearts,
        total_ratings
    } = props.holon

    const { setHolonHandle } = useContext(HolonContext)

    return (
        <div className={styles.holonCard}>
            <div className={styles.index}>{ props.index + 1 }</div>
            <Link className={styles.flagImage}
                to={ `/s/${handle}` }
                onClick={ () => { setHolonHandle(handle) } }>
                    {flagImagePath === null
                        ? <div className={styles.flagImagePlaceholderWrapper}>
                            <img className={styles.flagImagePlaceholder} src='/icons/users-solid.svg' alt=''/>
                        </div>
                        : <img className={styles.flagImage} src={flagImagePath} alt=''/>
                    }
            </Link>
            <div className={styles.info}>
                <Link className={styles.title}
                    to={ `/s/${handle}` }
                    onClick={ () => { setHolonHandle(handle) } }>
                    { name }
                </Link>
                <span className={styles.description}>{description}</span>
                <div className={styles.stat}>
                    <img className={styles.statIcon} src="/icons/users-solid.svg" alt=''/>
                    <span>{ total_followers } Followers</span>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/edit-solid.svg" alt=''/>
                        <span>{ total_posts } Posts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/comment-solid.svg" alt=''/>
                        <span>{ total_comments } Comments</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/fire-alt-solid.svg" alt=''/>
                        <span>{ total_reactions } Reactions</span>
                    </div>
                    {/* <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/thumbs-up-solid.svg" alt=''/>
                        <span>{ total_likes } Likes</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/heart-solid.svg" alt=''/>
                        <span>{ total_hearts } Hearts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/star-solid.svg" alt=''/>
                        <span>{ total_ratings } Ratings</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default HolonCard
