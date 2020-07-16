import React, { useState, useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/SearchBar.module.scss'

function SearchBar(props) {
    const { type } = props
    const { setHolonPostSearchFilter, setHolonSpaceSearchFilter, setHolonUserSearchFilter } = useContext(HolonContext)
    //const { setUserSearchFilter } = useContext(HolonContext)
    const [newSearch, setNewSearch] = useState('')

    let setSearchFilter

    if (type === 'holon-posts') { setSearchFilter = setHolonPostSearchFilter }
    if (type === 'holon-spaces') { setSearchFilter = setHolonSpaceSearchFilter }
    if (type === 'holon-users') { setSearchFilter = setHolonUserSearchFilter }

    function applySearch(e) {
        e.preventDefault()
        setSearchFilter(newSearch)
    }

    return (
        <form className={styles.searchBar} onSubmit={ applySearch }>
            <input
                className={styles.input}
                type="text"
                placeholder="Search spaces..."
                value={ newSearch }
                onChange={ (e) => setNewSearch(e.target.value) }
            />
            <button className={styles.button}></button>
        </form>
    )
}

export default SearchBar




// import React, { Component } from 'react'
// // import colors from '../tokens/Colors';

// export class SearchBar extends Component {
//     state = {
//         searchInput: ''
//     }

//     onChange = (event) => this.setState({ searchInput: event.target.value });

//     onSubmit = (event) => {
//         event.preventDefault();
//         this.props.searchFilter(this.state.searchInput);
//         this.setState({ searchInput: '' });
//     }

//     render() {
//         return (
//             <form className="input-wrapper" onSubmit={this.onSubmit}>
//                 <input
//                     className="input"
//                     type="text"
//                     placeholder="Search posts..."
//                     value={this.state.searchInput}
//                     onChange={this.onChange}
//                 />
//                 <button className="search-button"></button>

//                 <style jsx="true">{`
//                     .search-button {
//                         background-image: url(./icons/search.svg);
//                         background-color: transparent;
//                         border: none;
//                         height: 20px;
//                         width: 20px;
//                         padding: 0;
//                         opacity: 0.6;
//                     }
//                 `}</style>
//             </form>
//         )
//     }
// }

// export default SearchBar
