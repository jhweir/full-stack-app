import React, { useContext } from 'react'
import styles from '../../../styles/components/PostCardLinkPreview.module.scss'
import SmallFlagImage from '../../SmallFlagImage'
import { AccountContext } from '../../../contexts/AccountContext'

function PostCardLinkPreview(props) {
    const { links } = props
    const { accountData } = useContext(AccountContext)

    console.log('links: ', links)

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                <div className={styles.pointerWrapper}>
                    <div className={styles.pointer}/>
                </div>
                {links.incomingLinks.length > 0 &&
                    <div className={styles.links}>
                        <span className={styles.subTitle}>Incoming:</span>
                        {links.incomingLinks.map((link, index) =>
                            <div className={styles.link} key={index}>
                                <div className={styles.imageTextLink}>
                                    <SmallFlagImage type='user' size={25} imagePath={link.creator.flagImagePath}/>
                                    <span>{accountData.id === link.creator.id ? 'You' : link.creator.name}</span>
                                </div>
                                <div className={`${styles.text} greyText mr-5`}>
                                    linked from
                                </div>
                                <div className={styles.imageTextLink}>
                                    <SmallFlagImage type='user' size={25} imagePath={link.postA.creator.flagImagePath}/>
                                    <span >{accountData.id === link.postA.creatorId ? 'Your' : link.postA.creator.name + "'s"}</span>
                                </div>
                                <div className={styles.imageTextLink}>
                                    <span className={`greyText m-0`}>post</span>
                                </div>
                            </div>
                        )}
                    </div>
                }
                {links.outgoingLinks.length > 0 &&
                    <div className={styles.links}>
                        <span className={styles.subTitle}>Outgoing:</span>
                        {links.outgoingLinks.map((link, index) =>
                            <div className={styles.link} key={index}>
                                <div className={styles.imageTextLink}>
                                    <SmallFlagImage type='user' size={30} imagePath={link.creator.flagImagePath}/>
                                    <span >{accountData.id === link.creator.id ? 'You' : link.creator.name}</span>
                                </div>
                                <div className={`${styles.text} greyText mr-5`}>
                                    linked to
                                </div>
                                <div className={styles.imageTextLink}>
                                    <SmallFlagImage type='user' size={25} imagePath={link.postB.creator.flagImagePath}/>
                                    <span >{accountData.id === link.postB.creatorId ? 'Your' : link.postB.creator.name + "'s"}</span>
                                </div>
                                <div className={styles.imageTextLink}>
                                    <span className={`greyText m-0`}>post</span>
                                </div>
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default PostCardLinkPreview
