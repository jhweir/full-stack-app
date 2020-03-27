
import React, { useState, useContext, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
// import axios from 'axios'
// import config from '../Config'
import Holon from './Holon'
import ChildHolonsHeader from './ChildHolonsHeader'
import ChildHolonsPlaceholder from './ChildHolonsPlaceholder'

import { TransitionGroup, CSSTransition } from "react-transition-group";

function ChildHolons() {
    const { setHolon, updateContext, holonData, globalData, isLoading, setIsLoading } = useContext(HolonContext)

    return (
        <>
            <div className="child-holons">
                <ChildHolonsHeader />
                <ChildHolonsPlaceholder />
                <ul className={"child-holon-list " + (!isLoading ? 'visible' : '')}>
                    {holonData.DirectChildHolons.map((holon, index) =>
                        <CSSTransition appear key={index} in={!isLoading} timeout={2000} classNames="contentFade">
                            <Holon
                                holon={holon}
                                index={index}
                                key={holon.id}
                                updateContext={updateContext}
                            />
                        </CSSTransition>
                    )} 
                </ul>
            </div>

            <style jsx="true">{`
                .child-holons {
                    width: 700px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .child-holon-list {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    )
}

export default ChildHolons
