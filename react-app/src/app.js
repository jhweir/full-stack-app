import React from 'react'
// import ChildOne from './components/ChildOne'
import NavBar from './components/NavBar'
import PostPage from './pages/PostPage'
import HolonPage from './pages/HolonPage'
import Homepage from './pages/Homepage'
import Wall from './components/Wall'
import Holons from './components/ChildHolons'
import EmptyPage from './pages/EmptyPage'
// import PostContextProvider from './contexts/PostContext'
import HolonContextProvider from './contexts/HolonContext'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'

function App() {
  return (
    <>
      <div className="app">
        <HolonContextProvider>
          <Router history={ createBrowserHistory }>
            <NavBar/>
            <Switch>
              <Route path="/" exact component={ Homepage }/>
              <Route path="/p/:postId" component={ PostPage }/>
              <Route path="/h/:holonHandle" component={ HolonPage }/>
              {/* <Route path="/u/:userHandle" component={ UserPage }/> */}
              <Route component={ EmptyPage }/>
              {/* <Redirect from="/a" to="/b"/> */}
            </Switch>
          </Router>
        </HolonContextProvider>
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
