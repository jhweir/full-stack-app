import React, { useContext, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { OverlayScrollbarsComponent as OverlayScrollbars } from 'overlayscrollbars-react'
import { ReactComponent as PostIconSVG } from '@svgs/edit-solid.svg'
import { ReactComponent as CommentIconSVG } from '@svgs/comment-solid.svg'
import styles from '@styles/components/SpacePagePeople.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import SearchBar from '@components/SearchBar'
import Button from '@components/Button'
import VerticalCard from '@components/Cards/VerticalCard'
import VerticalUserCard from '@components/Cards/VerticalUserCard'
import SpacePagePeopleFilters from '@components/SpacePage/SpacePagePeopleFilters'
import SpacePageSpacesPlaceholder from '@components/SpacePage/SpacePageSpacesPlaceholder'
import Row from '@components/Row'
import { statTitle, onPageBottomReached } from '@src/Functions'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const SpacePagePeople = ({
    match,
}: {
    match: { params: { spaceHandle: string } }
}): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params
    const { accountDataLoading } = useContext(AccountContext)
    const {
        spaceData,
        getSpaceData,
        spacePeople,
        getSpacePeople,
        spacePeopleFilters,
        spacePeopleFiltersOpen,
        setSpacePeopleFiltersOpen,
        setSelectedSpaceSubPage,
        spacePeoplePaginationOffset,
        spacePeoplePaginationLimit,
        spaceDataLoading,
        spacePeopleLoading,
        resetSpacePeople,
        spacePeoplePaginationHasMore,
        updateSpacePeopleFilter,
        // fullScreen,
        // setFullScreen,
    } = useContext(SpaceContext)

    const OSRef = useRef<OverlayScrollbars>(null)
    const OSOptions = {
        className: 'os-theme-none',
        callbacks: {
            onScroll: () => {
                // load next spaces when scroll bottom reached
                const instance = OSRef!.current!.osInstance()
                const scrollInfo = instance!.scroll()
                console.log('scrollInfo.ratio.y: ', scrollInfo.ratio.y)
                if (scrollInfo.ratio.y > 0.99 && spacePeoplePaginationHasMore) {
                    getSpacePeople(
                        spaceData.id,
                        spacePeoplePaginationOffset,
                        spacePeoplePaginationLimit
                    )
                }
            },
        },
    }

    // set selected sub page, add scroll listener
    useEffect(() => setSelectedSpaceSubPage('people'), [])

    useEffect(() => () => resetSpacePeople(), [])

    const location = useLocation()
    const getFirstUsers = (spaceId) => getSpacePeople(spaceId, 0, spacePeoplePaginationLimit)
    useEffect(() => {
        if (!accountDataLoading) {
            if (spaceHandle !== spaceData.handle) {
                getSpaceData(spaceHandle, getFirstUsers)
            } else {
                getFirstUsers(spaceData.id)
            }
        }
    }, [accountDataLoading, location, spacePeopleFilters])

    return (
        <div className={styles.wrapper}>
            <Row centerY className={styles.header}>
                <SearchBar
                    setSearchFilter={(payload) => updateSpacePeopleFilter('searchQuery', payload)}
                    placeholder='Search people...'
                    style={{ marginRight: 10 }}
                />
                <SpacePagePeopleFilters />
            </Row>
            <Row className={styles.content}>
                <OverlayScrollbars
                    className={`${styles.people} os-host-flexbox scrollbar-theme row wrap`}
                    options={OSOptions}
                    ref={OSRef}
                >
                    {accountDataLoading || spaceDataLoading || spacePeopleLoading ? (
                        <SpacePageSpacesPlaceholder />
                    ) : (
                        <>
                            {spacePeople.length ? (
                                spacePeople.map((user) => (
                                    <VerticalUserCard
                                        user={user}
                                        style={{ margin: '0 20px 20px 0' }}
                                    />
                                    // <VerticalCard
                                    //     key={user.id}
                                    //     type='user'
                                    //     route={`/u/${user.handle}`}
                                    //     coverImagePath={user.coverImagePath}
                                    //     flagImagePath={user.flagImagePath}
                                    //     title={user.name}
                                    //     subTitle={`u/${user.handle}`}
                                    //     text={user.bio}
                                    //     footer={
                                    //         <div className={styles.stats}>
                                    //             <Row>
                                    //                 <PostIconSVG />
                                    //                 <p title={statTitle('Post', user.totalPosts)}>
                                    //                     {statTitle('Post', user.totalPosts)}
                                    //                 </p>
                                    //             </Row>
                                    //             <Row>
                                    //                 <CommentIconSVG />
                                    //                 <p
                                    //                     title={statTitle(
                                    //                         'Comment',
                                    //                         user.totalComments
                                    //                     )}
                                    //                 >
                                    //                     {statTitle('Comment', user.totalComments)}
                                    //                 </p>
                                    //             </Row>
                                    //         </div>
                                    //     }
                                    // />
                                ))
                            ) : (
                                <div className='wecoNoContentPlaceholder'>
                                    No users yet that match those settings...
                                </div>
                            )}
                        </>
                    )}
                </OverlayScrollbars>
            </Row>
        </div>
    )
}

export default SpacePagePeople

/* <div className={styles.header}>
    <div className={styles.headerRow}>
        <div>
            <SearchBar
                setSearchFilter={(payload) =>
                    updateSpacePeopleFilter('searchQuery', payload)
                }
                placeholder='Search users...'
            />
            <Button
                icon={<SlidersIconSVG />}
                color='grey'
                onClick={() => setSpacePeopleFiltersOpen(!spacePeopleFiltersOpen)}
            />
        </div>
    </div>
    {spacePeopleFiltersOpen && <SpacePagePeopleFilters />}
</div> */
