import React, { useContext } from 'react'
import PostPlaceholder from './PostPlaceholder'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/WallPlaceholder.module.scss'

function WallPlaceholder() {
    const { isLoading } = useContext(HolonContext)
    return (
        <div className={`${styles.PHWall} ${(isLoading && styles.visible)}`}>
            <div className={styles.PHWallGradientWrapper}/>
            <PostPlaceholder/>
            <PostPlaceholder/>
            <PostPlaceholder/>
            <PostPlaceholder/>
            <PostPlaceholder/>
        </div>
    )
}

export default WallPlaceholder