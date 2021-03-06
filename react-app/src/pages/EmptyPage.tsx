import React from 'react'
import styles from '../styles/pages/EmptyPage.module.scss'
// import HolonPagePostsPlaceholder from '../components/HolonPagePostsPlaceholder'
import PostCardPlaceholder from '../components/Cards/PostCard/PostCardPlaceholder'
import HolonCardPlaceholder from '../components/Cards/HolonCardPlaceholder'

const EmptyPage = (): JSX.Element => {
    return (
        <div className={styles.emptyPage}>
            <div>Sorry, this page does not exist... :_(</div>
            <div className={styles.testSpace}>
                {/* <HolonPagePostsPlaceholder /> */}
                <PostCardPlaceholder />
                <PostCardPlaceholder />
                <HolonCardPlaceholder />
            </div>
        </div>
    )
}

export default EmptyPage
