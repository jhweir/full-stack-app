import React, { Component } from 'react'
// import colors from '../tokens/Colors';

export class SearchBar extends Component {
    state = {
        searchInput: ''
    }

    onChange = (event) => this.setState({ searchInput: event.target.value });

    onSubmit = (event) => {
        event.preventDefault();
        this.props.searchFilter(this.state.searchInput);
        this.setState({ searchInput: '' });
    }

    render() {
        return (
            <form className="input-wrapper" onSubmit={this.onSubmit}>
                <input
                    className="input"
                    type="text"
                    placeholder="Search posts..."
                    value={this.state.searchInput}
                    onChange={this.onChange}
                />
                <button className="search-button"></button>

                <style jsx="true">{`
                    .search-button {
                        background-image: url(./icons/search.svg);
                        background-color: transparent;
                        border: none;
                        height: 20px;
                        width: 20px;
                        padding: 0;
                        opacity: 0.6;
                    }
                `}</style>
            </form>
        )
    }
}

export default SearchBar
