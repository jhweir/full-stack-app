import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageAbout.module.scss'
import { Link } from 'react-router-dom'

function HolonPageAbout() {
    const { holonData, setSelectedHolonSubPage } = useContext(HolonContext)

    function formatMinutes(number) {
        if (number < 10) return `0${number}`
        else return number
    }

    let d = new Date(holonData.createdAt)
    let dateCreated = `${d.getHours()}:${formatMinutes(d.getMinutes())} on ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

    useEffect(() => {
        setSelectedHolonSubPage('about')
    }, [])

    // TODO: add creator to holon when created

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                About
            </div>
            <div className={styles.content}>
                <div className={styles.name}>{holonData.name}</div>
                <div className={styles.handle}>s/{holonData.handle}</div>
                <div className={styles.created}>
                    <div className={`${styles.text} mr-10`}>Created at {dateCreated} by </div>
                    {holonData.Creator &&
                        <Link to={ `/u/${holonData.Creator.handle}`} className={styles.creator}>
                            {holonData.Creator.flagImagePath
                                ? <img className={styles.creatorImage} src={holonData.Creator.flagImagePath} alt=''/>
                                : <div className={styles.placeholderWrapper}>
                                    <img className={styles.placeholder} src={'/icons/user-solid.svg'} alt=''/>
                                </div>
                            }
                            <span className={styles.text}>{holonData.Creator && holonData.Creator.name}</span>
                        </Link>
                    }
                </div>
                <div className={styles.text}>{holonData.description}</div>
            </div>
        </div>
    )
}

export default HolonPageAbout

{/* <div className={styles.wrapper}>
<div className={styles.header}>
    About
</div>
<div className={styles.content}>
    <div className={styles.text}><b>Handle:</b> {holonData.handle}</div>
    <div className={styles.text}><b>Name:</b> {holonData.name}</div>
    <div className={styles.text}><b>Created:</b> {dateCreated} by ...</div>
    <div className={styles.text}><b>Description:</b> {holonData.description}</div>
</div>
</div> */}