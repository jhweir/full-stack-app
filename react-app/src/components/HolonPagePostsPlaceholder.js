import React, { useContext } from 'react'
import PostPlaceholder from './PostPlaceholder'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/HolonPagePostsPlaceholder.module.scss'

function HolonPagePostsPlaceholder() {
    const { holonContextLoading } = useContext(HolonContext)
    return (
        <div className={`${styles.PHWall} ${(holonContextLoading && styles.visible)}`}>
            <div className={styles.PHWallGradientWrapper}/>
            <PostPlaceholder/>
            <PostPlaceholder/>
            <PostPlaceholder/>
            <PostPlaceholder/>
            <PostPlaceholder/>
        </div>
    )
}

export default HolonPagePostsPlaceholder