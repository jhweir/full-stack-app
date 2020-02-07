import React, { Component } from 'react';

import Wall from './pages/wall'
import Homepage from './pages/homepage';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/navbar';

import axios from 'axios'

// import MyContext from './components/MyContext';

// Create context
const MyContext = React.createContext();

// Create provider
class MyProvider extends Component {
  state = {
    posts: []
  }
  constructor(props) {
    super(props);
    this.getPosts()
  }

  // componentDidMount() {
  //   this.getPosts()
  // }

  getPosts = () => {
    axios.get('http://localhost:5000/api/posts') // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
      .then(res => {
        // this.setState({ posts: res.data })
        this.state = { posts: res.data }
        console.log(this.state.posts)
      })
  }

  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        updateState: () => {
          this.setState({ posts: this.state.posts })
          console.log(this.state.posts)
        }
        // growAYearOlder: () => this.setState({
        //   age: this.state.age + 1
        // })
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

// Child One component
const ChildOne = (props) => (
  <div>
    <p>Child One</p>
    <ChildTwo />
  </div>
)

// Child Two component
const ChildTwo = (props) => (
  <div>
    <MyContext.Consumer>
      {(context) => (
        <React.Fragment>
          <p>Child Two (Context Consumer)</p>
          <p>Name: {context.state}</p>
          {/* <p>Age: {context.state.age}</p> */}
          <button onClick={context.updateState}>Click me</button>
        </React.Fragment>
      )}
    </MyContext.Consumer>
  </div>
)


class App extends Component {
  render() {
    return (
      <MyProvider>
        <div>
          <p>I'm the app (Context Provider)</p>
          <ChildOne />
        </div>
      </MyProvider>
    )
  }
}

export default App;

// constructor(props) {
//   super(props);
//   // this.getPosts()
//   // console.log(this.state)
//   this.state = {
//     posts: 'test'
//   };
  // componentDidMount() {
  //   // this.getPosts()
  //   // console.log(this.context)
  // }

  // getPosts = () => {
  //   axios.get('http://localhost:5000/api/posts') // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
  //     .then(res => {
  //       // this.setState({ posts: res.data })
  //       this.state = { post: res.data }
  //     })
  // }

  // submitPost = (post) => {
  //   axios({ method: 'post', url: 'http://localhost:5000/api/posts', data: { post } })
  //     .then(res => { console.log(res) })
  // }

  // addLike = (post) => {
  //   console.log(post)
  //   axios.put('http://localhost:5000/api/posts', { post })
  //   .then(response => {
  //     if (response.data === 'Post liked') {
  //       console.log('success');
  //       this.getPosts()
  //     }
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })
  // }

  // render() {
  //   return (
  //     <MyContext.Provider value={this.state}>
  //       <Router>
  //         <div className="app">
  //           <NavBar/>
  //           <Route exact path="/" component={Homepage} />
  //           <Route path="/wall" render={props => (
  //             <Wall className="wall" /> // posts={this.state.posts} newPost={this.submitPost} deletePost={this.deletePost} addLike={this.addLike}
  //           )}/>
  //         </div>
  //         <style jsx="true">{`
  //           .app {
  //             width: 100%;
  //             display: flex;
  //             flex-direction: column;
  //             justify-content: center;
  //             align-items: center;
  //           }
  //         `}</style>
  //       </Router>
  //     </MyContext.Provider>
  //   );
  // }
// }

// export default App;
