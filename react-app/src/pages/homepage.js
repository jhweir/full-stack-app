import React from 'react';

function Homepage() {
    return (
        <div className="homepage">
            <span className="page-title">Component tree and features</span>
            <ul style={{ padding:0 }}>
                <li><input type="checkbox" checked="checked" readOnly></input> App</li>
                <ul>
                    <li><input type="checkbox" checked="checked" readOnly></input> NavBar</li>
                    <ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> Dark mode</li>
                    </ul>
                    <li><input type="checkbox" checked="checked" readOnly></input> Homepage</li>
                    <li><input type="checkbox" checked="checked" readOnly></input> Wall</li>
                    <ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> WallHeader</li>
                        <ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> CreatePostModal</li>
                            <ul>
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
                                <li><input type="checkbox" checked="" readOnly></input> Sort by Comments</li>
                            </ul>
                        </ul>
                        <li><input type="checkbox" checked="checked" readOnly></input> Posts</li>
                        <ul>
                            <li><input type="checkbox" checked="checked" readOnly></input> Like posts</li>
                            <li><input type="checkbox" checked="checked" readOnly></input> Delete posts</li>
                            <li><input type="checkbox" checked="checked" readOnly></input> Pin posts</li>
                            <li><input type="checkbox" checked="" readOnly></input> Add tags to posts</li>
                            <li><input type="checkbox" checked="" readOnly></input> Link to unique post page</li>
                            <li><input type="checkbox" checked="" readOnly></input> Add comments to posts</li>
                            <li><input type="checkbox" checked="" readOnly></input> Include time stap with date</li>
                        </ul>
                    </ul>
                    <li><input type="checkbox" checked="" readOnly></input> Branches</li>
                    <li><input type="checkbox" checked="" readOnly></input> Users</li>
                </ul>
            </ul>
            <br/>
            <br/>
            <br/>
            <span className="page-title">To do</span>
            <ul style={{ padding:0 }}>
                <li><input type="checkbox" checked="checked" readOnly></input> Setup .env on Server</li>
                <li><input type="checkbox" checked="checked" readOnly></input> Change class based to function based components</li>
                <li><input type="checkbox" checked="checked" readOnly></input> Like fix</li>
                <li><input type="checkbox" checked="" readOnly></input> Fix page routing</li>
                <li><input type="checkbox" checked="" readOnly></input> Authentication</li>
                <li><input type="checkbox" checked="" readOnly></input> Users page</li>
                <li><input type="checkbox" checked="checked" readOnly></input> Global state managment using context</li>
                <li><input type="checkbox" checked="" readOnly></input> Scrape URLs for post data</li>
                <li><input type="checkbox" checked="" readOnly></input> Resize and save thumbnails</li>
                <li><input type="checkbox" checked="" readOnly></input> Individual post pages</li>
                <li><input type="checkbox" checked="" readOnly></input> Comments</li>
            </ul>
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
                }
                li {
                    list-style-type: none;
                }
            `}</style>
        </div>
    )
}

export default Homepage
