import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/components/ShowMoreLess.module.scss'
import { ReactComponent as ChevronIconSVG } from '../svgs/chevron-down-solid.svg'

const ShowMoreLess = (props: { height: number; children: any }): JSX.Element => {
    const { height, children } = props

    const [overflow, setOverflow] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    function findContentHeight() {
        if (contentRef.current) return contentRef.current.scrollHeight
        return 0
    }

    useEffect(() => {
        if (findContentHeight() > height) setOverflow(true)
        else setOverflow(false)
    }, [props])

    function showMoreLess() {
        // // if expanded, scroll back to top of content
        // if (expanded && contentRef.current) {
        //     const contentTop = contentRef.current.getBoundingClientRect().top
        //     const yOffset = window.pageYOffset - window.screen.height / 2 + 200
        //     const top = contentTop + yOffset
        //     window.scrollTo({ top, behavior: 'smooth' })
        // }
        setExpanded(!expanded)
    }

    return (
        <div className={styles.wrapper}>
            <div
                ref={contentRef}
                className={styles.content}
                style={{
                    maxHeight: expanded ? findContentHeight() : height,
                }}
            >
                {children}
                {overflow && !expanded && <div className={styles.gradient} />}
            </div>
            {overflow && (
                <div
                    className={`${styles.showMoreLessButton} ${expanded && styles.expanded}`}
                    role='button'
                    tabIndex={0}
                    aria-label='showMoreLess'
                    onClick={showMoreLess}
                    onKeyDown={showMoreLess}
                >
                    <ChevronIconSVG />
                </div>
            )}
        </div>
    )
}

export default ShowMoreLess
