import React from 'react'
// import ChildOne from './components/ChildOne'
import NavBar from './components/NavBar'
import PostPage from './components/PostPage'
import Homepage from './pages/Homepage'
import Wall from './pages/Wall'
import PostContextProvider from './contexts/PostContext'
import { BrowserRouter as Router, Route } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <PostContextProvider>
        <Router>
          <NavBar/>
          <Route exact path="/" component={Homepage} />
          <Route path="/wall" component={Wall}/>
          <Route exact path="/posts/:postId" component={PostPage} />
        </Router>
      </PostContextProvider>
      <style jsx="true">{`
        .app {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default App;
