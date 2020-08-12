import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/CommentCard.module.scss'
import { PostContext } from '../../contexts/PostContext'

function CommentCard(props) {
    const { index, comment } = props
    const { postId, commentCreator, text, createdAt } = comment
    const { getPostData, getPostComments } = useContext(PostContext)

    function reply() {

    }

    function deleteComment() {
        axios.delete(config.environmentURL  + '/delete-comment', { data: { commentId: comment.id } })
            .then(setTimeout(() => { getPostData(); getPostComments() }, 200))
            .catch(error => { console.log(error) })
    }

    function formatDate() {
        const t = createdAt.split(/[-.T :]/)
        let formattedDate = t[3]+':'+t[4]+' on '+t[2]+'-'+t[1]+'-'+t[0]
        return formattedDate
    }

    return (
        <div className={styles.commentCard}>
            {/* <div className={styles.index}>{index + 1 || ''}</div> */}
            <div className={styles.body}>
                <div className={styles.tags}>
                    {commentCreator &&
                        <Link to={ `/u/${commentCreator.handle}`} className={styles.user}>
                            {commentCreator.flagImagePath ?
                                <img className={styles.userImage} src={commentCreator.flagImagePath} alt=''/> :
                                <div className={styles.userImagePlaceholderWrapper}>
                                    <img className={styles.userImagePlaceholder} src={'/icons/user-solid.svg'} alt=''/>
                                </div>
                            }
                            <span className={styles.subText}>{ commentCreator.name || 'Anonymous' }</span>
                        </Link>
                    }
                    <span className={styles.subText}>|</span>
                    <span className={styles.subText}>{ formatDate() || 'no date' }</span>
                </div>

                <div className={styles.content}>
                    <div className={styles.text}>{ text }</div>
                    
                    <div className={styles.interact}>
                        <div className={styles.interactItem} onClick={reply}>
                            <img className={`${styles.icon} ${styles.reply}`} src="/icons/reply-solid.svg" alt=''/>
                            <span>Reply</span>
                        </div>
                        {/* {isOwnComment && */}
                            <div className={styles.interactItem} onClick={deleteComment}>
                                <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                <span>Delete</span>
                            </div>
                        {/* } */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentCard
