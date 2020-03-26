import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import axios from 'axios'
// import config from '../Config'
// import { PostContext } from '../contexts/PostContext'
import { HolonContext } from '../contexts/HolonContext'

function SideBarRight(props) {
    const { holonData, updateHolonContext, redirectTo } = useContext(HolonContext)

    return (
        <>
            <div className="side-bar-right">
                {/* <div className="child-holons"> */}
                <ul className="side-bar-right-child-holons">
                    {holonData.DirectChildHolons.map((holon, index) => 
                        <div className="side-bar-right-child-holon" key={index}>
                            {/* <div className="child-holon-image"
                                onClick={() => redirectTo(`/h/${holon.handle}/wall`, `${holon.handle}`)}>
                                <img className="child-holon-image" src="/images/holon-flag-image-00.jpg"/>
                            </div>
                            <div className="child-holon-name"
                                onClick={() => redirectTo(`/h/${holon.handle}/wall`, `${holon.handle}`)}>
                                { holon.name }
                            </div> */}
                            <Link className="side-bar-right-child-holon-image"
                                to={ `/h/${holon.handle}/wall` } 
                                onClick={ () => { updateHolonContext(holon.handle) } }
                                >
                                <img className="side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/>
                            </Link>
                            <Link className="side-bar-right-child-holon-name"
                                to={ `/h/${holon.handle}/wall` } 
                                onClick={ () => { updateHolonContext(holon.handle) } }
                                >
                                { holon.name }
                            </Link>
                        </div>
                    )} 
                </ul>
                {/* </div> */}
                {/* <div className='holon-location'>
                    <div className="holon-name">{ holonData.name }</div>
                    <ul className="parent-holon-names">
                        in
                        {holonData.DirectParentHolons.map((holon) =>
                            <span> { holon.name }</span>
                        )}
                    </ul>
                </div>
                <img className="right-side-bar-flag-image" src="/images/holon-flag-image-00.jpg"/>
                <div className="right-side-bar-nav-buttons">
                    <Link className="right-side-bar-nav-button"
                        to={ `/h/${holonData.handle}/wall` } 
                        onClick={ () => { updateContext() } }>
                        Wall
                    </Link>
                    <Link className="right-side-bar-nav-button"
                        to={ `/h/${holonData.handle}/child-holons` } 
                        onClick={ () => { updateContext() } }>
                        Child Holons
                    </Link>
                    <span className="sub-text mt-20">{holonData.description}</span>
                </div> */}
            </div>

            <style jsx="true">{`
                .side-bar-right {
                    width: 200px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                }
                .side-bar-right-child-holons {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .side-bar-right-child-holon {
                    margin: 10px 0;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .side-bar-right-child-holon-image {
                    background-position: center;
                    background-size: cover;
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-right: 10px;
                }
                .side-bar-right-child-holon-name:visited {
                    color: black;
                }
            `}</style>
        </>
    )
}

export default SideBarRight