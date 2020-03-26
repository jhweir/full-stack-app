import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
// import { TransitionGroup, CSSTransition } from 'react-transition-group'

import {
    BrowserRouter,
    Link,
    Route,
    Switch,
    withRouter
  } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import CoverImage from '../components/CoverImage'
import Wall from '../components/Wall'
import ChildHolons from '../components/ChildHolons'
import SideBarLeft from '../components/SideBarLeft'
import SideBarRight from '../components/SideBarRight'
import EmptyPage from './EmptyPage'

function HolonPage(props) {
    const { holonHandle } = props.match.params
    const { setHolon, isLoading, updateContext, updateHolonContext } = useContext(HolonContext)

    useEffect(() => {
        //setHolon(holon)
        updateHolonContext(holonHandle)
        //updateContext() // Sets the holon in the HolonContext and triggers a call to the database to retrieve holon data
    }, [])

    return (
        <>
            <CoverImage/>
            <Route render={({ location }) => (
                <div className="page-body">                            
                    <SideBarLeft/>
                    <TransitionGroup className="page-transition-group">
                        <CSSTransition classNames="pageFade"
                            appear={true}
                            timeout={{ appear: 2000, enter: 2000, exit: 2000 }}
                            key={location.key}>
                            <section className="section-wrapper">
                                <Switch location={location}>
                                    <Route path={`${props.match.url}/wall`} component={ Wall } exact/>
                                    <Route path={`${props.match.url}/child-holons`} component={ ChildHolons } exact/>
                                    <Route component={ EmptyPage }/>
                                </Switch>
                            </section>
                        </CSSTransition>
                    </TransitionGroup>
                    <SideBarRight/>
                </div>
            )} />

            <style jsx="true">{`
                .page-body {
                    width: 1200px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .page-transition-group {
                    position: relative;
                    width: 50%;
                }
                .section-wrapper {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                }
            `}</style>
        </>
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