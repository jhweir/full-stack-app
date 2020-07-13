import React, { useState, useContext } from 'react'
import styles from '../styles/components/PageHeader.module.scss'

function PageHeader({ children }) {
    return (
        <div className={styles.pageHeader}>
            { children }
        </div>
    )
}

export default PageHeader
