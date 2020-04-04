import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/SideBarLeft.module.scss'

function SideBarLeft() {
    const { holonData, updateHolonContext, isLoading } = useContext(HolonContext)
    const { 
        sideBarLeft,
        visible,
        sideBarLeftHolonName,
        sideBarLeftFlagImage,
        sideBarLeftNavButtons,
        sideBarLeftNavButton,
    } = styles

    return (
        <>
            {/* <div className={`${phSideBarLeft} ${(isLoading && visible)}`}>
                <SideBarLeftPlaceholder/>
            </div> */}
            <div className={`${sideBarLeft} ${(!isLoading && visible)}`}>
                <div className={sideBarLeftHolonName}>{ holonData.name }</div>
                <div className={sideBarLeftFlagImage} style={{backgroundImage: "url('/icons/users-solid.svg')"}}/>
                <div className={sideBarLeftNavButtons}>
                    <Link className={sideBarLeftNavButton}
                        to={ `/h/${holonData.handle}/wall` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }>
                        Wall
                    </Link>
                    <Link className={sideBarLeftNavButton}
                        to={ `/h/${holonData.handle}/child-holons` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }>
                        Child Holons
                    </Link>
                    <span className="sub-text mt-20">{holonData.description}</span>
                </div>
            </div>
        </>
    )
}

export default SideBarLeft



{/* {holonData.handle === 'root' && 
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
} */}