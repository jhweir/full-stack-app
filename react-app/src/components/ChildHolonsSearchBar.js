import React, { useState, useContext } from 'react'
import { HolonContext } from '../contexts/HolonContext'

function BranchSearchBar(props) {
    const { setSearchFilter } = useContext(HolonContext);
    const [search, setSearch] = useState('')

    function applySearch(e) {
        e.preventDefault()
        setSearchFilter(search)
    }

    return (
        <>
            <div className="mb-10">
                <form className="search-input-wrapper" onSubmit={ applySearch }>
                    <input
                        className="input"
                        type="text"
                        placeholder="Search holons..."
                        value={ search }
                        onChange={ (e) => setSearch(e.target.value) }
                    />
                    <button className="search-button"></button>
                </form>
            </div>

            <style jsx="true">{`
                .search-input-wrapper {
                    font-size: 14px;
                    outline: none;
                    border: none;
                    background-color: white;
                    height: 40px;
                    border-radius: 5px;
                    padding: 0px 15px;
                    margin-right: 10px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.05);
                    transition-property: box-shadow, background-color;
                    transition-duration: 0.3s, 2s;
                }
                .input-wrapper:hover {
                    box-shadow: 0 0 5px 6px rgba(58,136,240,0.4);
                }
                .input {
                    font-size: 14px;
                    outline: none;
                    border: none;
                }
                .search-button {
                    background-image: url(/icons/search.svg);
                    background-color: transparent;
                    border: none;
                    height: 20px;
                    width: 20px;
                    padding: 0;
                    opacity: 0.6;
                }
            `}</style>
        </>
    )
}

export default BranchSearchBar




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
