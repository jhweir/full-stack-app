import React, { useState, useContext, useEffect, useRef } from 'react'
import { AccountContext } from '../contexts/AccountContext'
import { HolonContext } from '../contexts/HolonContext'
import { UserContext } from '../contexts/UserContext'
import styles from '../styles/components/DropDownMenu.module.scss'

function DropDownMenu(props) {
    const { title, options, type } = props
    const {
        holonPostTimeRangeFilter, setHolonPostTimeRangeFilter,
        holonPostTypeFilter, setHolonPostTypeFilter,
        holonPostSortByFilter, setHolonPostSortByFilter,
        holonPostSortOrderFilter, setHolonPostSortOrderFilter,
        holonPostScopeFilter, setHolonPostScopeFilter,

        holonSpaceTimeRangeFilter, setHolonSpaceTimeRangeFilter,
        holonSpaceSortByFilter, setHolonSpaceSortByFilter,
        holonSpaceSortOrderFilter, setHolonSpaceSortOrderFilter,
        holonSpaceScopeFilter, setHolonSpaceScopeFilter,

        holonUserTimeRangeFilter, setHolonUserTimeRangeFilter,
        holonUserSortByFilter, setHolonUserSortByFilter,
        holonUserSortOrderFilter, setHolonUserSortOrderFilter
    } = useContext(HolonContext)

    const {
        createdPostTimeRangeFilter, setCreatedPostTimeRangeFilter,
        createdPostTypeFilter, setCreatedPostTypeFilter,
        createdPostSortByFilter, setCreatedPostSortByFilter,
        createdPostSortOrderFilter, setCreatedPostSortOrderFilter
    } = useContext(UserContext)

    const [menuOpen, setMenuOpen] = useState(false)

    // close menu if user clicks outside ref
    const ref = useRef()
    function handleClickOutside(e) { if (!ref.current.contains(e.target)) { setMenuOpen(false) } }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    let selectedOption, setSelectedOption

    if (type === 'holon-posts') {
        if (title === 'Time Range') { selectedOption = holonPostTimeRangeFilter; setSelectedOption = setHolonPostTimeRangeFilter }
        if (title === 'Post Type') { selectedOption = holonPostTypeFilter; setSelectedOption = setHolonPostTypeFilter }
        if (title === 'Sort By') { selectedOption = holonPostSortByFilter; setSelectedOption = setHolonPostSortByFilter }
        if (title === 'Sort Order') { selectedOption = holonPostSortOrderFilter; setSelectedOption = setHolonPostSortOrderFilter }
        if (title === 'Scope') { selectedOption = holonPostScopeFilter; setSelectedOption = setHolonPostScopeFilter }
    }

    if (type === 'holon-spaces') {
        if (title === 'Time Range') { selectedOption = holonSpaceTimeRangeFilter; setSelectedOption = setHolonSpaceTimeRangeFilter }
        if (title === 'Sort By') { selectedOption = holonSpaceSortByFilter; setSelectedOption = setHolonSpaceSortByFilter }
        if (title === 'Sort Order') { selectedOption = holonSpaceSortOrderFilter; setSelectedOption = setHolonSpaceSortOrderFilter }
        if (title === 'Scope') { selectedOption = holonSpaceScopeFilter; setSelectedOption = setHolonSpaceScopeFilter }
    }

    if (type === 'holon-users') {
        if (title === 'Time Range') { selectedOption = holonUserTimeRangeFilter; setSelectedOption = setHolonUserTimeRangeFilter }
        if (title === 'Sort By') { selectedOption = holonUserSortByFilter; setSelectedOption = setHolonUserSortByFilter }
        if (title === 'Sort Order') { selectedOption = holonUserSortOrderFilter; setSelectedOption = setHolonUserSortOrderFilter }
    }

    if (type === 'user-posts') {
        if (title === 'Time Range') { selectedOption = createdPostTimeRangeFilter; setSelectedOption = setCreatedPostTimeRangeFilter }
        if (title === 'Post Type') { selectedOption = createdPostTypeFilter; setSelectedOption = setCreatedPostTypeFilter }
        if (title === 'Sort By') { selectedOption = createdPostSortByFilter; setSelectedOption = setCreatedPostSortByFilter }
        if (title === 'Sort Order') { selectedOption = createdPostSortOrderFilter; setSelectedOption = setCreatedPostSortOrderFilter }
    }

    return (
        <div className={styles.dropDownMenu}>
            <span className={styles.title}>{title.toUpperCase()}</span>
            <div ref={ref}>
                <div className={styles.selectedOption} onClick={() => setMenuOpen(!menuOpen)}>
                    {selectedOption}
                    <img className={styles.icon} src='/icons/sort-down-solid.svg'/>
                </div>
                <div className={`${styles.options} ${menuOpen && styles.visible}`}>
                    {options.map((option, index) => 
                        <div className={styles.option} key={index} onClick={() => { 
                            setSelectedOption(option)
                            setMenuOpen(false)
                            //history.push(`/holon-posts?${title}=${option}`)
                        }}>{option}</div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default DropDownMenu

// onChange={onChange()} onFocus={selectedIndex = -1}

/* <img  className={styles.chevron} src='/icons/sync-alt-solid.svg'/> */