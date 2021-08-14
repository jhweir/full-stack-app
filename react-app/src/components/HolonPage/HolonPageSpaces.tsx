import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPageSpaces.module.scss'
// import HolonCard from '../Cards/HolonCard'
import VerticalCard from '../Cards/VerticalCard'
import SearchBar from '../SearchBar'
import Toggle from '../Toggle'
import HolonPageSpacesFilters from './HolonPageSpacesFilters'
// import HolonPageSpacesPlaceholder from './HolonPageSpacesPlaceholder'
import HolonSpaceMap from './HolonSpaceMap'
import Stat from '../Stat'
import { pluralise } from '../../Functions'

const HolonPageSpaces = (): JSX.Element => {
    const {
        setCreateHolonModalOpen,
        pageBottomReached,
        isLoggedIn,
        setAlertModalOpen,
        setAlertMessage,
    } = useContext(AccountContext)
    const {
        spaceContextLoading,
        spaceData,
        spaceSpaces,
        getSpaceSpaces,
        getNextSpaceSpaces,
        spaceSpacesFiltersOpen,
        setSpaceSpacesFiltersOpen,
        spaceSpacesSearchFilter,
        spaceSpacesTimeRangeFilter,
        spaceSpacesSortByFilter,
        spaceSpacesSortOrderFilter,
        spaceSpacesDepthFilter,
        setSelectedSpaceSubPage,
        spaceSpacesPaginationOffset,
        spaceSpacesView,
        setSpaceSpacesView,
        setSpaceSpacesSearchFilter,
        setSpaceHandle,
    } = useContext(SpaceContext)

    function openCreateSpaceModal() {
        if (!isLoggedIn) {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create a space')
        } else {
            setCreateHolonModalOpen(true)
        }
    }

    function toggleView() {
        if (spaceSpacesView === 'List') setSpaceSpacesView('Map')
        else setSpaceSpacesView('List')
    }

    useEffect(() => {
        setSelectedSpaceSubPage('spaces')
    }, [])

    useEffect(() => {
        if (!spaceContextLoading && spaceData && spaceData.id) {
            console.log('test')
            getSpaceSpaces()
        }
    }, [
        spaceContextLoading,
        spaceSpacesSearchFilter,
        spaceSpacesTimeRangeFilter,
        spaceSpacesSortByFilter,
        spaceSpacesSortOrderFilter,
        spaceSpacesDepthFilter,
    ])

    useEffect(() => {
        if (pageBottomReached && !spaceContextLoading && spaceData.id) {
            console.log('HolonPageSpaces: pageBottomReached')
            getNextSpaceSpaces()
        }
    }, [pageBottomReached])

    return (
        <div className={styles.wrapper}>
            <div className='wecoPageHeader'>
                <div className={styles.headerRow}>
                    <div className={styles.headerRowSection}>
                        <SearchBar
                            setSearchFilter={setSpaceSpacesSearchFilter}
                            placeholder='Search spaces...'
                        />
                        {/* <HolonPageSpacesFilters /> */}
                        <div
                            className={styles.filterButton}
                            role='button'
                            tabIndex={0}
                            onClick={() => setSpaceSpacesFiltersOpen(!spaceSpacesFiltersOpen)}
                            onKeyDown={() => setSpaceSpacesFiltersOpen(!spaceSpacesFiltersOpen)}
                        >
                            <img
                                className={styles.filterButtonIcon}
                                src='/icons/sliders-h-solid.svg'
                                aria-label='filters'
                            />
                        </div>
                        {/* <Toggle
                            leftText='List'
                            rightText='Map'
                            onClickFunction={toggleView}
                            positionLeft={spaceSpacesView === 'List'}
                        /> */}
                        <div
                            className={styles.filterButton}
                            role='button'
                            tabIndex={0}
                            onClick={() => openCreateSpaceModal()}
                            onKeyDown={() => openCreateSpaceModal()}
                        >
                            New Space
                        </div>
                    </div>
                    <div className={styles.headerRowSection}>
                        <Toggle
                            leftText='List'
                            rightText='Map'
                            onClickFunction={toggleView}
                            positionLeft={spaceSpacesView === 'List'}
                        />
                    </div>
                </div>
                {spaceSpacesFiltersOpen && <HolonPageSpacesFilters />}
            </div>
            {/* <HolonPageSpacesPlaceholder/> */}
            {spaceSpacesView === 'List' && spaceSpaces.length > 0 && (
                <ul className={`${styles.spaces} ${spaceContextLoading && styles.hidden}`}>
                    {spaceSpaces.map((holon) => (
                        <VerticalCard
                            key={holon.id}
                            path={`/s/${holon.handle}`}
                            onClick={() => setSpaceHandle(holon.handle)}
                            coverImagePath={holon.coverImagePath}
                            flagImagePath={holon.flagImagePath}
                            title={holon.name}
                            subTitle={`s/${holon.handle}`}
                            text={holon.description}
                            footer={
                                <div className={styles.stats}>
                                    <Stat
                                        type='user'
                                        value={holon.total_followers}
                                        title={`Follower${pluralise(holon.total_followers)}`}
                                        small
                                    />
                                    <Stat
                                        type='post'
                                        value={holon.total_posts}
                                        title={`Post${pluralise(holon.total_posts)}`}
                                        small
                                    />
                                    <Stat
                                        type='comment'
                                        value={holon.total_comments}
                                        title={`Comment${pluralise(holon.total_comments)}`}
                                        small
                                    />
                                    <Stat
                                        type='reaction'
                                        value={holon.total_reactions}
                                        title={`Reaction${pluralise(holon.total_reactions)}`}
                                        small
                                    />
                                </div>
                            }
                        />
                    ))}
                </ul>
            )}
            {spaceSpacesView === 'List' &&
                spaceSpacesPaginationOffset > 0 &&
                spaceSpaces.length < 1 && (
                    <div className='wecoNoContentPlaceholder'>
                        No spaces yet that match those settings...
                    </div>
                )}
            {spaceSpacesView === 'Map' && <HolonSpaceMap />}
        </div>
    )
}

export default HolonPageSpaces
