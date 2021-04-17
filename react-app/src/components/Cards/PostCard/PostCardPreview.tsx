import React, { useState, useContext, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { AccountContext } from '../../../contexts/AccountContext'
import styles from '../../../styles/components/PostCard.module.scss'
import PostCardUrlPreview from './PostCardUrlPreview'
import SmallFlagImage from '../../SmallFlagImage'

const PostCardPreview = (props: {
    type: string
    spaces: any[]
    text: string
    url?: string
    urlImage?: string
    urlDomain?: string
    urlTitle?: string
    urlDescription?: string
}): JSX.Element => {
    const { type, spaces, text, url, urlImage, urlDomain, urlTitle, urlDescription } = props
    const { accountData } = useContext(AccountContext)

    const [textOverflow, setTextOverflow] = useState(false)
    const [showFullText, setShowFullText] = useState(false)

    const showLinkPreview = urlImage || urlDomain || urlTitle || urlDescription

    const textRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const { current } = textRef
        if (current && current.scrollHeight > 200) {
            setTextOverflow(true)
        } else {
            setTextOverflow(false)
        }
    }, [text])

    return (
        <div className={styles.post}>
            <div className={styles.body}>
                <div className={styles.tags}>
                    <div className={styles.creator}>
                        <SmallFlagImage
                            type='user'
                            size={35}
                            imagePath={accountData.flagImagePath}
                        />
                        <span className='ml-10 mr-5'>{accountData.name}</span>
                    </div>
                    <span className={styles.subText}>to</span>
                    <div className={styles.postSpaces}>
                        {spaces.length > 0 ? (
                            spaces.map((space) => (
                                <div style={{ marginRight: 10 }} key={space}>
                                    {space}
                                </div>
                            ))
                        ) : (
                            <div style={{ marginRight: 10 }}>all</div>
                        )}
                    </div>
                    <span className={styles.subText}>•</span>
                    <div className={styles.link}>
                        <img className={styles.linkIcon} src='/icons/link-solid.svg' alt='' />
                        <span className={styles.subText}>now</span>
                    </div>
                </div>
                <div className={styles.content}>
                    <div
                        className={`${styles.text} ${showFullText ? styles.showFullText : ''}`}
                        ref={textRef}
                    >
                        <ReactMarkdown plugins={[gfm]}>
                            {text.length > 0 ? text : '*text...*'}
                        </ReactMarkdown>
                    </div>
                    {textOverflow && (
                        <div
                            className={styles.showMore}
                            role='button'
                            tabIndex={0}
                            onClick={() => setShowFullText(!showFullText)}
                            onKeyDown={() => setShowFullText(!showFullText)}
                        >
                            {showFullText ? 'show less' : 'show more'}
                        </div>
                    )}
                    {showLinkPreview && (
                        <PostCardUrlPreview
                            url={url}
                            urlImage={urlImage}
                            urlDomain={urlDomain}
                            urlTitle={urlTitle}
                            urlDescription={urlDescription}
                        />
                    )}
                    <div className={styles.interact}>
                        <div className={styles.interactItem}>
                            <img className={styles.icon} src='/icons/fire-alt-solid.svg' alt='' />
                            <span className='greyText'>0 Reactions</span>
                        </div>
                        <div className={styles.interactItem}>
                            <img className={styles.icon} src='/icons/comment-solid.svg' alt='' />
                            <span className='greyText'>0 Comments</span>
                        </div>
                        {type === 'glass-bead' && (
                            <div className={styles.interactItem}>
                                <img
                                    className={styles.icon}
                                    src='/icons/arrow-alt-circle-right-solid.svg'
                                    alt=''
                                />
                                <span className='greyText'>Add turn</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

PostCardPreview.defaultProps = {
    url: null,
    urlImage: null,
    urlDomain: null,
    urlTitle: null,
    urlDescription: null,
}

export default PostCardPreview
