import React, { useContext, useEffect } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/SpacePageAbout.module.scss'
import { timeSinceCreated, dateCreated } from '@src/Functions'
import Markdown from '@components/Markdown'
import ImageTitle from '@components/ImageTitle'
import Column from '@components/Column'
import Row from '@components/Row'

const SpacePageAbout = ({ match }: { match: { params: { spaceHandle: string } } }): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const { accountDataLoading } = useContext(AccountContext)
    const { spaceData, getSpaceData, setSelectedSpaceSubPage } = useContext(SpaceContext)
    const { handle, description, createdAt, Creator } = spaceData

    useEffect(() => {
        setSelectedSpaceSubPage('about')
        if (!accountDataLoading && spaceHandle !== handle) {
            getSpaceData(spaceHandle, false)
        }
    }, [accountDataLoading, spaceHandle])

    return (
        <Column className={styles.wrapper}>
            <Column className={styles.content}>
                <Row centerY style={{ marginBottom: 30 }}>
                    <p>
                        Created{' '}
                        <span title={dateCreated(createdAt)}>{timeSinceCreated(createdAt)}</span> by
                    </p>
                    <ImageTitle
                        type='user'
                        imagePath={Creator.flagImagePath}
                        imageSize={32}
                        title={Creator.name}
                        fontSize={16}
                        link={`/u/${Creator.handle}`}
                        style={{ marginLeft: 10 }}
                        shadow
                    />
                </Row>
                <Markdown text={description} />
            </Column>
        </Column>
    )
}

export default SpacePageAbout
