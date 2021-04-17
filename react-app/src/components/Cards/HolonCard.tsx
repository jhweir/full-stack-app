import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SpaceContext } from '../../contexts/SpaceContext'
import LargeFlagImage from '../LargeFlagImage'
import styles from '../../styles/components/HolonCard.module.scss'
import { ISpace } from '../../Interfaces'

const HolonCard = (props: { holon: ISpace }): JSX.Element => {
    const { holon } = props
    const {
        handle,
        name,
        description,
        flagImagePath,
        coverImagePath,
        total_followers,
        total_posts,
        total_comments,
        total_reactions,
        // total_likes,
        // total_hearts,
        // total_ratings
    } = holon

    const { setSpaceHandle } = useContext(SpaceContext)

    const [descriptionOverflow, setDescriptionOverflow] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false)

    const descriptionRef = useRef<HTMLDivElement>(null)

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
                <div
                    className={styles.coverImage}
                    style={{
                        backgroundImage: `${
                            coverImagePath
                                ? `url(${coverImagePath})`
                                : 'linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%'
                        }`,
                    }}
                >
                    <div className={styles.coverImageFade}>
                        <Link
                            to={`/s/${handle}`}
                            className={styles.flagImage}
                            onClick={() => {
                                setSpaceHandle(handle)
                            }}
                        >
                            <LargeFlagImage
                                size={150}
                                imagePath={flagImagePath}
                                type='space'
                                canEdit={false}
                            />
                        </Link>
                        <div className={styles.nameWrapper}>
                            <Link to={`/s/${handle}`} onClick={() => setSpaceHandle(handle)}>
                                <span className={styles.name}>{name}</span>
                            </Link>
                            <span className={styles.handle}>{`s/${handle}`}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src='/icons/users-solid.svg' alt='' />
                        <span>{total_followers} Followers</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src='/icons/edit-solid.svg' alt='' />
                        <span>{total_posts} Posts</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src='/icons/comment-solid.svg' alt='' />
                        <span>{total_comments} Comments</span>
                    </div>
                    <div className={styles.stat}>
                        <img className={styles.statIcon} src='/icons/fire-alt-solid.svg' alt='' />
                        <span>{total_reactions} Reactions</span>
                    </div>
                </div>
                <div className={styles.info}>
                    {/* <Link className={styles.title}
                        to={ `/s/${handle}` }
                        onClick={ () => { setSpaceHandle(handle) } }>
                        { name }
                    </Link> */}
                    {/* <span className={styles.description}>{description}</span> */}
                    <div
                        ref={descriptionRef}
                        className={`${styles.description} ${
                            showFullDescription && styles.expanded
                        }`}
                    >
                        {description}
                    </div>
                    {descriptionOverflow && (
                        <div
                            className={styles.showMoreLessText}
                            role='button'
                            tabIndex={0}
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            onKeyDown={() => setShowFullDescription(!showFullDescription)}
                        >
                            {showFullDescription ? 'Show less' : 'Show more'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HolonCard
