import React from 'react'
// import ChildOne from './components/ChildOne'
import NavBar from './components/NavBar'
import PostPage from './pages/PostPage'
import BranchPage from './pages/BranchPage'
import Homepage from './pages/Homepage'
import Wall from './components/Wall'
import Branches from './pages/Branches'
import EmptyPage from './pages/EmptyPage'
// import PostContextProvider from './contexts/PostContext'
import BranchContextProvider from './contexts/BranchContext'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'

function App() {
  return (
    <>
      <div className="app">
        <BranchContextProvider>
          <Router history={ createBrowserHistory }>
            <NavBar/>
            <Switch>
              <Route path="/" exact component={ Homepage }/>
              <Route path="/wall" component={ BranchPage }/>
              <Route path="/branches" component={ Branches }/>
              <Route path="/p/:postId" component={ PostPage }/>
              <Route path="/b/:branchHandle" component={ BranchPage }/>
              {/* <Route path="/u/:userHandle" component={ UserPage }/> */}
              <Route component={ EmptyPage }/>
              {/* <Redirect from="/a" to="/b"/> */}
            </Switch>
          </Router>
        </BranchContextProvider>
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
