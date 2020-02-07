import React, { useState, useEffect, setData } from 'react';
import './App.css';
import ChildOne from './components/ChildOne';
import axios from 'axios'

import MyContextProvider from './components/MyContext'



function App() {
  // Set initial state
  // const [posts, setPosts] = useState([]);
  // const [test, setTest] = useState('test text');

  // // Fetch posts
  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/posts') // http://176.34.156.27/api/posts OR http://localhost:5000/api/posts
  //   .then(res => {
  //     console.log(res.data)
  //     setPosts(res.data)
  //   })
  // }, [])

  return (
    <div className="App">
      <MyContextProvider>

        <p>App: Posts = </p>

        {/* <div>{posts.map((post, index) => ( <Post key={index} index={index} post={post} /> ))} </div> */}

        <ChildOne/>

      </MyContextProvider>
    </div>
  );
}

export default App;
