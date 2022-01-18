import React, { useContext, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { OverlayScrollbarsComponent as OverlayScrollbars } from 'overlayscrollbars-react'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/SpacePageSpaces.module.scss'
import HorizontalSpaceCard from '@components/Cards/HorizontalSpaceCard'
import SearchBar from '@components/SearchBar'
import Button from '@components/Button'
import Column from '@components/Column'
import Row from '@components/Row'
// import Toggle from '@components/Toggle'
import { onPageBottomReached } from '@src/Functions'
import SpacePageSpacesFilters from '@components/SpacePage/SpacePageSpacesFilters'
import SpacePageSpacesPlaceholder from '@components/SpacePage/SpacePageSpacesPlaceholder'
import SpacePageSpaceMap from '@components/SpacePage/SpacePageSpaceMap'
import CreateSpaceModal from '@components/Modals/CreateSpaceModal'
// import { ReactComponent as SlidersIconSVG } from '@svgs/sliders-h-solid.svg'

const SpacePageSpaces = ({
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
        // spaceSpacesFiltersOpen,
        // setSpaceSpacesFiltersOpen,
        setSelectedSpaceSubPage,
        spaceSpacesPaginationOffset,
        spaceSpacesPaginationHasMore,
        spaceSpacesPaginationLimit,
    } = useContext(SpaceContext)
    const { view } = spaceSpacesFilters

    const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false)

    const OSRef = useRef<OverlayScrollbars>(null)
    const OSOptions = {
        className: 'os-theme-none',
        callbacks: {
            onScroll: () => {
                // load next spaces when scroll bottom reached
                const instance = OSRef!.current!.osInstance()
                const scrollInfo = instance!.scroll()
                if (scrollInfo.ratio.y > 0.999 && spaceSpacesPaginationHasMore) {
                    getSpaceSpaces(
                        spaceData.id,
                        spaceSpacesPaginationOffset,
                        spaceSpacesPaginationLimit
                    )
                }
            },
        },
    }

    function openCreateSpaceModal() {
        if (loggedIn) setCreateSpaceModalOpen(true)
        else {
            setAlertModalOpen(true)
            setAlertMessage('Log in to create a space')
        }
    }

    // function toggleView() {
    //     updateSpaceSpacesFilter('view', view === 'List' ? 'Map' : 'List')
    // }

    // todo: use url instead of variable in store?
    useEffect(() => setSelectedSpaceSubPage('spaces'), [])

    useEffect(() => () => resetSpaceSpaces(), [])

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

    return (
        <Column className={styles.wrapper}>
            <Row centerY className={styles.header}>
                <Button
                    text='New space'
                    color='blue'
                    onClick={openCreateSpaceModal}
                    style={{ marginRight: 10 }}
                />
                {createSpaceModalOpen && (
                    <CreateSpaceModal close={() => setCreateSpaceModalOpen(false)} />
                )}
                <SearchBar
                    setSearchFilter={(payload) => updateSpaceSpacesFilter('searchQuery', payload)}
                    placeholder='Search spaces...'
                    style={{ marginRight: 10 }}
                />
                <SpacePageSpacesFilters />
            </Row>
            <Row className={styles.content}>
                <OverlayScrollbars
                    className={`${styles.spaces} os-host-flexbox scrollbar-theme`}
                    options={OSOptions}
                    ref={OSRef}
                >
                    {accountDataLoading || spaceDataLoading || spaceSpacesLoading ? (
                        <SpacePageSpacesPlaceholder />
                    ) : (
                        <>
                            {spaceSpaces.length ? (
                                spaceSpaces.map((space) => (
                                    <HorizontalSpaceCard
                                        key={space.id}
                                        space={space}
                                        style={{ marginBottom: 15 }}
                                    />
                                ))
                            ) : (
                                <div className='wecoNoContentPlaceholder'>
                                    No spaces yet that match those settings...
                                </div>
                            )}
                        </>
                    )}
                </OverlayScrollbars>
                <Column className={styles.spaceMap}>
                    <SpacePageSpaceMap />
                </Column>
            </Row>
            {/* {view === 'List' && spaceSpacesPaginationOffset > 0 && spaceSpaces.length < 1 && (
                <div className='wecoNoContentPlaceholder'>
                    No spaces yet that match those settings...
                </div>
            )}
            {view === 'Map' && <SpacePageSpaceMap />} */}
        </Column>
    )
}

export default SpacePageSpaces

/* <Button
    icon={<SlidersIconSVG />}
    color='grey'
    style={{ marginRight: 10 }}
    onClick={() => setSpaceSpacesFiltersOpen(!spaceSpacesFiltersOpen)}
/> */

/* <div className={styles.headerRowSection}>
        <Toggle
            leftText='List'
            rightText='Map'
            onClickFunction={toggleView}
            positionLeft={view === 'List'}
        />
    </div>
    </div>
    {spaceSpacesFiltersOpen && <SpacePageSpacesFilters />}
</div> */

/* <OverlayScrollbars
    className={`${styles.spaces} os-host-flexbox scrollbar-theme`}
    options={OSOptions}
    ref={OSRef}
>
    {accountDataLoading || spaceDataLoading || spaceSpacesLoading ? (
        <SpacePageSpacesPlaceholder />
    ) : (
        <>
            {spaceSpaces.length ? (
                spaceSpaces.map((space) => (
                    <HorizontalSpaceCard
                        key={space.id}
                        space={space}
                        style={{ marginBottom: 15 }}
                    />
                ))
            ) : (
                <div className='wecoNoContentPlaceholder'>
                    No spaces yet that match those settings...
                </div>
            )}
        </>
    )}
</OverlayScrollbars> */

// {accountDataLoading || spaceDataLoading || spaceSpacesLoading ? (
//     <SpacePageSpacesPlaceholder />
// ) : (
//     <>
//         {spaceSpaces.length ? (
//             <OverlayScrollbars
//                 className={`${styles.spaces} os-host-flexbox scrollbar-theme`}
//                 options={OSOptions}
//                 ref={OSRef}
//             >
//                 {spaceSpaces.map((space) => (
//                     <HorizontalSpaceCard
//                         key={space.id}
//                         space={space}
//                         style={{ marginBottom: 15 }}
//                     />
//                 ))}
//             </OverlayScrollbars>
//         ) : (
//             <div className='wecoNoContentPlaceholder'>
//                 No spaces yet that match those settings...
//             </div>
//         )}
//     </>
// )}
