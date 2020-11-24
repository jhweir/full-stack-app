import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../../../Config'
import styles from '../../../styles/components/PostCardLinkModal.module.scss'
import CloseButton from '../../CloseButton'
import SmallFlagImage from '../../SmallFlagImage'
import DropDownMenu from '../../DropDownMenu'
import PostCard from '../../Cards/PostCard/PostCard'
import { AccountContext } from '../../../contexts/AccountContext'

function PostCardLinkModal(props) {
    const {
        postData,
        //links,
        setLinkModalOpen,
        getReactionData,
        totalReactions, setTotalReactions,
        totalLinks, setTotalLinks,
        accountLink, setAccountLink
    } = props

    const { accountData } = useContext(AccountContext)

    const [linkTo, setLinkTo] = useState('Post')
    const [linkType, setLinkType] = useState('Text')
    const [linkDescription, setLinkDescription] = useState('')
    const [linkDescriptionError, setLinkDescriptionError] = useState(false)
    const [targetUrl, setTargetUrl] = useState('')
    const [targetUrlError, setTargetUrlError] = useState(false)

    let prefix, placeholder, inputWidth
    if (linkTo === 'Post') { prefix = 'p/'; placeholder = 'id'; inputWidth = 40 }
    if (linkTo === 'Comment') { prefix = 'c/'; placeholder = 'id'; inputWidth = 40 }
    if (linkTo === 'Space') { prefix = 's/'; placeholder = 'handle'; inputWidth = 70 }
    if (linkTo === 'User') { prefix = 'u/'; placeholder = 'handle'; inputWidth = 70 }

    function addLink() {
        let validTargetUrl = targetUrl.length > 0
        let validLinkDescription = linkType !== 'Text' || linkDescription.length > 0
        if (validTargetUrl && validLinkDescription) {
            console.log('PostCardLinkModal: addLink')
            axios.post(config.environmentURL + '/add-link', { 
                creatorId: accountData.id,
                type: `post-${linkTo.toLowerCase()}`,
                relationship: linkType.toLowerCase(),
                description: linkDescription,
                itemAId: postData.id,
                itemBId: targetUrl
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

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setLinkModalOpen(false)}/>
                <span className={styles.title}>Links</span>
                {!postData.PostsLinkedTo.length ?
                    <span className={`${styles.text} mb-20`}><i>No links yet...</i></span> :
                    <div className={styles.links}>
                        {postData.PostsLinkedTo.map((post, index) =>
                            <PostCard postData={post} key={index} index={index} location='holon-posts'/>
                            // <div className={styles.link} key={index}>
                            //     <Link className={styles.imageTextLink} to={`/u/${'link.creator.handle'}`}>
                            //         <SmallFlagImage type='user' size={30} imagePath={'link.creator.flagImagePath'}/>
                            //         <span className={`${styles.text} ml-5`}>{'link.creator.name'}</span>
                            //     </Link>
                            // </div>
                        )}
                    </div>
                }
                <div className={styles.settingsText}>
                    <span className={styles.text} style={{marginBottom: 10}}>Link this post to another</span>
                    <DropDownMenu
                        title=''
                        options={['Post', 'Comment', 'User', 'Space']}
                        selectedOption={linkTo}
                        setSelectedOption={setLinkTo}
                        style='horizontal'
                    />
                    <span className='greyText' style={{marginBottom: 10, marginRight: 5}}>{ prefix }</span>
                    <input className={`wecoInput mb-10 ${targetUrlError && 'error'}`}
                        style={{height: 30, width: inputWidth, padding: 10}}
                        placeholder={placeholder}
                        type="text" value={targetUrl}
                        onChange={(e) => { setTargetUrl(e.target.value); setTargetUrlError(false) }}
                    />
                </div>
                {/* <div className={styles.settingsText}>
      
                </div> */}
                <div className={styles.settingsText}>
                    <span className={styles.text} style={{marginBottom: 10}}>Link type</span>
                    <DropDownMenu
                        title=''
                        options={['Text', 'Turn']}
                        selectedOption={linkType}
                        setSelectedOption={setLinkType}
                        style='horizontal'
                    />
                </div>
                {linkType === 'Text' &&
                    <textarea className={`wecoInput textArea mb-10 ${linkDescriptionError && 'error'}`}
                        style={{height: 40, width: 350}}
                        placeholder="Describe the relationship..."
                        type="text" value={linkDescription}
                        onChange={(e) => { setLinkDescription(e.target.value); setLinkDescriptionError(false) }}
                    />
                }

                <div
                    className={`wecoButton mt-20 ${(!targetUrl.length || (linkType === 'Text' && !linkDescription.length)) && 'disabled'}`}
                    onClick={addLink}>
                    Add Link
                </div>
                {/* {accountLink === 0
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
                } */}
            </div>
        </div>
    )
}

export default PostCardLinkModal
