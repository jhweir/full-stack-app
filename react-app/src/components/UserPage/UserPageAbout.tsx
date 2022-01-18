import React, { useContext, useEffect } from 'react'
import { UserContext } from '@contexts/UserContext'
import styles from '@styles/components/UserPageAbout.module.scss'
import { timeSinceCreated, dateCreated } from '@src/Functions'
import Column from '@components/Column'
import Row from '@components/Row'
import Markdown from '@components/Markdown'

const UserPageAbout = (): JSX.Element => {
    const { userData, setSelectedUserSubPage } = useContext(UserContext)
    const { createdAt, bio } = userData

    useEffect(() => {
        setSelectedUserSubPage('about')
    }, [])

    return (
        <Column className={styles.wrapper}>
            <Column className={styles.content}>
                <Row centerY style={{ marginBottom: 30 }}>
                    <p>
                        Joined{' '}
                        <span title={dateCreated(createdAt)}>{timeSinceCreated(createdAt)}</span>
                    </p>
                </Row>
                <Markdown text={bio} />
            </Column>
        </Column>
    )
}

export default UserPageAbout
