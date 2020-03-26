import React from 'react'
// import ChildOne from './components/ChildOne'
import NavBar from './components/NavBar'
import PostPage from './pages/PostPage'
import HolonPage from './pages/HolonPage'
import Homepage from './pages/Homepage'
import Wall from './components/Wall'
import ChildHolons from './components/ChildHolons'
import EmptyPage from './pages/EmptyPage'
// import PostContextProvider from './contexts/PostContext'
import HolonContextProvider from './contexts/HolonContext'
// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { createBrowserHistory } from 'history'

// const AnimatedSwitch = withRouter(({ location }) => (
//   <TransitionGroup>
//       <CSSTransition key={location.key} classNames="fade" timeout={1000}>
//           <Switch location={location}>
//               <Route path="/" exact component={ Homepage }/>
//               <Route path="/h/:holonHandle" component={ HolonPage }/>
//               {/* <Route path="/" component={Home} exact />
//               <Route path="/first" component={First} />
//               <Route path="/second" component={Second} /> */}
//           </Switch>
//       </CSSTransition>
//   </TransitionGroup>
// ));

function App() {
  return (
    <>
      <div className="app">
        
          <BrowserRouter history={ createBrowserHistory }>
          <HolonContextProvider>
            <NavBar history={ createBrowserHistory }/>
            {/* <AnimatedSwitch /> */}
            <Switch>
              <Route path="/" exact component={ Homepage }/>
              <Route path="/p/:postId" component={ PostPage }/>
              <Route path="/h/:holonHandle" component={ HolonPage }/>
              <Route component={ EmptyPage }/>
            </Switch>
            </HolonContextProvider>
          </BrowserRouter>
        
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
