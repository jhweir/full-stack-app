import React from 'react';

function Homepage() {
    return (
        <>
            <div className="homepage">
                <span className="page-title">Component tree and features</span>
                <ul style={{ padding:0 }}>
                    <li><input type="checkbox" checked="checked" readOnly></input> App</li>
                    <ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> NavBar</li>
                        <ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> Page routing</li>
                            <li><input type="checkbox" checked="checked" readOnly></input> Dark mode</li>
                        </ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> Homepage</li>
                        <ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> Component tree and features</li>
                        </ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> Wall</li>
                        <ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> WallHeader</li>
                            <ul>
                                <li><input type="checkbox" checked="checked" readOnly></input> CreatePostModal</li>
                                <ul>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Add username</li>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Add title</li>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Add description</li>
                                    <li><input type="checkbox" checked="" readOnly></input> Add tags</li>
                                </ul>
                                <li><input type="checkbox" checked="checked" readOnly></input> SearchBar</li>
                                <ul>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Search by text</li>
                                </ul>
                                <li><input type="checkbox" checked="checked" readOnly></input> WallFilters</li>
                                <ul>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Sort by ID</li>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Sort by Likes</li>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Sort by Date</li>
                                    <li><input type="checkbox" checked="checked" readOnly></input> Sort by Comments</li>
                                </ul>
                            </ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> Posts</li>
                            <ul>
                                <li><input type="checkbox" checked="checked" readOnly></input> Like posts</li>
                                <li><input type="checkbox" checked="checked" readOnly></input> Delete posts</li>
                                <li><input type="checkbox" checked="checked" readOnly></input> Display number of comments</li>
                                <li><input type="checkbox" checked="checked" readOnly></input> Include time stap with date</li>
                                <li><input type="checkbox" checked="checked" readOnly></input> Link to unique post page</li>
                                <li><input type="checkbox" checked="checked" readOnly></input> Pin posts</li>
                                <li><input type="checkbox" checked="" readOnly></input> Add tags to posts</li>
                            </ul>
                        </ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> Post pages</li>
                        <ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> Display post</li>
                            <li><input type="checkbox" checked="checked" readOnly></input> Create comments</li>
                            <li><input type="checkbox" checked="checked" readOnly></input> List comments</li>
                        </ul>
                        <li><input type="checkbox" checked="" readOnly></input> Holons</li>
                        <li><input type="checkbox" checked="" readOnly></input> Users</li>
                        <li><input type="checkbox" checked="" readOnly></input> Auth page</li>
                    </ul>
                </ul>
            </div>

            <style jsx="true">{`
                .homepage {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                    color: black;
                    transition-property: color;
                    transition-duration: 2s;
                }
                ul {
                    list-style-type: none;
                    margin-left: 40px;
                }
                li {
                    list-style-type: none;
                }
            `}</style>
        </>
    )
}

export default Homepage
