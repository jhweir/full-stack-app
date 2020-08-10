import React, { useState, useContext } from 'react'
import styles from '../styles/components/SearchBar.module.scss'

function SearchBar(props) {
    const { setSearchFilter, placeholder  } = props
    const [newSearch, setNewSearch] = useState('')

    function applySearch(e) {
        e.preventDefault()
        setSearchFilter(newSearch)
    }

    return (
        <form className={styles.searchBar} onSubmit={applySearch}>
            <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={newSearch}
                onChange={(e) => setNewSearch(e.target.value)}
            />
            <button className={styles.button}/>
        </form>
    )
}

export default SearchBar
