import React, { useContext, useEffect } from 'react'
import { AccountContext } from '../../contexts/AccountContext'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageUsers.module.scss'
import SearchBar from '../SearchBar'
import HolonPageUsersFilters from './HolonPageUsersFilters'
import UserCard from '../Cards/UserCard'

function HolonPageUsers() {
    const { pageBottomReached } = useContext(AccountContext)
    const {
        holonContextLoading, holonData,
        holonUsers, getHolonUsers, getNextHolonUsers,
        setHolonUserFiltersOpen, holonUserFiltersOpen, 
        holonUserSearchFilter,
        holonUserTimeRangeFilter,
        holonUserSortByFilter,
        holonUserSortOrderFilter,
        setSelectedHolonSubPage, holonUserPaginationOffset,
        setHolonUserSearchFilter
    } = useContext(HolonContext)

    useEffect(() => {
        setSelectedHolonSubPage('users')
    }, [])

    useEffect(() => {
        if (!holonContextLoading && holonData) { getHolonUsers() }
    }, [holonContextLoading, holonUserSearchFilter, holonUserTimeRangeFilter, holonUserSortByFilter, holonUserSortOrderFilter])

    useEffect(() => {
        if (pageBottomReached && !holonContextLoading && holonData.id) { getNextHolonUsers() }
    }, [pageBottomReached])

    return (
        <div className={styles.usersWrapper}>
            <div className='wecoPageHeader'>
                <div className='wecoPageHeaderRow'>
                    <SearchBar setSearchFilter={setHolonUserSearchFilter} placeholder='Search users...'/>
                    <button className='wecoButton mr-10' onClick={() => setHolonUserFiltersOpen(!holonUserFiltersOpen)}>
                        <img className='wecoButtonIcon' src='/icons/sliders-h-solid.svg'/>
                    </button>
                </div>
                {holonUserFiltersOpen && <HolonPageUsersFilters/>}
            </div>
            {/* <HolonPageSpacesPlaceholder/> */}
            {holonUsers.length > 0 &&
                <ul className={styles.users}>
                    {holonUsers.map((user, index) =>
                        <UserCard
                            key={index} 
                            index={index}
                            user={user}
                        />
                    )} 
                </ul>
            }
            {holonUserPaginationOffset > 0 && holonUsers.length < 1 &&
                <div className='wecoNoContentPlaceholder'>
                    No users yet that match those settings...
                </div>
            }
        </div>
    )
}

export default HolonPageUsers
