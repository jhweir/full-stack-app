import React from 'react'
// import ChildOne from './components/ChildOne'
import NavBar from './components/NavBar'
import PostPage from './pages/PostPage'
import Homepage from './pages/Homepage'
import Wall from './pages/Wall'
import EmptyPage from './pages/EmptyPage'
import PostContextProvider from './contexts/PostContext'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'

function App() {
  return (
    <>
      <div className="app">
        <PostContextProvider>
          <Router history={ createBrowserHistory }>
            <NavBar/>
            <Switch>
              <Route path="/" exact component={ Homepage }/>
              <Route path="/wall" component={ Wall }/>
              <Route path="/posts/:postId" component={ PostPage }/>
              <Redirect from="/test" to="/wall"/>
              <Route component={ EmptyPage }/>
            </Switch>
          </Router>
        </PostContextProvider>
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
    </>
  )
}

export default App;
