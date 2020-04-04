import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import {Route, Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import styles from '../styles/pages/HolonPage.module.scss'
import Wall from '../components/Wall'
import ChildHolons from '../components/ChildHolons'
import SideBarLeft from '../components/SideBarLeft'
import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'
import SideBarRight from '../components/SideBarRight'
import EmptyPage from './EmptyPage'

function HolonPage(props) {
    const { holonHandle } = props.match.params
    const { updateHolonContext } = useContext(HolonContext)
    const { pageBody, pageTransitionGroup, sectionWrapper } = styles

    useEffect(() => {
        updateHolonContext(holonHandle)
    }, [])

    return (
        <Route render={({ location }) => (
            <>
                <div className="coverImage"/>
                <div className={pageBody}>
                    <SideBarLeft/>
                    <SideBarLeftPlaceholder/>
                    <TransitionGroup className={pageTransitionGroup}>
                        <CSSTransition classNames="pageFade"
                            appear={true}
                            timeout={{ appear: 200, enter: 200, exit: 200 }}
                            key={location.key}>
                            <section className={sectionWrapper}>         
                                <Switch location={location}>
                                    <Route path={`${props.match.url}/wall`} component={ Wall } exact/>
                                    <Route path={`${props.match.url}/child-holons`} component={ ChildHolons } exact/>
                                    <Route component={ EmptyPage }/> {/* TODO: Check if this needs to be doubled up on the App.js component */}
                                </Switch>
                            </section>
                        </CSSTransition>
                    </TransitionGroup>
                    <SideBarRight/>
                </div>
            </>
        )}/>
    )
}

export default HolonPage


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
    //                 <Route path={`${props.match.url}/wall`} component={ Wall } exact/>
    //                 <Route path={`${props.match.url}/child-holons`} component={ ChildHolons } exact/>
    //                 {/* <Route path="/" component={Home} exact />
    //                 <Route path="/first" component={First} />
    //                 <Route path="/second" component={Second} /> */}
    //             </Switch>
    //         </CSSTransition>
    //     </TransitionGroup>
    // ));