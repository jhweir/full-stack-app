import React, { useState, useContext, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/PostCard.module.scss'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import PostCardUrlPreview from './PostCardUrlPreview'
import SmallFlagImage from '../../SmallFlagImage'

const PostCardPreview = (props: {
    type: string
    spaces: any[]
    text: string
    url: string | null
    urlImage: string | null
    urlDomain: string | null
    urlTitle: string | null
    urlDescription: string | null
}): JSX.Element => {
    const { type, spaces, text, url, urlImage, urlDomain, urlTitle, urlDescription } = props
    const { accountData } = useContext(AccountContext)

    const postRef = useRef<HTMLDivElement>(null)

    const showLinkPreview = urlImage || urlDomain || urlTitle || urlDescription

    return (
        <div className={styles.post} ref={postRef}>
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
                    <div
                        className={`${styles.postType} ${
                            type && styles[type.toLowerCase().replace(/\s+/g, '-')]
                        }`}
                    >
                        {type && type.toLowerCase().replace(/\s+/g, '-')}
                    </div>
                </div>
                <div className={styles.content}>
                    {text && (
                        <div className={styles.text}>
                            <ShowMoreLess height={150}>
                                <Markdown text={text} />
                            </ShowMoreLess>
                        </div>
                    )}
                    {showLinkPreview && (
                        <PostCardUrlPreview
                            url={url || null}
                            urlImage={urlImage || null}
                            urlDomain={urlDomain || null}
                            urlTitle={urlTitle || null}
                            urlDescription={urlDescription || null}
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

// PostCardPreview.defaultProps = {
//     text: null,
//     url: null,
//     urlImage: null,
//     urlDomain: null,
//     urlTitle: null,
//     urlDescription: null,
// }

export default PostCardPreview
