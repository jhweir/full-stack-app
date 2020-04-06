import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Holon.module.scss'

function Holon(props) {
    const { updateHolonContext } = useContext(HolonContext)

    return (
        <div className={styles.holon}>
            <Link className={styles.holonImage}
                to={ `/h/${props.holon.handle}/child-holons` }
                onClick={ () => { updateHolonContext(props.holon.handle) } }>
                <img className={styles.holonImage} src="/icons/holon-flag-image-03.svg"/>
            </Link>
            <div className={styles.holonInfo}>
                <Link className={styles.holonTitle}
                    to={ `/h/${props.holon.handle}/child-holons` }
                    onClick={ () => { updateHolonContext(props.holon.handle) } }>
                    {props.holon.name}
                </Link>
                <span className={styles.holonDescription}>{props.holon.description}</span>
            </div>
        </div>
    )
}

export default Holon