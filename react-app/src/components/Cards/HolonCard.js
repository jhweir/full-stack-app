import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../../contexts/HolonContext'
import LargeFlagImage from '../LargeFlagImage'
import styles from '../../styles/components/HolonCard.module.scss'

function HolonCard(props) {
    const {
        id,
        handle,
        name,
        description,
        flagImagePath,
        coverImagePath,
        total_followers,
        total_posts,
        total_comments,
        total_reactions,
        total_likes,
        total_hearts,
        total_ratings
    } = props.holon

    const { setHolonHandle } = useContext(HolonContext)

    const [descriptionOverflow, setDescriptionOverflow] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)

    const descriptionRef = useRef()

    useEffect(() => {
        if (descriptionRef.current && descriptionRef.current.scrollHeight > 50) {
            setDescriptionOverflow(true)
        } else {
            setDescriptionOverflow(false)
        }
    }, [props])

    return (
        <div className={styles.wrapper}>
            {/* <div className={styles.index}>{ props.index + 1 }</div> */}
            <div className={styles.content}>
                <div className={styles.coverImage}
                    style={{ backgroundImage: `${coverImagePath ? 'url(' + coverImagePath + ')' : 'linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%'}` }}>
                        <div className={styles.coverImageFade}>
                        <Link to={ `/s/${handle}` }
                            className={styles.flagImage}
                            onClick={ () => { setHolonHandle(handle) } }>
                                <LargeFlagImage
                                    size={150}
                                    imagePath={flagImagePath}
                                    type='space'
                                    canEdit={false}
                                />
                        </Link>
                        <div className={styles.nameWrapper}>
                            <Link to={`/s/${handle}`}
                                onClick={() => setHolonHandle(handle)}>
                                <span className={styles.name}>{ name }</span>
                            </Link>
                            <span className={styles.handle}>{ `s/${handle}` }</span>
                        </div>
                    </div>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src="/icons/users-solid.svg" alt=''/>
                        <span>{ total_followers } Followers</span>
                    </div>
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
                </div>
                <div className={styles.info}>
                    {/* <Link className={styles.title}
                        to={ `/s/${handle}` }
                        onClick={ () => { setHolonHandle(handle) } }>
                        { name }
                    </Link> */}
                    {/* <span className={styles.description}>{description}</span> */}
                    <span ref={descriptionRef} className={`${styles.description} ${showFullDescription && styles.expanded}`}>
                        { description }
                    </span>
                    {descriptionOverflow &&
                        <span
                            className={styles.showMoreLessText}
                            onClick={() => setShowFullDescription(!showFullDescription)}>
                            {showFullDescription ? 'Show less' : 'Show more'}
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}

export default HolonCard
