import React, { useState, useEffect } from 'react';

import Wall from './pages/wall'
import Homepage from './pages/homepage';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/navbar';
import Context from './components/global-context';

import axios from 'axios'



function App() {
  // const [posts] = useState({ posts: {}});

  function getPosts() {
    axios.get('http://localhost:5000/api/posts') // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
      .then(res => {
        // console.log(res.data)
        const [state, setstate] = useState(res.data)
        // this.setState({ posts: res.data })
      })
  }

  const ColorContext = React.createContext(null);
  
  // const context = useContext(Context)
  // const [state, setstate] = useState(0)


  useEffect(() => {
    // const [state, setstate] = useState(Context)
    // console.log(Context)
    getPosts()

    console.log(state)
  });

  // submitPost = (post) => {
  //   // console.log(post)
  //   axios({ method: 'post', url: 'http://localhost:5000/api/posts', data: { post } })
  //     .then(res => {
  //       console.log(res);
  //     })
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
  return (
    <ColorContext.Provider>
      <Router>
        <div className="app">
          <NavBar/>
          {/* <CreatePost posts={this.state.posts} newPost={this.newPost}/>
          <Wall posts={this.state.posts}/> */}
          <Route exact path="/" component={Homepage} />
          <Route path="/wall" render={props => (
            <Wall className="wall" />
          )}/>
        </div>
        <style jsx="true">{`
          .app {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </Router>
    </ColorContext.Provider>
  );
}

// class App extends React.Component {
//   // state = {
//   //   posts: []
//   // }
//   // componentDidMount() {
//   //   this.getPosts()
//   // }
//   // getPosts = () => {
//   //   axios.get('http://localhost:5000/api/posts') // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
//   //     .then(res => {
//   //       // console.log(res.data)
//   //       this.setState({ posts: res.data })
//   //     })
//   // }
//   // submitPost = (post) => {
//   //   // console.log(post)
//   //   axios({ method: 'post', url: 'http://localhost:5000/api/posts', data: { post } })
//   //     .then(res => {
//   //       console.log(res);
//   //     })
//   // }
//   // addLike = (post) => {
//   //   console.log(post)
//   //   axios.put('http://localhost:5000/api/posts', { post })
//   //   .then(response => {
//   //     if (response.data === 'Post liked') {
//   //       console.log('success');
//   //       this.getPosts()
//   //     }
//   //   })
//   //   .catch(error => {
//   //     console.log(error)
//   //   })
//   // }
//   render() {
//     return (
//       // <Router>
//       //   <div className="app">
//       //     <NavBar/>
//       //     {/* <CreatePost posts={this.state.posts} newPost={this.newPost}/>
//       //     <Wall posts={this.state.posts}/> */}
//       //     <Route exact path="/" component={Homepage} />
//       //     <Route path="/wall" render={props => (
//       //       <Wall className="wall" posts={this.state.posts} newPost={this.submitPost} deletePost={this.deletePost} addLike={this.addLike}/>
//       //     )}/>
//       //   </div>
//       //   <style jsx="true">{`
//       //     .app {
//       //       width: 100%;
//       //       display: flex;
//       //       flex-direction: column;
//       //       justify-content: center;
//       //       align-items: center;
//       //     }
//       //   `}</style>
//       // </Router>
//     );
//   }
// }

export default App;
