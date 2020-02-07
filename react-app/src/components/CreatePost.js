import React, { Component } from 'react'

export class CreatePost extends Component {
    state = {
        newPost: {
            title: '',
            description: ''
        }
    }
    onChange = (e) => this.setState({ newPost: { ...this.state.newPost, [e.target.name]: e.target.value} });
    onSubmit = (e) => {
        e.preventDefault();
        const {title, description} = this.state.newPost;
        if (title && description !== '') {
            this.props.newPost(this.state.newPost);
            this.setState({ newPost: {title: '', description: ''} });
        }
    }
    render() {
        return (
            <div>
                Create New Post
                <form onSubmit={this.onSubmit} className="create-post-form">
                    <input 
                        className=""
                        type="text"
                        placeholder="Post title..."
                        name="title"
                        value={this.state.newPost.title}
                        onChange={this.onChange}
                    />
                    <textarea
                        className=""
                        rows="5"
                        type="text"
                        placeholder="Post description..."
                        name="description"
                        value={this.state.newPost.body}
                        onChange={this.onChange}
                    ></textarea>
                    <div className="button-container">
                        <button className="button">Post</button>
                        <div className="button" onClick={this.hidePostModal}>Cancel</div>
                    </div>
                </form>
            </div>
        )
    }
}

export default CreatePost
