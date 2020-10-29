import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardLinkModal.module.scss'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'

function PostCardLinkModal(props) {
    const {
        postData,
        links,
        setLinkModalOpen,
        getReactionData,
        totalReactions, setTotalReactions,
        totalLinks, setTotalLinks,
        accountLink, setAccountLink
    } = props

    const { accountData } = useContext(AccountContext)

    function addLink() {
        console.log('PostCardLinkModal: addLink')
        axios.post(config.environmentURL + '/add-link', { 
            accountId: accountData.id, 
            postId: postData.id
        })
        .then(res => {
            if (res.data === 'success') {
                setLinkModalOpen(false)
                setTotalReactions(totalReactions + 1)
                setTotalLinks(totalLinks + 1)
                setAccountLink(1)
                setTimeout(() => { getReactionData() }, 200)
            }
            else { console.log('error: ', res) }
        })
    }

    function removeLink() {
        console.log('PostCardLinkModal: removeLink')
        axios.post(config.environmentURL + '/remove-link', { 
            accountId: accountData.id, 
            postId: postData.id
        })
        .then(res => {
            if (res.data === 'success') {
                setLinkModalOpen(false)
                setTotalReactions(totalReactions - 1)
                setTotalLinks(totalLinks - 1)
                setAccountLink(0)
                setTimeout(() => { getReactionData() }, 200)
            }
            else { console.log('error: ', res) }
        })
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setLinkModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    console.log('links: ', links)

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setLinkModalOpen(false)}/>
                <span className={styles.title}>Links</span>
                {links === null
                    ? <span className={`${styles.text} mb-20`}><i>No links yet...</i></span>
                    : <div className={styles.links}>
                        {links.map((link, index) =>
                            <div className={styles.link} key={index}>
                                <Link className={styles.imageTextLink} to={`/u/${link.creator.handle}`}>
                                    <SmallFlagImage size={30} imagePath={link.creator.flagImagePath}/>
                                    <span className={`${styles.text} ml-5`}>{link.creator.name}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                }
                {accountLink === 0
                    ? <div
                        className='wecoButton'
                        onClick={addLink}>
                        Add Link
                    </div>
                    : <div
                        className='wecoButton'
                        onClick={removeLink}>
                        Remove Link
                    </div>
                }
            </div>
        </div>
    )
}

export default PostCardLinkModal
