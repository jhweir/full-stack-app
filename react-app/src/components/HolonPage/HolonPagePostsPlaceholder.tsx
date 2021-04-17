import React, { useContext } from 'react'
// import PostCardPlaceholder from '../Cards/PostCard/PostCard/PostCardPlaceholder'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPagePostsPlaceholder.module.scss'

const HolonPagePostsPlaceholder = (): JSX.Element => {
    const { spaceContextLoading } = useContext(SpaceContext)
    return (
        <div className={`${styles.PHWall} ${spaceContextLoading && styles.visible}`}>
            <div className={styles.PHWallGradientWrapper} />
            {/* <PostCardPlaceholder />
            <PostCardPlaceholder />
            <PostCardPlaceholder />
            <PostCardPlaceholder />
            <PostCardPlaceholder /> */}
        </div>
    )
}

export default HolonPagePostsPlaceholder
