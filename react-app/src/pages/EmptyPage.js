import React from 'react'
import styles from '../styles/pages/EmptyPage.module.scss'
import HolonPagePostsPlaceholder from '../components/HolonPagePostsPlaceholder'
import PostPlaceholder from '../components/PostPlaceholder'
import HolonPlaceholder from '../components/HolonPlaceholder'

export default function EmptyPage() {
    return (
        <div className={styles.emptyPage}>
            <div>Sorry, this page does not exist... :_(</div>
            <div className={styles.testSpace}>
                {/* <HolonPagePostsPlaceholder /> */}
                <PostPlaceholder/>
                <PostPlaceholder/>
                <HolonPlaceholder/>
            </div>
        </div>
    )
}
