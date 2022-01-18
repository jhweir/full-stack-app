import React, { useContext, useEffect } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/SpacePageAbout.module.scss'
import Column from '@components/Column'
import Row from '@components/Row'

const SpacePageCalendar = ({
    match,
}: {
    match: { params: { spaceHandle: string } }
}): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const { accountDataLoading } = useContext(AccountContext)
    const { spaceData, getSpaceData, setSelectedSpaceSubPage } = useContext(SpaceContext)
    const { handle } = spaceData

    useEffect(() => {
        setSelectedSpaceSubPage('calendar')
        if (!accountDataLoading && spaceHandle !== handle) {
            getSpaceData(spaceHandle, false)
        }
    }, [accountDataLoading, spaceHandle])

    return (
        <Column className={styles.wrapper}>
            <Column className={styles.content}>
                <h2>Still to be developed...</h2>
                <p>
                    This section will display a general purpose calendar with search and filter
                    functionality that pulls in all games and events included in the space and
                    contained child-spaces.
                </p>
                <br />
                <p>Estimate start date: February 2022</p>
            </Column>
        </Column>
    )
}

export default SpacePageCalendar
