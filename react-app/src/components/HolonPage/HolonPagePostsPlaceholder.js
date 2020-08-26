import React, { useContext } from 'react'
import PostCardPlaceholder from '../Cards/PostCard/PostCard/PostCardPlaceholder'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPagePostsPlaceholder.module.scss'

function HolonPagePostsPlaceholder() {
    const { holonContextLoading } = useContext(HolonContext)
    return (
        <div className={`${styles.PHWall} ${(holonContextLoading && styles.visible)}`}>
            <div className={styles.PHWallGradientWrapper}/>
            <PostCardPlaceholder/>
            <PostCardPlaceholder/>
            <PostCardPlaceholder/>
            <PostCardPlaceholder/>
            <PostCardPlaceholder/>
        </div>
    )
}

export default HolonPagePostsPlaceholder