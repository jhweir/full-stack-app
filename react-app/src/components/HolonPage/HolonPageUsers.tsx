import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { SpaceContext } from '../../contexts/SpaceContext'
import styles from '../../styles/components/HolonPageUsers.module.scss'
import SearchBar from '../SearchBar'
import HolonPageUsersFilters from './HolonPageUsersFilters'
import UserCard from '../Cards/UserCard'

const HolonPageUsers = (): JSX.Element => {
    const { pageBottomReached } = useContext(AccountContext)
    const {
        spaceContextLoading,
        spaceData,
        spaceUsers,
        getSpaceUsers,
        getNextSpaceUsers,
        setSpaceUsersFiltersOpen,
        spaceUsersFiltersOpen,
        spaceUsersSearchFilter,
        spaceUsersTimeRangeFilter,
        spaceUsersSortByFilter,
        spaceUsersSortOrderFilter,
        setSelectedSpaceSubPage,
        spaceUsersPaginationOffset,
        setSpaceUsersSearchFilter,
        // fullScreen,
        // setFullScreen,
    } = useContext(SpaceContext)

    useEffect(() => {
        setSelectedSpaceSubPage('users')
    }, [])

    useEffect(() => {
        if (!spaceContextLoading && spaceData) {
            getSpaceUsers()
        }
    }, [
        spaceContextLoading,
        spaceUsersSearchFilter,
        spaceUsersTimeRangeFilter,
        spaceUsersSortByFilter,
        spaceUsersSortOrderFilter,
    ])

    useEffect(() => {
        if (pageBottomReached && !spaceContextLoading && spaceData.id) {
            getNextSpaceUsers()
        }
    }, [pageBottomReached])

    return (
        <div className={styles.usersWrapper}>
            <div className='wecoPageHeader'>
                <div className={styles.headerRow}>
                    <div className={styles.headerRowSection}>
                        <SearchBar
                            setSearchFilter={setSpaceUsersSearchFilter}
                            placeholder='Search users...'
                        />
                        <div
                            className={styles.filterButton}
                            role='button'
                            tabIndex={0}
                            onClick={() => setSpaceUsersFiltersOpen(!spaceUsersFiltersOpen)}
                            onKeyDown={() => setSpaceUsersFiltersOpen(!spaceUsersFiltersOpen)}
                        >
                            <img
                                className={styles.filterButtonIcon}
                                src='/icons/sliders-h-solid.svg'
                                aria-label='filters'
                            />
                        </div>
                    </div>
                    {/* <div className={styles.headerRowSection}></div> */}
                </div>
                {spaceUsersFiltersOpen && <HolonPageUsersFilters />}
            </div>
            {/* <HolonPageSpacesPlaceholder/> */}
            {spaceUsers.length > 0 && (
                <ul className={styles.users}>
                    {spaceUsers.map((user, index) => (
                        <UserCard index={index} user={user} />
                    ))}
                </ul>
            )}
            {spaceUsersPaginationOffset > 0 && spaceUsers.length < 1 && (
                <div className='wecoNoContentPlaceholder'>
                    No users yet that match those settings...
                </div>
            )}
        </div>
    )
}

export default HolonPageUsers
