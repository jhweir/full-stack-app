import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ShowMoreLess from '@components/ShowMoreLess'
import Markdown from '@components/Markdown'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/HolonPageAbout.module.scss'
import { timeSinceCreated, dateCreated } from '@src/Functions'

const HolonPageAbout = ({ match }: { match: { params: { spaceHandle: string } } }): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const { accountDataLoading } = useContext(AccountContext)
    const { spaceData, getSpaceData, setSelectedSpaceSubPage } = useContext(SpaceContext)

    useEffect(() => {
        setSelectedSpaceSubPage('about')
        if (!accountDataLoading && spaceHandle !== spaceData.handle) {
            getSpaceData(spaceHandle, false)
        }
    }, [accountDataLoading, spaceHandle])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>About</div>
            <div className={styles.content}>
                <div className={styles.name}>{spaceData.name}</div>
                <div className={styles.handle}>s/{spaceData.handle}</div>
                <div className={styles.created}>
                    <div className={`${styles.text} mr-10`}>
                        Created
                        <span className={styles.subText} title={dateCreated(spaceData.createdAt)}>
                            {timeSinceCreated(spaceData.createdAt)}
                        </span>
                        by
                    </div>
                    {spaceData.Creator && (
                        <Link to={`/u/${spaceData.Creator.handle}`} className={styles.creator}>
                            {spaceData.Creator.flagImagePath ? (
                                <img
                                    className={styles.creatorImage}
                                    src={spaceData.Creator.flagImagePath}
                                    alt=''
                                />
                            ) : (
                                <div className={styles.placeholderWrapper}>
                                    <img
                                        className={styles.placeholder}
                                        src='/icons/user-solid.svg'
                                        alt=''
                                    />
                                </div>
                            )}
                            <span className={styles.text}>
                                {spaceData.Creator && spaceData.Creator.name}
                            </span>
                        </Link>
                    )}
                </div>
                <ShowMoreLess height={250}>
                    <Markdown text={spaceData.description || ''} />
                </ShowMoreLess>
            </div>
        </div>
    )
}

export default HolonPageAbout
