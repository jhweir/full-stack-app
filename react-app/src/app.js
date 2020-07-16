import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
// import { AccountContext } from '../contexts/AccountContext'
import AccountContextProvider from './contexts/AccountContext'
import HolonContextProvider from './contexts/HolonContext'
import UserContextProvider from './contexts/UserContext'
import Homepage from './pages/Homepage'
import HolonPage from './pages/HolonPage'
import PostPage from './pages/PostPage'
import UserPage from './pages/UserPage'
import EmptyPage from './pages/EmptyPage'
import NavBar from './components/NavBar'
import GlobalModals from './components/GlobalModals'

function App() {
  // const { authModalOpen, setAuthModalOpen} = useContext(AccountContext)
  return (
    <div className="app">
      <BrowserRouter history={createBrowserHistory}>
        <AccountContextProvider>
          <HolonContextProvider>
            <UserContextProvider>
              <NavBar/>
              <GlobalModals/>
              <Switch>
                <Route path="/" exact component={Homepage}/>
                <Route path="/h/:holonHandle" component={HolonPage}/>
                <Route path="/p/:postId" component={PostPage}/>
                <Route path="/u/:userName" component={UserPage}/>
                <Route component={EmptyPage}/>
              </Switch>
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
//               <Route path="/h/:holonHandle" component={ HolonPage }/>
//               {/* <Route path="/" component={Home} exact />
//               <Route path="/first" component={First} />
//               <Route path="/second" component={Second} /> */}
//           </Switch>
//       </CSSTransition>
//   </TransitionGroup>
// ));

// <AnimatedSwitch />
