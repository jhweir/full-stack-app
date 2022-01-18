import React from 'react'
import styles from '../styles/pages/EmptyPage.module.scss'
// import SpacePagePostsPlaceholder from '../components/SpacePagePostsPlaceholder'
import PostCardPlaceholder from '../components/Cards/PostCard/PostCardPlaceholder'
import SpaceCardPlaceholder from '../components/Cards/SpaceCardPlaceholder'

const EmptyPage = (): JSX.Element => {
    return (
        <div className={styles.emptyPage}>
            <div>Sorry, this page does not exist... :_(</div>
            <div className={styles.testSpace}>
                {/* <SpacePagePostsPlaceholder /> */}
                <PostCardPlaceholder />
                <PostCardPlaceholder />
                <SpaceCardPlaceholder />
            </div>
        </div>
    )
}

export default EmptyPage
