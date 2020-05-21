import React from 'react'
import styles from '../styles/components/PageSectionSelector.module.scss'

function PageSectionSelector(props) {
    const { setPageSection } = props
    return (
        <div className={styles.pageSectionSelector}>
            <div 
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
            </div>
        </div>
    )
}

export default PageSectionSelector