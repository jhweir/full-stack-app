import React, { useContext, useEffect } from 'react'
import { HolonContext } from '../../contexts/HolonContext'
import styles from '../../styles/components/HolonPageAbout.module.scss'

function HolonPageAbout() {
    const { holonData, setSelectedHolonSubPage } = useContext(HolonContext)

    let d = new Date(holonData.createdAt)
    let dateCreated = `${d.getHours()}:${d.getMinutes()} on ${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`

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
                <div className={styles.text}>Created at {dateCreated} by [Creator]</div>
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