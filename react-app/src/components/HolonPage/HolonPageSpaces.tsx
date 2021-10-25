import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/HolonPageSpaces.module.scss'
// import HolonCard from '@components/Cards/HolonCard'
import { ReactComponent as UsersIconSVG } from '@svgs/users-solid.svg'
import { ReactComponent as PostIconSVG } from '@svgs/edit-solid.svg'
import { ReactComponent as CommentIconSVG } from '@svgs/comment-solid.svg'
import { ReactComponent as ReactionIconSVG } from '@svgs/fire-alt-solid.svg'
import VerticalCard from '@components/Cards/VerticalCard'
import SearchBar from '@components/SearchBar'
import Button from '@components/Button'
import Toggle from '@components/Toggle'
import Stat from '@components/Stat'
import { isPlural, onPageBottomReached } from '@src/Functions'
import HolonPageSpacesFilters from '@components/HolonPage/HolonPageSpacesFilters'
import HolonPageSpacesPlaceholder from '@components/HolonPage/HolonPageSpacesPlaceholder'
import HolonSpaceMap from '@components/HolonPage/HolonSpaceMap'
import CreateSpaceModal from '@components/Modals/CreateSpaceModal'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const HolonPageSpaces = ({
    match,
}: {
    match: { params: { spaceHandle: string } }
}): JSX.Element => {
    const { params } = match
    const { spaceHandle } = params

    const {
        accountDataLoading,
        // setCreateSpaceModalOpen,
        loggedIn,
        setAlertModalOpen,
        setAlertMessage,
    } = useContext(AccountContext)
    const {
        spaceData,
        getSpaceData,
        spaceDataLoading,
        spaceSpaces,
        getSpaceSpaces,
        resetSpaceSpaces,
        spaceSpacesLoading,
        spaceSpacesFilters,
        updateSpaceSpacesFilter,
        spaceSpacesFiltersOpen,
        setSpaceSpacesFiltersOpen,
        setSelectedSpaceSubPage,
        spaceSpacesPaginationOffset,
        spaceSpacesPaginationHasMore,
        spaceSpacesPaginationLimit,
    } = useContext(SpaceContext)
    const { view } = spaceSpacesFilters

    const [pageBottomReached, setPageBottomReached] = useState(false)
    const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false)

    function openCreateSpaceModal() {
        if (loggedIn) setCreateSpaceModalOpen(true)
        else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create a space')
        }
    }

    function toggleView() {
        updateSpaceSpacesFilter('view', view === 'List' ? 'Map' : 'List')
    }

    useEffect(() => {
        setSelectedSpaceSubPage('spaces')
        const scrollHandler = () => onPageBottomReached(setPageBottomReached)
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    const location = useLocation()
    const getFirstSpaces = (spaceId) => getSpaceSpaces(spaceId, 0, spaceSpacesPaginationLimit)
    useEffect(() => {
        if (!accountDataLoading) {
            if (spaceData.handle !== spaceHandle) {
                getSpaceData(spaceHandle, view === 'List' ? getFirstSpaces : null)
            } else if (view === 'List') {
                getFirstSpaces(spaceData.id)
            }
        }
    }, [accountDataLoading, location, spaceSpacesFilters])

    useEffect(() => {
        if (pageBottomReached && spaceSpacesPaginationHasMore && view === 'List') {
            getSpaceSpaces(spaceData.id, spaceSpacesPaginationOffset, spaceSpacesPaginationLimit)
        }
    }, [pageBottomReached])

    useEffect(() => () => resetSpaceSpaces(), [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div>
                        <SearchBar
                            setSearchFilter={(payload) =>
                                updateSpaceSpacesFilter('searchQuery', payload)
                            }
                            placeholder='Search spaces...'
                        />
                        {/* <SearchBar
                            inputText={searchQuery}
                            setInputText={(payload) =>
                                updateSpaceSpacesFilter('searchQuery', payload)
                            }
                            placeholder='Search spaces...'
                        /> */}
                        <Button
                            icon={<SlidersIconSVG />}
                            colour='grey'
                            size='medium'
                            margin='0 10px 0 0'
                            onClick={() => setSpaceSpacesFiltersOpen(!spaceSpacesFiltersOpen)}
                        />
                        <Button
                            text='New space'
                            colour='grey'
                            size='medium'
                            margin='0 10px 0 0'
                            onClick={() => openCreateSpaceModal()}
                        />
                        {createSpaceModalOpen && (
                            <CreateSpaceModal close={() => setCreateSpaceModalOpen(false)} />
                        )}
                    </div>
                    <div className={styles.headerRowSection}>
                        <Toggle
                            leftText='List'
                            rightText='Map'
                            onClickFunction={toggleView}
                            positionLeft={view === 'List'}
                        />
                    </div>
                </div>
                {spaceSpacesFiltersOpen && <HolonPageSpacesFilters />}
            </div>
            {view === 'List' ? (
                <ul className={styles.spaces}>
                    {accountDataLoading || spaceDataLoading || spaceSpacesLoading ? (
                        <HolonPageSpacesPlaceholder />
                    ) : (
                        <>
                            {spaceSpaces.length ? (
                                spaceSpaces.map((holon) => (
                                    <VerticalCard
                                        key={holon.id}
                                        type='space'
                                        route={`/s/${holon.handle}/spaces`}
                                        coverImagePath={holon.coverImagePath}
                                        flagImagePath={holon.flagImagePath}
                                        title={holon.name}
                                        subTitle={`s/${holon.handle}`}
                                        text={holon.description}
                                        footer={
                                            <div className={styles.stats}>
                                                <Stat
                                                    icon={<UsersIconSVG />}
                                                    value={holon.total_followers}
                                                    title={`Follower${
                                                        isPlural(holon.total_followers) ? 's' : ''
                                                    }`}
                                                    small
                                                />
                                                <Stat
                                                    icon={<PostIconSVG />}
                                                    value={holon.total_posts}
                                                    title={`Post${
                                                        isPlural(holon.total_posts) ? 's' : ''
                                                    }`}
                                                    small
                                                />
                                                <Stat
                                                    icon={<CommentIconSVG />}
                                                    value={holon.total_comments}
                                                    title={`Comment${
                                                        isPlural(holon.total_comments) ? 's' : ''
                                                    }`}
                                                    small
                                                />
                                                <Stat
                                                    icon={<ReactionIconSVG />}
                                                    value={holon.total_reactions}
                                                    title={`Reaction${
                                                        isPlural(holon.total_reactions) ? 's' : ''
                                                    }`}
                                                    small
                                                />
                                            </div>
                                        }
                                    />
                                ))
                            ) : (
                                <div className='wecoNoContentPlaceholder'>
                                    No spaces yet that match those settings...
                                </div>
                            )}
                        </>
                    )}
                </ul>
            ) : (
                <HolonSpaceMap />
            )}
            {/* {view === 'List' && spaceSpacesPaginationOffset > 0 && spaceSpaces.length < 1 && (
                <div className='wecoNoContentPlaceholder'>
                    No spaces yet that match those settings...
                </div>
            )}
            {view === 'Map' && <HolonSpaceMap />} */}
        </div>
    )
}

export default HolonPageSpaces
