import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import { Route, Switch, Redirect } from "react-router-dom"
import styles from '../styles/pages/HolonPage.module.scss'
import Wall from '../components/Wall'
import ChildHolons from '../components/ChildHolons'
import Users from '../components/Users'
import SideBarLeft from '../components/SideBarLeft'
import SideBarRight from '../components/SideBarRight'
import EmptyPage from './EmptyPage'

function HolonPage({ match }) {
    const { url } = match
    const { holonHandle } = match.params
    const { updateHolonContext } = useContext(HolonContext)

    useEffect(() => {
        updateHolonContext(holonHandle)
    }, [])

    return (
        <div className={styles.holonPage}>
            {/* TODO: Create new cover component and pass in required holon props */}
            <div className={styles.coverImageWrapper}>
                <div className={styles.coverImage}/>
            </div>
            <div className={styles.holonPageContainer}>
                <SideBarLeft/>
                <div className={styles.holonPageCenterPanel}>
                    <Switch>
                        <Redirect from={url} to={`${url}/posts`} exact/>
                        <Route path={`${url}/posts`} component={ Wall } exact/>
                        <Route path={`${url}/spaces`} component={ ChildHolons } exact/>
                        <Route path={`${url}/users`} component={ Users } exact/>
                        <Route component={ EmptyPage }/> {/* TODO: Check if this needs to be doubled up on the App.js component */}
                    </Switch>
                </div>
                <SideBarRight/>
            </div>
        </div>
    )
}

export default HolonPage

//import { TransitionGroup, CSSTransition } from "react-transition-group";

{/* <TransitionGroup className={pageTransitionGroup}>
<CSSTransition classNames="pageFade"
    appear={true}
    timeout={{ appear: 200, enter: 200, exit: 200 }}
    key={location.key}>
    <section className={sectionWrapper}>         
        <Switch location={location}>
            <Route path={`${url}/wall`} component={ Wall } exact/>
            <Route path={`${url}/child-spaces`} component={ ChildHolons } exact/>
            <Route component={ EmptyPage }/>
        </Switch>
    </section>
</CSSTransition>
</TransitionGroup> */}


// const timeout = { enter: 800, exit: 400}

// const Home = () => <div className="home">Home Component</div>;
// const First = () => <div className="first">First Component</div>;
// const Second = () => <div className="second">Second Component</div>;

// const AnimatedSwitch = withRouter(({ location }) => (
//     <TransitionGroup>
//         <CSSTransition key={location.key} classNames="slide" timeout={1000}>
//         <Switch>
//             <Route path="/" component={Home} exact />
//             <Route path="/first" component={First} />
//             <Route path="/second" component={Second} />
//         </Switch>
//         </CSSTransition>
//     </TransitionGroup>
// ));

// const AnimatedSwitch = withRouter(({ location }) => (
//     <TransitionGroup>
//         <CSSTransition key={location.key} classNames="fade" timeout={1000} mountOnEnter={true} unmountOnExit={true}>
//             <Switch location={location}>
//                 <Route path={`${url}/wall`} component={ Wall } exact/>
//                 <Route path={`${url}/child-spaces`} component={ ChildHolons } exact/>
//                 {/* <Route path="/" component={Home} exact />
//                 <Route path="/first" component={First} />
//                 <Route path="/second" component={Second} /> */}
//             </Switch>
//         </CSSTransition>
//     </TransitionGroup>
// ));