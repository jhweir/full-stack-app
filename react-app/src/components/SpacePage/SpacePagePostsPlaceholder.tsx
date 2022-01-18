import React from 'react'
import PostCardPlaceholder from '../Cards/PostCard/PostCardPlaceholder'
// import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/SpacePagePostsPlaceholder.module.scss'

const SpacePagePostsPlaceholder = (): JSX.Element => {
    return (
        <div className={styles.PHWall}>
            <div className={styles.PHWallGradientWrapper} />
            <PostCardPlaceholder />
            <PostCardPlaceholder />
            <PostCardPlaceholder />
            <PostCardPlaceholder />
            <PostCardPlaceholder />
        </div>
    )
}

export default SpacePagePostsPlaceholder
