import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactComponent as PostIconSVG } from '@svgs/edit-solid.svg'
import { ReactComponent as CommentIconSVG } from '@svgs/comment-solid.svg'
import styles from '@styles/components/HolonPageUsers.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import SearchBar from '@components/SearchBar'
import Stat from '@components/Stat'
import Button from '@components/Button'
import VerticalCard from '@components/Cards/VerticalCard'
import HolonPageUsersFilters from '@components/HolonPage/HolonPageUsersFilters'
import HolonPageSpacesPlaceholder from '@components/HolonPage/HolonPageSpacesPlaceholder'
import { isPlural, onPageBottomReached } from '@src/Functions'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const HolonPageUsers = ({ match }: { match: { params: { spaceHandle: string } } }): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const { accountDataLoading } = useContext(AccountContext)
    const {
        spaceData,
        getSpaceData,
        spaceUsers,
        getSpaceUsers,
        spaceUsersFilters,
        spaceUsersFiltersOpen,
        setSpaceUsersFiltersOpen,
        setSelectedSpaceSubPage,
        spaceUsersPaginationOffset,
        spaceUsersPaginationLimit,
        spaceDataLoading,
        spaceUsersLoading,
        resetSpaceUsers,
        spaceUsersPaginationHasMore,
        // fullScreen,
        // setFullScreen,
    } = useContext(SpaceContext)

    const [pageBottomReached, setPageBottomReached] = useState(false)

    // set selected sub page, add scroll listener
    useEffect(() => {
        setSelectedSpaceSubPage('users')
        const scrollHandler = () => onPageBottomReached(setPageBottomReached)
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    const location = useLocation()
    const getFirstUsers = (spaceId) => getSpaceUsers(spaceId, 0, spaceUsersPaginationLimit)
    useEffect(() => {
        if (!accountDataLoading) {
            if (spaceHandle !== spaceData.handle) {
                getSpaceData(spaceHandle, getFirstUsers)
            } else {
                getFirstUsers(spaceData.id)
            }
        }
    }, [accountDataLoading, location, spaceUsersFilters])

    useEffect(() => {
        if (pageBottomReached && spaceUsersPaginationHasMore) {
            getSpaceUsers(spaceData.id, spaceUsersPaginationOffset, spaceUsersPaginationLimit)
        }
    }, [pageBottomReached])

    useEffect(() => () => resetSpaceUsers(), [])

    // useEffect(() => {
    //     if (spaceData.id) getSpaceUsers()
    // }, [spaceData.id, spaceUsersFilters])

    // useEffect(() => {
    //     if (pageBottomReached && spaceData.id) {
    //         // getNextSpaceUsers()
    //     }
    // }, [pageBottomReached])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div>
                        <SearchBar
                            setSearchFilter={spaceUsersFilters.searchQuery}
                            placeholder='Search users...'
                        />
                        <Button
                            icon={<SlidersIconSVG />}
                            colour='grey'
                            size='medium'
                            onClick={() => setSpaceUsersFiltersOpen(!spaceUsersFiltersOpen)}
                        />
                    </div>
                </div>
                {spaceUsersFiltersOpen && <HolonPageUsersFilters />}
            </div>
            {/* {view === 'List' ? ( */}
            <div className={styles.users}>
                {accountDataLoading || spaceDataLoading || spaceUsersLoading ? (
                    <HolonPageSpacesPlaceholder />
                ) : (
                    <>
                        {spaceUsers.length ? (
                            spaceUsers.map((user) => (
                                <VerticalCard
                                    key={user.id}
                                    type='user'
                                    route={`/u/${user.handle}`}
                                    coverImagePath={user.coverImagePath}
                                    flagImagePath={user.flagImagePath}
                                    title={user.name}
                                    subTitle={`u/${user.handle}`}
                                    text={user.bio}
                                    footer={
                                        <div className={styles.stats}>
                                            <Stat
                                                icon={<PostIconSVG />}
                                                value={user.total_posts}
                                                title={`Post${
                                                    isPlural(user.total_posts) ? 's' : ''
                                                }`}
                                            />
                                            <Stat
                                                icon={<CommentIconSVG />}
                                                value={user.total_comments}
                                                title={`Comment${
                                                    isPlural(user.total_comments) ? 's' : ''
                                                }`}
                                            />
                                        </div>
                                    }
                                />
                            ))
                        ) : (
                            <div className='wecoNoContentPlaceholder'>
                                No users yet that match those settings...
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* ) : (
                <HolonUserMap />
            )} */}
        </div>
    )
}

export default HolonPageUsers
