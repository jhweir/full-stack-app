import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import HolonContextProvider from './contexts/HolonContext'
import Homepage from './pages/Homepage'
import HolonPage from './pages/HolonPage'
import PostPage from './pages/PostPage'
import EmptyPage from './pages/EmptyPage'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="app">
      <BrowserRouter history={createBrowserHistory}>
        <HolonContextProvider>
          <NavBar history={createBrowserHistory}/>
          {/* <div style={{width: "300px", height: "100%", backgroundColor: "#4F5361", position: "absolute", left: 0, top: 0}}></div> */}
          <Switch>
            <Route path="/" exact component={Homepage}/>
            <Route path="/h/:holonHandle" component={HolonPage}/>
            <Route path="/p/:postId" component={PostPage}/>
            <Route component={EmptyPage}/>
          </Switch>
        </HolonContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;

//  Side bar/burger menu test
{/* <div style={{width: "300px", height: "100%", backgroundColor: "#4F5361", position: "absolute", left: 0, top: 0}}></div> */}


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
