import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import axios from 'axios'
// import config from '../Config'
// import { PostContext } from '../contexts/PostContext'
import { HolonContext } from '../contexts/HolonContext'

function SideBarLeft(props) {
    const { holonData, updateHolonContext, redirectTo } = useContext(HolonContext)

    return (
        <>
            <div className="left-side-bar">
                <div className='holon-location'>
                    <div className="holon-name">{ holonData.name }</div>
                    <ul className="parent-holon-names">
                        in
                        {holonData.DirectParentHolons.map((holon, index) =>
                            <li
                                key={index}
                                //onClick={() => redirectTo(`/h/${holon.handle}/wall`)}
                                onClick={ () => { updateHolonContext(holon.handle) } }
                                >
                                { holon.name }
                            </li>
                            // <Link key={index}
                            //     to={ `/h/${holon.handle}/wall` }
                            //     onClick={ () => { updateContext() } }>
                            //     { holon.name }
                            // </Link>
                        )}
                    </ul>
                </div>
                <img className="left-side-bar-flag-image" src="/images/holon-flag-image-00.jpg"/>
                <div className="left-side-bar-nav-buttons">
                    {/* <li className="left-side-bar-nav-button"
                        onClick={() => redirectTo(`/h/${holonData.handle}/wall`, `${holonData.handle}`)}>
                        Wall
                    </li>
                    <li className="left-side-bar-nav-button"
                        onClick={() => redirectTo(`/h/${holonData.handle}/child-holons`, `${holonData.handle}`)}>
                        Child Holons
                    </li> */}
                    <Link className="left-side-bar-nav-button"
                        to={ `/h/${holonData.handle}/wall` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }
                        >
                        Wall
                    </Link>
                    <Link className="left-side-bar-nav-button"
                        to={ `/h/${holonData.handle}/child-holons` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }
                        >
                        Child Holons
                    </Link>
                    <span className="sub-text mt-20">{holonData.description}</span>
                </div>
            </div>

            <style jsx="true">{`
                .left-side-bar {
                    width: 200px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                }
                .holon-location {

                }
                .holon-name {
                    font-size: 22px;
                    margin-bottom: 5px;
                }
                .parent-holon-names {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                .left-side-bar-flag-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin: 0 20px 20px 0;
                }
                .left-side-bar-nav-buttons {
                    display: flex;
                    flex-direction: column;
                }
                .left-side-bar-nav-button {
                    display: flex;
                    flex-direction: row;
                }
                .holon-info {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </>
    )
}

export default SideBarLeft