import React, { createContext, Component } from 'react';
import axios from 'axios'

export const MyContext = createContext();

class MyContextProvider extends Component {
    state = {
        test: 'test text',
        test2: 'test 2',
        posts: []
    }
    
    componentDidMount() {
        this.getPosts()
    }

    getPosts = () => {
        axios.get('http://localhost:5000/api/posts') // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
        .then(res => {
            // this.setState({ posts: res.data })
            this.state = { ...this.state, posts: res.data }
            console.log(this.state)
        })
    }

    updateContext = () => {
        this.setState({ posts: this.state.posts })
    }

    render() {
        return (
            <MyContext.Provider value={{...this.state, updateContext: this.updateContext}}>
                {this.props.children}
            </MyContext.Provider>
        )
    }
}

export default MyContextProvider;