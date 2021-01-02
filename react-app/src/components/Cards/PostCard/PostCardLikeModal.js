import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardLikeModal.module.scss'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'
import { HolonContext } from '../../../contexts/HolonContext'

function PostCardLikeModal(props) {
    const {
        postData,
        likes,
        setLikeModalOpen,
        getReactionData,
        totalReactions, setTotalReactions,
        totalLikes, setTotalLikes,
        accountLike, setAccountLike
    } = props

    const { accountData } = useContext(AccountContext)
    const { holonData } = useContext(HolonContext)

    console.log('accountData: ', accountData)

    function addLike() {
        console.log('add like')
        axios.post(config.apiURL + '/add-like', { 
            accountId: accountData.id,
            accountHandle: accountData.handle,
            accountName: accountData.name,
            postId: postData.id,
            holonId: window.location.pathname.includes('/s/') ? holonData.id : null,
        })
        .then(res => {
            if (res.data === 'success') {
                setLikeModalOpen(false)
                setTotalReactions(totalReactions + 1)
                setTotalLikes(totalLikes + 1)
                setAccountLike(1)
                setTimeout(() => { getReactionData() }, 200)
            }
            else { console.log('error: ', res) }
        })
    }

    function removeLike() {
        console.log('remove like')
        axios.post(config.apiURL + '/remove-like', { 
            accountId: accountData.id, 
            postId: postData.id
        })
        .then(res => {
            if (res.data === 'success') {
                setLikeModalOpen(false)
                setTotalReactions(totalReactions - 1)
                setTotalLikes(totalLikes - 1)
                setAccountLike(0)
                setTimeout(() => { getReactionData() }, 200)
            }
            else { console.log('error: ', res) }
        })
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setLikeModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setLikeModalOpen(false)}/>
                <span className={styles.title}>Likes</span>
                {!likes.length
                    ? <span className={`${styles.text} mb-20`}><i>No likes yet...</i></span>
                    : <div className={styles.likes}>
                        {likes.map((like, index) =>
                            <div className={styles.like} key={index}>
                                <Link className={styles.imageTextLink} to={`/u/${like.creator.handle}`}>
                                    <SmallFlagImage type='user' size={30} imagePath={like.creator.flagImagePath}/>
                                    <span className={`${styles.text} ml-5`}>{like.creator.name}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                }
                {accountLike === 0
                    ? <div
                        className='wecoButton'
                        onClick={addLike}>
                        Add Like
                    </div>
                    : <div
                        className='wecoButton'
                        onClick={removeLike}>
                        Remove Like
                    </div>
                }
            </div>
        </div>
    )
}

export default PostCardLikeModal
