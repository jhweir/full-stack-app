import React, { Component } from 'react'
// import colors from '../tokens/Colors';

export class WallFilters extends Component {
    state = {
        dropdownVisible: false
    }

    dropdownToggle = () => this.setState({ dropdownVisible: !this.state.dropdownVisible })
    

    render() {
        return (
            <div className="wall-filters">
                {/* <button className="button" onClick={this.props.SortById}>
                    Sort By ID
                </button>
                <button className="button" onClick={this.props.SortByLikes}>
                    Sort By Likes
                </button> */}

                <button className="button" onClick={this.dropdownToggle}>
                    Filters
                </button>
                <div className={"dropdown-content " + (this.state.dropdownVisible ? 'visible' : '')}>
                    <div className="dropdown-item" onClick={this.props.SortById}>Sort by ID</div>
                    <div className="dropdown-item" onClick={this.props.SortByLikes}>Sort by Likes</div>
                </div>

                <style jsx="true">{`
                    .wall-filters {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                    .dropdown-content {
                        display: none;
                        width: 200px;
                        border-radius: 5px;
                        background-color: white;
                        box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.2);
                        position: absolute;
                        top: 130px;
                        left: calc(50% - 20px)
                    }
                    .dropdown-item {
                        height: 40px;
                        border-radius: 5px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                    }
                    .dropdown-item:hover {
                        background-color: #eee;
                    }
                    .visible {
                        display: block;
                    }

                `}</style>
            </div>
        )
    }
}

export default WallFilters
