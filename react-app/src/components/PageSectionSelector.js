import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/PageSectionSelector.module.scss'

function PageSectionSelector(props) {
    const { url } = props
    return (
        <div className={styles.pageSectionSelector}>
            <Link className={styles.button} to={ `${url}` }>Comments</Link>
            <Link className={styles.button} to={ `${url}/vote` }>Vote</Link>
            <Link className={styles.button} to={ `${url}/results` }>Results</Link>
        </div>
    )
}

export default PageSectionSelector


{/* <div 
    className={styles.pageSectionSelectorButton}
    onClick={() => {setPageSection('comments')}}>
    Comments
</div>
<div 
    className={styles.pageSectionSelectorButton}
    onClick={() => {setPageSection('poll-vote')}}>
    Vote
</div>
<div
    className={styles.pageSectionSelectorButton}
    onClick={() => {setPageSection('poll-results')}}>
    Results
</div> */}