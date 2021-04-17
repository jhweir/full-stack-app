import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPageSideBarRight.module.scss'
import HolonPageSideBarRightPlaceholder from './HolonPageSideBarRightPlaceholder'

const HolonPageSideBarRight = (): JSX.Element => {
    const { spaceData, setSpaceHandle, spaceContextLoading, selectedSpaceSubPage } = useContext(
        SpaceContext
    )

    return (
        <div className={styles.sideBarRight}>
            <HolonPageSideBarRightPlaceholder />
            {spaceData && (
                <div
                    className={`${styles.sideBarRightContent} ${
                        !spaceContextLoading && styles.visible
                    }`}
                >
                    {spaceData.DirectParentHolons && spaceData.DirectParentHolons.length !== 0 && (
                        <>
                            <span className={styles.sideBarRightText}>Parent spaces:</span>
                            <ul className={styles.sideBarRightHolons}>
                                {spaceData.DirectParentHolons.map(
                                    (holon) =>
                                        holon && (
                                            <Link
                                                className={styles.sideBarRightHolon}
                                                to={`/s/${holon.handle}/${selectedSpaceSubPage}`}
                                                key={holon.handle}
                                                onClick={() => {
                                                    setSpaceHandle(holon.handle)
                                                }}
                                            >
                                                {holon.flagImagePath === null ? (
                                                    <div className={styles.placeholderWrapper}>
                                                        <img
                                                            className={styles.placeholder}
                                                            src='/icons/users-solid.svg'
                                                            aria-label='space placeholder'
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        className={styles.image}
                                                        src={holon.flagImagePath}
                                                        aria-label='space flag image'
                                                    />
                                                )}
                                                {holon.name}
                                            </Link>
                                        )
                                )}
                            </ul>
                        </>
                    )}
                    {spaceData.DirectChildHolons && spaceData.DirectChildHolons.length !== 0 && (
                        <>
                            <span className={styles.sideBarRightText}>Child spaces:</span>
                            <ul className={styles.sideBarRightHolons}>
                                {spaceData.DirectChildHolons.map(
                                    (holon) =>
                                        holon && (
                                            <Link
                                                className={styles.sideBarRightHolon}
                                                to={`/s/${holon.handle}/${selectedSpaceSubPage}`}
                                                key={holon.handle}
                                                onClick={() => {
                                                    setSpaceHandle(holon.handle)
                                                }}
                                            >
                                                {holon.flagImagePath === null ? (
                                                    <div className={styles.placeholderWrapper}>
                                                        <img
                                                            className={styles.placeholder}
                                                            src='/icons/users-solid.svg'
                                                            aria-label='space placeholder'
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        className={styles.image}
                                                        src={holon.flagImagePath}
                                                        aria-label='space flag image'
                                                    />
                                                )}
                                                {holon.name}
                                            </Link>
                                        )
                                )}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default HolonPageSideBarRight
