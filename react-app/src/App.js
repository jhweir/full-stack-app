import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import AccountContextProvider from './contexts/AccountContext'
import HolonContextProvider from './contexts/HolonContext'
import UserContextProvider from './contexts/UserContext'
import PostContextProvider from './contexts/PostContext'
import HomePage from './pages/HomePage'
import HolonPage from './pages/HolonPage'
import PostPage from './pages/PostPage'
import UserPage from './pages/UserPage'
import EmptyPage from './pages/EmptyPage'
import NavBar from './components/NavBar'
import Modals from './components/Modals'

function App() {
  const [pageBottomReached, setPageBottomReached] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, [])

  function handleScroll() {
    let d = document.documentElement
    let pageBottomOffset = 150
    let pageBottomReached = d.scrollHeight - d.scrollTop - pageBottomOffset < d.clientHeight
    setPageBottomReached(pageBottomReached ? true : false)
  }

  return (
    <div className="app">
      <BrowserRouter history={createBrowserHistory}>
        <AccountContextProvider pageBottomReached={pageBottomReached}>
          <HolonContextProvider>
            <UserContextProvider>
              <PostContextProvider>
                <NavBar/>
                <Modals/>
                <Switch>
                  <Route path="/" exact component={HomePage}/>
                  <Route path="/s/:holonHandle" component={HolonPage}/>
                  <Route path="/p/:postId" component={PostPage}/>
                  <Route path="/u/:userHandle" component={UserPage}/>
                  <Route component={EmptyPage}/>
                </Switch>
              </PostContextProvider>
            </UserContextProvider>
          </HolonContextProvider>
        </AccountContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default App

// import { TransitionGroup, CSSTransition } from "react-transition-group";

// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

// const AnimatedSwitch = withRouter(({ location }) => (
//   <TransitionGroup>
//       <CSSTransition key={location.key} classNames="fade" timeout={1000}>
//           <Switch location={location}>
//               <Route path="/" exact component={ Homepage }/>
//               <Route path="/s/:holonHandle" component={ HolonPage }/>
//               {/* <Route path="/" component={Home} exact />
//               <Route path="/first" component={First} />
//               <Route path="/second" component={Second} /> */}
//           </Switch>
//       </CSSTransition>
//   </TransitionGroup>
// ));

// <AnimatedSwitch />
