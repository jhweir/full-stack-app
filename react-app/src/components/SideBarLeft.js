import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'
import { TransitionGroup, CSSTransition } from "react-transition-group";

function SideBarLeft(props) {
    const { holonData, updateHolonContext, isLoading } = useContext(HolonContext)

    return (
        <>
            <div className={"ph-side-bar-left " + (isLoading ? 'visible' : '')}>
                <SideBarLeftPlaceholder/>
            </div>
            <div className={"side-bar-left " + (!isLoading ? 'visible' : '')}>
                <div className="side-bar-left-holon-location">
                    <div className="side-bar-left-holon-name">{ holonData.name }</div>
                    {holonData.handle == 'root' && 
                        <div className="side-bar-left-parent-holon-names-root">
                            ∞
                        </div>
                    }
                    {holonData.handle !== 'root' && 
                        <ul className="side-bar-left-parent-holon-names mb-20">
                            in
                            {holonData.DirectParentHolons.map((holon, index) =>
                                <Link key={index}
                                    to={ `/h/${holon.handle}/wall` }
                                    onClick={ () => { updateHolonContext(holon.handle) } }>
                                    {(' ' + holon.name) }
                                </Link>
                            )}
                        </ul>
                    }
                </div>
                <img className="side-bar-left-flag-image" src="/icons/holon-flag-image-03.svg"/>
                <div className="side-bar-left-nav-buttons">
                    <Link className="side-bar-left-nav-button"
                        to={ `/h/${holonData.handle}/wall` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }
                        >
                        Wall
                    </Link>
                    <Link className="side-bar-left-nav-button"
                        to={ `/h/${holonData.handle}/child-holons` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }
                        >
                        Child Holons
                    </Link>
                    <span className="sub-text mt-20">{holonData.description}</span>
                </div>
            </div>

            <style jsx="true">{`
                .ph-side-bar-left {
                    width: 200px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -1;
                    overflow: hidden;
                }
                .side-bar-left {
                    width: 200px;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .side-bar-left-holon-location {
                }
                .side-bar-left-holon-name {
                    font-size: 22px;
                    line-height: 22px;
                    margin-bottom: 5px;
                }
                .side-bar-left-parent-holon-names-root {
                    font-size: 20px;
                    line-height: 16px;
                    margin-bottom: 25px;
                    color: rgba(0,0,0,0.3)
                }
                .side-bar-left-parent-holon-names {
                    font-size: 16px;
                }
                .side-bar-left-flag-image {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    margin: 0 0 20px 0;
                    background-color: white;
                }
                .side-bar-left-nav-buttons {
                    display: flex;
                    flex-direction: column;
                }
                .side-bar-left-nav-button {
                    display: flex;
                    flex-direction: row;
                }
                .side-bar-left-holon-info {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </>
    )
}

export default SideBarLeft