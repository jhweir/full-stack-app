import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/PageSectionSelector.module.scss'

function PageSectionSelector(props) {
    const { pageUrl } = props
    return (
        <div className={styles.pageSectionSelector}>
            <Link 
                className={styles.pageSectionSelectorButton}
                to={ `${pageUrl}` }>
                Comments
            </Link>
            <Link 
                className={styles.pageSectionSelectorButton}
                to={ `${pageUrl}/vote` }>
                Vote
            </Link>
            <Link
                className={styles.pageSectionSelectorButton}
                to={ `${pageUrl}/results` }>
                Results
            </Link>
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