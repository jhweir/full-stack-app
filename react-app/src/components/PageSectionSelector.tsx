import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/components/PageSectionSelector.module.scss'
import { PostContext } from '../contexts/PostContext'

const PageSectionSelector = (props: { url: string; pathname: string }): JSX.Element => {
    const { url, pathname } = props
    const { getPostData, selectedSubPage, setSelectedSubPage } = useContext(PostContext)

    useEffect(() => {
        if (pathname.includes('comments')) {
            setSelectedSubPage('comments')
        }
        if (pathname.includes('vote')) {
            setSelectedSubPage('vote')
        }
        if (pathname.includes('results')) {
            setSelectedSubPage('results')
        }
    }, [pathname])

    return (
        <div className={styles.pageSectionSelector}>
            <Link
                className={`${styles.tab} ${selectedSubPage === 'comments' && styles.selected}`}
                to={`${url}`}
            >
                Comments
            </Link>
            <Link
                className={`${styles.tab} ${selectedSubPage === 'vote' && styles.selected}`}
                to={`${url}/vote`}
            >
                Vote
            </Link>
            <Link
                className={`${styles.tab} ${selectedSubPage === 'results' && styles.selected}`}
                to={`${url}/results`}
                onClick={() => getPostData()}
            >
                Results
            </Link>
        </div>
    )
}

export default PageSectionSelector

/* <div 
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
</div> */
