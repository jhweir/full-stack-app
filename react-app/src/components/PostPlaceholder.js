import React from 'react'
import styles from '../styles/components/PostPlaceholder.module.scss'

function PostPlaceholder() {
    return (
        <div className={styles.PHPost}>
            <div className="PHPostShine"/>
            <div className={styles.PHPostId}>
                <div className={styles.PHPostIdBlock}/>
            </div>
            <div className={styles.PHPostBody}>
                <div className={styles.PHPostTags}>
                    <div className={styles.PHPostUserImage}/> {/* src="/icons/user-image-00.jpg" */}
                    <span className={styles.PHPostTagsBlock1}/>
                    <span className={styles.PHPostTagsBlock2}/>
                </div>
                <div className={styles.PHPostContent}>
                    <div className={styles.PHPostTitle}/>
                    <div className={styles.PHPostDescription}/>    
                    <div className={styles.PHPostInteract}>
                        <div className={styles.PHPostInteractItem}>
                            <div className={styles.PHPostInteractItemCircle}/>
                            <div className={styles.PHPostInteractItemBlock}/>
                        </div>
                        <div className={styles.PHPostInteractItem}>
                            <div className={styles.PHPostInteractItemCircle}/>
                            <div className={styles.PHPostInteractItemBlock}/>
                        </div>
                        <div className={styles.PHPostInteractItem}>
                            <div className={styles.PHPostInteractItemCircle}/>
                            <div className={styles.PHPostInteractItemBlock}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostPlaceholder