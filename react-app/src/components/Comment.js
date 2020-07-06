import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/Comment.module.scss'

function Comment(props) {

    let { commentCreator, text, createdAt } = props.comment

    function formatDate() {
        const t = createdAt.split(/[-.T :]/)
        let formattedDate = t[3]+':'+t[4]+' on '+t[2]+'-'+t[1]+'-'+t[0]
        return formattedDate
    }

    return (
        <div className={styles.comment}>
            {/* <div className={styles.commentId}>{ props.index + 1 || '' }</div> */}
            <div className={styles.commentBody}>

                <div className={styles.commentTags}>
                    {commentCreator &&
                        <Link to={ `/u/${commentCreator.name}`} className={styles.commentCreator}>
                            {commentCreator.profileImagePath ?
                                <img className={styles.userImage} src={commentCreator.profileImagePath} alt=''/> :
                                <div className={styles.userImageWrapper}>
                                    <img className={styles.userImagePlaceholder} src={'/icons/user-solid.svg'} alt=''/>
                                </div>
                            }
                            <span className={styles.commentSubText}>{ commentCreator && commentCreator.name || 'Anonymous' }</span>
                        </Link>
                    }
                    {/* <span className={styles.userThumbnail}></span>
                    <span className={styles.subText}>{ commentCreator && commentCreator.name || 'Anonymous' }</span> */}
                    <span className={styles.subText}>|</span>
                    <span className={styles.subText}>{ formatDate() || 'no date' }</span>
                </div>

                <div className={styles.commentContent}>
                    <div className={styles.commentText}>{ text }</div>
                    
                    <div className={styles.commentInteract}>
                        {/* <div className="post-interact-item" onClick={ addLike }>
                            <div className="like-icon"/>
                            <span>{ likes } Likes</span>
                        </div>
                        <div className="post-interact-item" onClick={ deletePost }>
                            <div className="delete-icon"/>
                            <span>Delete</span>
                        </div>
                        <div className="post-interact-item" onClick={ pins === null ? pinPost : unpinPost }>
                            <div className="pin-icon"/>
                            <span>{pins === null ? 'Pin post' : 'Unpin post'}</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment
