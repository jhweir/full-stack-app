
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/SideBarRight.module.scss'
import SideBarRightPlaceholder from '../components/SideBarRightPlaceholder'

function SideBarRight() {
    const { holonData, updateHolonContext, isLoading } = useContext(HolonContext)

    return (
        <div className={styles.sideBarRight}>
            <SideBarRightPlaceholder/>
            {holonData &&
                <div className={`${styles.sideBarRightContent} ${(!isLoading && styles.visible)}`}>
                    {holonData.DirectParentHolons.length !== 0 &&
                        <>
                            <span className={styles.sideBarRightText}>Parent spaces:</span>
                            <ul className={styles.sideBarRightHolons}>
                                {holonData.DirectParentHolons.map((holon, index) => 
                                    <Link className={styles.sideBarRightHolon}
                                        to={ `/h/${holon.handle}` }
                                        key={index}
                                        onClick={ () => { updateHolonContext(holon.handle) } }>
                                        <div className={styles.sideBarRightHolonImageWrapper}>
                                            <img className={styles.sideBarRightHolonImage} src="/icons/users-solid.svg"/>
                                        </div>
                                        { holon.name }
                                    </Link>
                                )} 
                            </ul>
                        </>
                    }
                    {holonData.DirectChildHolons.length !== 0 &&
                        <>
                            <span className={styles.sideBarRightText}>Child spaces:</span>
                            <ul className={styles.sideBarRightHolons}>
                                {holonData.DirectChildHolons.map((holon, index) => 
                                    <Link className={styles.sideBarRightHolon}
                                        to={ `/h/${holon.handle}` }
                                        key={index}
                                        onClick={ () => { updateHolonContext(holon.handle) } }>
                                        <div className={styles.sideBarRightHolonImageWrapper}>
                                            <img className={styles.sideBarRightHolonImage} src="/icons/users-solid.svg"/>
                                        </div>
                                        { holon.name }
                                    </Link>
                                )}
                            </ul>
                        </>
                    }
                </div>
            }
        </div>
    )
}

export default SideBarRight