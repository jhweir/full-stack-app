import React, { Component } from 'react'

export class post extends Component {
    // componentDidMount() {
    //     console.log(this.props.post)
    // }
    addLike = () => {
        this.props.addLike(this.props.post)
    }
    // Render
    render() {
        let { id, title, description, creator, date, likes } = this.props.post
        return (
            <div className="post">
                <div className="post-id">{ id }</div>
                <div className="post-body">
                    <div className="post-tags">
                        <a className="user-thumbnail mr-10"></a>
                        <a className="sub-text mr-10">{ creator || 'Anonymous' }</a>
                        <span className="sub-text mr-10">to</span>
                        <a className="sub-text mr-10">branch</a>
                        <span className="sub-text mr-10">|</span>
                        <a className="sub-text">{ date || 'no date' }</a>

                    </div>
                    <div className="post-content">
                        <div className="post-title">{ title }</div>
                        <div className="post-description">{ description }</div>
                        <div className="post-interact">
                            <div className="post-likes" onClick={ this.addLike }>
                                <div className="like-button"/>
                                <span>{ likes } Likes</span>
                            </div>
                            {/* <button className="button">Delete</button> */}
                        </div>
                    </div>
                </div>

                <style jsx="true">{`
                    .post {
                        margin-bottom: 10px;
                        padding: 20px 20px 20px 0;
                        border-radius: 5px;
                        background-color: white;
                        box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.08);
                        display: flex;
                        flex-direction: row;
                        transition-property: background-color;
                        transition-duration: 2s;
                    }
                    .post-id {
                        width: 60px;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        flex-shrink: 0;
                        color: #aaa;
                    }
                    .post-body {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        overflow: hidden;
                    }
                    .post-tags {
                        height: 40px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                    }
                    .user-thumbnail {
                        background-image: url(./icons/user-image-00.jpg);
                        background-position: center;
                        background-size: cover;
                        height: 40px;
                        width: 40px;
                        border-radius: 50%;
                    }
                    .sub-text {
                        color: #888;
                    }
                    .post-content {

                    }
                    .post-title {
                        color: black;
                        font-size: 24px;
                        font-weight: 600;
                        text-decoration: none;
                        padding-bottom: 10px;
                        transition-property: color;
                        transition-duration: 2s;
                    }
                    .post-description {
                        color: black;
                        font-size: 16px;
                        font-weight: 400;
                        text-decoration: none;
                        padding-bottom: 10px;
                        transition-property: color;
                        transition-duration: 2s;
                    }
                    .post-interact {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        flex-shrink: 0;
                    }
                    .post-likes {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        flex-shrink: 0;
                        margin-right: 10px;
                        color: #888;
                    }
                    .post-likes:hover {
                        cursor: pointer;
                    }
                    .like-button {
                        background-image: url(./icons/heart-solid.svg);
                        background-color: transparent;
                        border: none;
                        height: 17px;
                        width: 17px;
                        padding: 0;
                        opacity: 0.4;
                        margin-right: 5px;
                    }
                    .mr-10 {
                        margin-right: 10px;
                    }
                `}</style>
            </div>
        )
    }
}

export default post
