import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/SideBarLeft.module.scss'
import SideBarLeftPlaceholder from '../components/SideBarLeftPlaceholder'

function SideBarLeft() {
    const { holonData, updateHolonContext, isLoading } = useContext(HolonContext)

    return (
        <div className={styles.sideBarLeft}>
            <SideBarLeftPlaceholder/>
            <div className={`${styles.sideBarLeftContent} ${(!isLoading && styles.visible)}`}>
                <div className={styles.sideBarLeftHolonName}>{ holonData.name }</div>
                <div className={styles.sideBarLeftFlagImageWrapper}>
                    <img className={styles.sideBarLeftFlagImagePlaceholder} src='/icons/users-solid.svg'/>
                </div>
                <div className={styles.sideBarLeftNavButtons}>
                    <Link className={styles.sideBarLeftNavButton}
                        to={ `/h/${holonData.handle}` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }>
                        Wall
                    </Link>
                    <Link className={styles.sideBarLeftNavButton}
                        to={ `/h/${holonData.handle}/child-spaces` }
                        onClick={ () => { updateHolonContext(holonData.handle) } }>
                        Child Spaces
                    </Link>
                    <span className="sub-text mt-20">{holonData.description}</span>
                </div>
            </div>
        </div>
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
                to={ `/h/${holon.handle}` }
                onClick={ () => { updateHolonContext(holon.handle) } }>
                {(' ' + holon.name) }
            </Link>
        )}
    </ul>
} */}