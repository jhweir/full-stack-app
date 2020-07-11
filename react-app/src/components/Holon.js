import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/Holon.module.scss'

function Holon(props) {
    const { handle, name, description, flagImagePath } = props.holon
    const { setHolonHandle } = useContext(HolonContext)

    return (
        <div className={styles.holon}>
            <Link className={styles.flagImage}
                to={ `/h/${handle}` }
                onClick={ () => { setHolonHandle(handle) } }>
                    {flagImagePath === null
                        ? <div className={styles.flagImagePlaceholderWrapper}>
                            <img className={styles.flagImagePlaceholder} src='/icons/users-solid.svg' alt=''/>
                        </div>
                        : <img className={styles.flagImage} src={flagImagePath} alt=''/>
                    }
            </Link>
            <div className={styles.holonInfo}>
                <Link className={styles.holonTitle}
                    to={ `/h/${handle}` }
                    onClick={ () => { setHolonHandle(handle) } }>
                    {name}
                </Link>
                <span className={styles.holonDescription}>{description}</span>
            </div>
        </div>
    )
}

export default Holon