import React, { useContext } from 'react'
import styles from '../../../styles/components/PostCardLinkPreview.module.scss'
import FlagImage from '@components/FlagImage'
import { AccountContext } from '../../../contexts/AccountContext'

const PostCardLinkPreview = (props: { links: any }): JSX.Element => {
    const { links } = props
    const { accountData } = useContext(AccountContext)

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.pointerWrapper}>
                    <div className={styles.pointer} />
                </div>
                {links.incomingLinks.length > 0 && (
                    <div className={styles.links}>
                        <span className={styles.subTitle}>Incoming:</span>
                        {links.incomingLinks.map((link) => (
                            <div className={styles.link} key={link}>
                                <div className={styles.imageTextLink}>
                                    <FlagImage
                                        type='user'
                                        size={25}
                                        imagePath={link.creator.flagImagePath}
                                    />
                                    <span>
                                        {accountData.id === link.creator.id
                                            ? 'You'
                                            : link.creator.name}
                                    </span>
                                </div>
                                <div className={`${styles.text} greyText mr-5`}>linked from</div>
                                <div className={styles.imageTextLink}>
                                    <FlagImage
                                        type='user'
                                        size={25}
                                        imagePath={link.postA.creator.flagImagePath}
                                    />
                                    <span>
                                        {accountData.id === link.postA.creatorId
                                            ? 'Your'
                                            : `${link.postA.creator.name}'s`}
                                    </span>
                                </div>
                                <div className={styles.imageTextLink}>
                                    <span className='greyText m-0'>post</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {links.outgoingLinks.length > 0 && (
                    <div className={styles.links}>
                        <span className={styles.subTitle}>Outgoing:</span>
                        {links.outgoingLinks.map((link) => (
                            <div className={styles.link} key={link}>
                                <div className={styles.imageTextLink}>
                                    <FlagImage
                                        type='user'
                                        size={30}
                                        imagePath={link.creator.flagImagePath}
                                    />
                                    <span>
                                        {accountData.id === link.creator.id
                                            ? 'You'
                                            : link.creator.name}
                                    </span>
                                </div>
                                <div className={`${styles.text} greyText mr-5`}>linked to</div>
                                <div className={styles.imageTextLink}>
                                    <FlagImage
                                        type='user'
                                        size={25}
                                        imagePath={link.postB.creator.flagImagePath}
                                    />
                                    <span>
                                        {accountData.id === link.postB.creatorId
                                            ? 'Your'
                                            : `${link.postB.creator.name}'s`}
                                    </span>
                                </div>
                                <div className={styles.imageTextLink}>
                                    <span className='greyText m-0'>post</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCardLinkPreview
