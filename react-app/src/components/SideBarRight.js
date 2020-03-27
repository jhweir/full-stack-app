
import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SideBarRightPlaceholder from '../components/SideBarRightPlaceholder'
// import axios from 'axios'
// import config from '../Config'
// import { PostContext } from '../contexts/PostContext'
import { HolonContext } from '../contexts/HolonContext'

function SideBarRight(props) {
    const { holonData, updateHolonContext, isLoading } = useContext(HolonContext)

    return (
        <>
            <div className={"ph-side-bar-right " + (isLoading ? 'visible' : '')}>
                <SideBarRightPlaceholder/>   
            </div>
            <div className={"side-bar-right " + (!isLoading ? 'visible' : '')}>
                {holonData.DirectParentHolons.length !== 0 &&
                    <>
                        <span className="side-bar-right-text mb-10">Parent spaces:</span>
                        <ul className="side-bar-right-child-holons mb-20">
                            {holonData.DirectParentHolons.map((holon, index) => 
                                <Link className="side-bar-right-child-holon mb-10"
                                    to={ `/h/${holon.handle}/wall` }
                                    key={index}
                                    onClick={ () => { updateHolonContext(holon.handle) } }
                                    >
                                    <img className="side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/>
                                    { holon.name }
                                </Link>
                            )} 
                        </ul>
                    </>
                }
                {holonData.DirectChildHolons.length !== 0 &&
                    <>
                        <span className="side-bar-right-text mb-10">Child spaces:</span>
                        <ul className="side-bar-right-child-holons">
                            {holonData.DirectChildHolons.map((holon, index) => 
                                <Link className="side-bar-right-child-holon mb-10"
                                    to={ `/h/${holon.handle}/wall` }
                                    key={index}
                                    onClick={ () => { updateHolonContext(holon.handle) } }
                                    >
                                    <img className="side-bar-right-child-holon-image" src="/images/holon-flag-image-00.jpg"/>
                                    { holon.name }
                                </Link>
                            )}
                        </ul>
                    </>
                }
            </div>

            <style jsx="true">{`
                .ph-side-bar-right {
                    width: 200px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: -1;
                    overflow: hidden;
                }
                .side-bar-right {
                    width: 200px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                }
                .side-bar-right-child-holons {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .side-bar-right-child-holon {
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