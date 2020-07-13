import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageSideBarRight.module.scss'
import HolonPageSideBarRightPlaceholder from './HolonPageSideBarRightPlaceholder'

function HolonPageSideBarRight() {
    const { holonData, setHolonHandle, updateHolonContext, holonContextLoading } = useContext(HolonContext)

    return (
        <div className={styles.sideBarRight}>
            <HolonPageSideBarRightPlaceholder/>
            {holonData &&
                <div className={`${styles.sideBarRightContent} ${(!holonContextLoading && styles.visible)}`}>
                    {holonData.DirectParentHolons.length !== 0 &&
                        <>
                            <span className={styles.sideBarRightText}>Parent spaces:</span>
                            <ul className={styles.sideBarRightHolons}>
                                {holonData.DirectParentHolons.map((holon, index) => 
                                    <Link className={styles.sideBarRightHolon}
                                        to={ `/h/${holon.handle}` }
                                        key={index}
                                        onClick={ () => { setHolonHandle(holon.handle) } }>
                                        {holon.flagImagePath === null
                                            ? <div className={styles.placeholderWrapper}>
                                                <img className={styles.placeholder} src="/icons/users-solid.svg"/>
                                            </div>
                                            : <img className={styles.image} src={holon.flagImagePath}/>
                                        }
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
                                        onClick={ () => { setHolonHandle(holon.handle) } }>
                                        {holon.flagImagePath === null
                                            ? <div className={styles.placeholderWrapper}>
                                                <img className={styles.placeholder} src="/icons/users-solid.svg"/>
                                            </div>
                                            : <img className={styles.image} src={holon.flagImagePath}/>
                                        }
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

export default HolonPageSideBarRight