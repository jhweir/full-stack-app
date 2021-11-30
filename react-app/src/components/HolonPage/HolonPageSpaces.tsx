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
import { statTitle, onPageBottomReached, pluralise } from '@src/Functions'
import HolonPageSpacesFilters from '@components/HolonPage/HolonPageSpacesFilters'
import HolonPageSpacesPlaceholder from '@components/HolonPage/HolonPageSpacesPlaceholder'
import HolonSpaceMap from '@components/HolonPage/HolonSpaceMap'
import CreateSpaceModal from '@components/Modals/CreateSpaceModal'
import Row from '@components/Row'
import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'
import StatButton from '@components/StatButton'

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
                            style={{ marginRight: 10 }}
                            onClick={() => setSpaceSpacesFiltersOpen(!spaceSpacesFiltersOpen)}
                        />
                        <Button
                            text='New space'
                            colour='grey'
                            style={{ marginRight: 10 }}
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
                                spaceSpaces.map((space) => (
                                    <VerticalCard
                                        key={space.id}
                                        type='space'
                                        route={`/s/${space.handle}/spaces`}
                                        coverImagePath={space.coverImagePath}
                                        flagImagePath={space.flagImagePath}
                                        title={space.name}
                                        subTitle={`s/${space.handle}`}
                                        text={space.description}
                                        footer={
                                            <div className={styles.stats}>
                                                <StatButton
                                                    icon={<UsersIconSVG />}
                                                    text={space.totalFollowers}
                                                    title={statTitle(
                                                        'Follower',
                                                        space.totalFollowers
                                                    )}
                                                />
                                                <StatButton
                                                    icon={<PostIconSVG />}
                                                    text={space.totalPosts}
                                                    title={statTitle('Post', space.totalPosts)}
                                                />
                                                <StatButton
                                                    icon={<CommentIconSVG />}
                                                    text={space.totalComments}
                                                    title={statTitle(
                                                        'Comment',
                                                        space.totalComments
                                                    )}
                                                />
                                                <StatButton
                                                    icon={<ReactionIconSVG />}
                                                    text={space.totalReactions}
                                                    title={statTitle(
                                                        'Reaction',
                                                        space.totalReactions
                                                    )}
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
