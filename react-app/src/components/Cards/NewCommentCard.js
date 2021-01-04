import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/NewCommentCard.module.scss'
import { AccountContext } from '../../contexts/AccountContext'
import { PostContext } from '../../contexts/PostContext'
import SmallFlagImage from '../../components/SmallFlagImage'

function NewCommentCard(props) {
    const { index, comment } = props
    const { postId, commentCreator, text, createdAt } = comment
    const { accountData, isLoggedIn } = useContext(AccountContext)
    const { getPostData, getPostComments } = useContext(PostContext)

    const isOwnComment = accountData.id === commentCreator.id

    function reply() {
        //...
    }

    function deleteComment() {
        axios.delete(config.apiURL  + '/delete-comment', { data: { commentId: comment.id } })
            .then(setTimeout(() => { getPostData(); getPostComments() }, 200))
            .catch(error => { console.log(error) })
    }

    function formattedDate() {
        const t = createdAt.split(/[-.T :]/)
        let formattedDate = t[3]+':'+t[4]+' on '+t[2]+'-'+t[1]+'-'+t[0]
        return formattedDate
    }

    return (
        <div className={styles.wrapper}>
            <Link to={ `/u/${commentCreator.handle}`} className={styles.user}>
                <SmallFlagImage type='user' size={30} imagePath={commentCreator.flagImagePath}/>
                {/* <span className={styles.subText}>{ commentCreator.name }</span> */}
            </Link>
            <div className={styles.content}>
                <div className={styles.grey}>
                    <div className={styles.tags}>
                        <span className={styles.name}>{ commentCreator.name }</span>
                        <span className={styles.divider}>|</span>
                        <span className={styles.date}>{ formattedDate() }</span>
                    </div>
                    <span className={styles.text}>{ text }</span>
                </div>
                <div className={styles.interact}>
                    <span className={styles.interactItem}>Like</span>
                    <span className={styles.interactItem}>Reply</span>
                    {isOwnComment &&
                        <span className={styles.interactItem}>Delete</span>
                    }
                </div>
            </div>


            {/* <div className={styles.index}>{index + 1 || ''}</div> */}
            {/* <div className={styles.body}>
                <div className={styles.tags}>
                    
                        <Link to={ `/u/${commentCreator.handle}`} className={styles.user}>
                            <SmallFlagImage type='user' size={30} imagePath={commentCreator.flagImagePath}/>
                            <span className={styles.subText}>{ commentCreator.name }</span>
                        </Link>
                    
                    <span className={`${styles.subText} mr-10`}>|</span>
                    <span className={styles.subText}>{ formatDate() || 'no date' }</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.text}>{ text }</div>
                    <div className={styles.interact}>
                        {isLoggedIn &&
                            <div className={styles.interactItem} onClick={reply}>
                                <img className={`${styles.icon} ${styles.reply}`} src="/icons/reply-solid.svg" alt=''/>
                                <span>Reply</span>
                            </div>
                        }
                        {isOwnComment &&
                            <div className={styles.interactItem} onClick={deleteComment}>
                                <img className={styles.icon} src="/icons/trash-alt-solid.svg" alt=''/>
                                <span>Delete</span>
                            </div>
                        }
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default NewCommentCard